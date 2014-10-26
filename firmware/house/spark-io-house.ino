#include "particles/particles.h"
#include "application.h"
#include "neopixel/neopixel.h"

#define PIXEL_PIN D2
#define PIXEL_COUNT 600
#define PIXEL_TYPE WS2812B

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);
ParticleEmitter emitter = ParticleEmitter(PIXEL_COUNT * 2);
char action[64];
char parameters[64];

void setup() 
{
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  Spark.function("run", run);
  Spark.variable("action", &action, STRING);
  Spark.variable("parameters", &parameters, STRING);
}

String loopRun = "stop";
String *loopArgs = new String[20];

void loop() 
{
    if(loopRun.equals("stop"))
    {
        delay(1000);
    }
    else if(loopRun.equals("rainbow"))
    {
        rainbow(20);        
    }
    else if(loopRun.equals("alternate"))
    {
        int r1 = stringToInt(loopArgs[0]);
        int g1 = stringToInt(loopArgs[1]);
        int b1 = stringToInt(loopArgs[2]);
        int r2 = stringToInt(loopArgs[3]);
        int g2 = stringToInt(loopArgs[4]);
        int b2 = stringToInt(loopArgs[5]);
        int d = stringToInt(loopArgs[6]);

        staticAlternate(r1, g1, b1, r2, g2, b2);
        delay(d);
        staticAlternate(r2, g2, b2, r1, g1, b1);
        delay(d);
    }
    else if(loopRun.equals("blocks"))
    {
        int r1 = stringToInt(loopArgs[0]);
        int g1 = stringToInt(loopArgs[1]);
        int b1 = stringToInt(loopArgs[2]);
        int r2 = stringToInt(loopArgs[3]);
        int g2 = stringToInt(loopArgs[4]);
        int b2 = stringToInt(loopArgs[5]);
        int d = stringToInt(loopArgs[6]);
        int blockSize = stringToInt(loopArgs[7]);
        
        buildBlocks(r1, g1, b1, r2, g2, b2, blockSize);
        delay(d);
        buildBlocks(r2, g2, b2, r1, g1, b1, blockSize);
        delay(d);
    }
    else if(loopRun.equals("fadeColor"))
    {
        int r1 = stringToInt(loopArgs[0]);
        int g1 = stringToInt(loopArgs[1]);
        int b1 = stringToInt(loopArgs[2]);
        int r2 = stringToInt(loopArgs[3]);
        int g2 = stringToInt(loopArgs[4]);
        int b2 = stringToInt(loopArgs[5]);
        int d = stringToInt(loopArgs[6]);
        int duration = stringToInt(loopArgs[7]);
        
        fadeColor(r1, g1, b1, r2, g2, b2, d, duration);
        delay(d);
        fadeColor(r2, g2, b2, r1, g1, b1, d, duration);
        delay(d);
    }
    else if(loopRun.equals("particles"))
    {
        particles(); 
    }
}

int allOff()
{
    loopRun = "stop";
    setAll(0,0,0);
    return 1;
}

int run(String params)
{
    //params format is <command>,<param0>,...,<paramN>
    String* args = stringSplit(params, ',');
    String command = args[0];
    strcpy(parameters, params.c_str());
    strcpy(action, command.c_str());
    loopRun = "stop";
    if(command.equals("allOff"))
    {
        return allOff();
        return 1;
    }
    else if(command.equals("setAll"))
    {
        int r = stringToInt(args[1]);
        int g = stringToInt(args[2]);
        int b = stringToInt(args[3]);
        return setAll(r, g, b);
    }
    else if(command.equals("alternate"))
    {
        int r1 = stringToInt(args[1]);
        int g1 = stringToInt(args[2]);
        int b1 = stringToInt(args[3]);
        int r2 = stringToInt(args[4]);
        int g2 = stringToInt(args[5]);
        int b2 = stringToInt(args[6]);
        return staticAlternate(r1, g1, b1, r2, g2, b2);
    }
    else if(command.equals("loopAlternate"))
    {
        loopRun = "alternate";
        loopArgs[0] = args[1]; //r1
        loopArgs[1] = args[2]; //g1
        loopArgs[2] = args[3]; //b1
        loopArgs[3] = args[4]; //r2
        loopArgs[4] = args[5]; //g2
        loopArgs[5] = args[6]; //b2
        loopArgs[6] = args[7]; //delay
        return 1;
    }
    else if(command.equals("loopBlocks"))
    {
        loopRun = "blocks";
        loopArgs[0] = args[1]; //r1
        loopArgs[1] = args[2]; //g1
        loopArgs[2] = args[3]; //b1
        loopArgs[3] = args[4]; //r2
        loopArgs[4] = args[5]; //g2
        loopArgs[5] = args[6]; //b2
        loopArgs[6] = args[7]; //delay
        loopArgs[7] = args[8]; //block size
        return 1;
    }
    else if(command.equals("blocks"))
    {
        int r1 = stringToInt(args[1]);
        int g1 = stringToInt(args[2]);
        int b1 = stringToInt(args[3]);
        int r2 = stringToInt(args[4]);
        int g2 = stringToInt(args[5]);
        int b2 = stringToInt(args[6]);
        int blockSize = stringToInt(args[7]);
        buildBlocks(r1, g1, b1, r2, g2, b2, blockSize);
    }
    else if(command.equals("fadeColor"))
    {
        //possible commands: stop, rainbow, alternate
        loopRun = "fadeColor";
        loopArgs[0] = args[1]; //r1
        loopArgs[1] = args[2]; //g1
        loopArgs[2] = args[3]; //b1
        loopArgs[3] = args[4]; //r2
        loopArgs[4] = args[5]; //g2
        loopArgs[5] = args[6]; //b2
        loopArgs[6] = args[7]; //delay
        loopArgs[7] = args[8]; //duration
        return 1;
    }
    else if(command.equals("rainbow"))
    {
        loopRun = "rainbow";
        return 1;
    }
    else if(command.equals("particles"))
    {
        loopRun = "particles";
        return 1;
    }
    else if(command.equals("latchPixel"))
    {
        int pixel = stringToInt(args[0]);
        int r1 = stringToInt(args[1]);
        int g1 = stringToInt(args[2]);
        int b1 = stringToInt(args[3]);
        strip.setPixelColor(pixel, strip.Color(r1, g1, b1));
        strip.show();
        return 1;
    }
    else if(command.equals("setPixel"))
    {
        int pixel = stringToInt(args[0]);
        int r1 = stringToInt(args[1]);
        int g1 = stringToInt(args[2]);
        int b1 = stringToInt(args[3]);
        strip.setPixelColor(pixel, strip.Color(r1, g1, b1));
        return 1;
    }
    else if(command.equals("latch"))
    {
        strip.show();
        return 1;
    }
    else if(command.equals("stop"))
    {
        allOff();
    }
    else 
    { //command not found
        return 0;
    }
}

int buildBlocks(uint8_t r1, uint8_t g1, uint8_t b1, 
                uint8_t r2, uint8_t g2, uint8_t b2,
                uint8_t blockSize)
{               
    bool inBlock = true;
    
    for(int i=0; i<strip.numPixels(); i++) {
        if(i % blockSize == 0)
        {
            inBlock = !inBlock;
        }
        
        if(inBlock)
        {
            strip.setPixelColor(i, strip.Color(r1, g1, b1));
        }
        else
        {
            strip.setPixelColor(i, strip.Color(r2, g2, b2));
        }
    }
    strip.show();
    return 1;
}
                    

int staticAlternate(uint8_t r1, uint8_t g1, uint8_t b1, 
                    uint8_t r2, uint8_t g2, uint8_t b2)
{
    for(int i=0; i<strip.numPixels(); i++) {
        if(i % 2 == 0)
        {
            strip.setPixelColor(i, strip.Color(r1, g1, b1));
        }
        else
        {
            strip.setPixelColor(i, strip.Color(r2, g2, b2));
        }
    }
    strip.show();
    return 1;
}

int setRGB(String rgb)
{
    String r = rgb.substring(0,3);
    String g = rgb.substring(3,6);
    String b = rgb.substring(6,10);
    
    setAll(stringToInt(r), stringToInt(g), stringToInt(b));
    return 1;
}

int setAll(uint8_t r, uint8_t g, uint8_t b)
{
    for(int i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, strip.Color(r, g, b));
    }
    strip.show();
    return 1;
}

int rainbow(int d) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(d);
  }
  return 1;
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  int maxVal = 255;
  if(WheelPos < 85) {
   return strip.Color(WheelPos * 3, maxVal - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return strip.Color(maxVal - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(0, WheelPos * 3, maxVal - WheelPos * 3);
  }
}

int stringToInt(String s)
{
    char* str = new char[s.length() + 1];
    strcpy(str, s.c_str());
    int out = atoi(str);
    free(str);
    return out;
}

String* stringSplit(String s, char delim)
{
    String* strArr = new String[20];
    int arrcnt = 0;
    String token = "";
    for(uint8_t i=0; i<s.length(); i++)
    {
        char c = s.charAt(i);
        if(c == delim)
        {
            strArr[arrcnt] = token;
            arrcnt++;
            token = "";
        }
        else
        {
            token.concat(String(c));
        }
    }
    strArr[arrcnt] = token;
    return strArr;
}

int fadeColor(uint8_t r1, uint8_t g1, uint8_t b1, 
              uint8_t r2, uint8_t g2, uint8_t b2, 
              int del, int duration)
{
 
    int16_t redDiff = r2 - r1;
    int16_t greenDiff = g2 - g1;
    int16_t blueDiff = b2 - b1;

    int16_t steps = duration / del;

    int16_t redValue, greenValue, blueValue;

    for (int16_t i = steps; i >= 0; i--) {
        redValue = r1 + (redDiff * i / steps);
        greenValue = g1 + (greenDiff * i / steps);
        blueValue = b1 + (blueDiff * i / steps);

        for (uint16_t i = 0; i < strip.numPixels(); i++) {
            strip.setPixelColor(i, strip.Color(redValue, greenValue, blueValue));
        }
        strip.show();
        delay(del);
    }

    return 1;
}

void particles() {
  emitter.stripPosition = random(100) / 100.0;

  for (int j=0; j < emitter.numParticles * 10; j++) {  
    for (int i=0; i < emitter.numParticles; i++) {
      
      particle prt = emitter.updateParticle(i);
      uint16_t pixel = strip.numPixels() * prt.currentStripPosition;
  
      // High velocity particles have longer tails
      uint8_t tailLength = abs(prt.velocity * 5);
      uint8_t slot = pixel;
      
      for (int z=0; z < tailLength; z++) { 
        
        float colorScale = ( (tailLength-z*0.999) / tailLength );
        if (z == 0 && prt.dimmed) {
          colorScale *= 0.25;
        }

        strip.setPixelColor(slot, strip.Color(prt.redColor*colorScale, 
                                              prt.blueColor*colorScale, 
                                              prt.greenColor*colorScale));

        slot = pixel + ((z+1) * (prt.velocity > 0 ? -1 : 1));
      }
      strip.setPixelColor(slot, strip.Color(0,0,0));
    }
    strip.show();
    delay(50);
  }
}