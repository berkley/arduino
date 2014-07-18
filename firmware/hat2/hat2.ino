#include <OctoWS2811.h>
#include "math.h"
#include <LEDStripParticleEmitter.h>
// #include <Audio.h>
// #include <Wire.h>
// #include <SD.h>

#define HORI 41
#define VERT 8
#define MAX_RGB 128

const int ledsPerStrip = 41;
const int MIC_PIN = A3;

DMAMEM int displayMemory[ledsPerStrip*6];
int drawingMemory[ledsPerStrip*6];

const int config = WS2811_GRB | WS2811_800kHz;

OctoWS2811 leds(ledsPerStrip, displayMemory, drawingMemory, config);
ParticleEmitter emitter = ParticleEmitter(leds.numPixels(), 0x999999);

void setup() {
  Serial.begin(9600);
  pinMode(MIC_PIN, INPUT);
  leds.begin();
  leds.show();
  Serial.print("Setup Done");
}

#define RED    0xFF0000
#define GREEN  0x00FF00
#define BLUE   0x0000FF
#define YELLOW 0xFFFF00
#define PINK   0xFF1088
#define ORANGE 0xE05800
#define WHITE  0xFFFFFF
#define LIGHT_WHITE 0x202020
#define PURPLE  0x4C0099
#define BLACK  0x000000
#define LIGHT_BLUE 0x0000A0

void loop() 
{
  // int microsec = 2000000 / leds.numPixels(); 
  // int mic_val = analogRead(MIC_PIN);
  // Serial.print("mic_val: ");
  // Serial.println(mic_val);
  // delay(100);

  // uncomment for voltage controlled speed
  // millisec = analogRead(A9) / 40;

  // colorWipe(RED, microsec);
  // colorWipe(GREEN, microsec);
  // colorWipe(BLUE, microsec);
  // colorWipe(YELLOW, microsec);
  // colorWipe(PINK, microsec);
  // colorWipe(ORANGE, microsec);
  // colorWipe(WHITE, microsec);

  // for(int i=0; i<200; i++)
  // {
  //   sparkle(BLACK, PURPLE);
  //   delay(30);
  // }

  // for(int i=0; i<10; i++)
  // {
  //   colorfulWipe();
  // }

  // rainbowCycle(5);

  // for(int i=0; i<200; i++)
  // {
  //   followMe();
  // }

  // setAll(BLACK);

  // for(int i=0; i<2; i++)
  // {
     particles();
  // }
  
  
}

void colorfulWipe()
{

  uint32_t color = colorFromRGB(random(50), random(50), random(50));
  for(int i=0; i<leds.numPixels(); i++)
  {
    leds.setPixel(i, color);
    leds.show();
     delay(8);
  }

  for(int i=leds.numPixels(); i>=0; i--)
  {
    leds.setPixel(i, BLACK);
    leds.show();
    // delay(8);
  }
}

void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< leds.numPixels(); i++) {
      leds.setPixel(i, Wheel(((i * 256 / leds.numPixels()) + j) & 255));
    }
    leds.show();
    delay(wait);
  }
}

void followMe()
{
  int MAX_VAL = 56;
  uint32_t time = millis();
  // Serial.print("time:");
  // Serial.println(time);
  for (int pixel = 0; pixel < HORI * VERT; pixel++)
  {
      float t = pixel * 0.2 + time * 0.002;
      uint32_t red = MAX_VAL + 96 * sin(t + 0.8);
      uint32_t green = MAX_VAL + 96 * sin(t + 0.6);
      uint32_t blue = MAX_VAL + 96 * sin(t + 0.1);
      uint32_t color = colorFromRGB(red, green, blue);
      Serial.print("color:");
      Serial.println(color);

      leds.setPixel(pixel, colorFromRGB(red, green, blue));
  }
  leds.show();
  delay(30);
}

void colorWipe(int color, int wait)
{
  

  for(int i=0; i<VERT; i++)
  {
    for(int j=0; j<HORI; j++)
    {
      int addr = getPixelAddress(i, j);
      Serial.println(addr);

      leds.setPixel(addr, color);
      leds.show();
      delayMicroseconds(wait);
    }
  }
  // for(int i=0; i<VERT * HORI; i++)
  // {
  //   leds.setPixel(i, color);
  //   leds.show();
  //   delayMicroseconds(wait);
  // }
}

void sparkle(uint32_t c, uint32_t c2)
{
  setAll(c);
  for(int i=0; i<10; i++)
  {
    int addr = random(VERT * HORI);
    leds.setPixel(addr, c2);
  }
  leds.show();
}

void setAll(uint32_t c)
{
  for(int i=0; i<HORI; i++)
  {
    setCol(c, i);
  }
  leds.show();
}

void setCol(uint32_t c, uint8_t col)
{
  for(int i=0; i<VERT; i++)
  { 
    int addr = getPixelAddress(i, col);  
    leds.setPixel(addr, c);
  }
}

void particles() {
  emitter.stripPosition = random(100) / 100.0;

  for (int j=0; j < emitter.numParticles * 10; j++) {  
    
    for (int i=0; i < emitter.numParticles; i++) {
      
      Particle prt = emitter.updateParticle(i, true);
      uint16_t pixel = leds.numPixels() * emitter.stripPosition;
  
      // High velocity particles have longer tails
       uint8_t tailLength = abs(emitter.maxVelocity * 5);
      // uint8_t tailLength = 10;
      uint8_t slot = pixel;

      
      for (int z=0; z < tailLength; z++) { 
        
        float colorScale = ( (tailLength-z*0.999) / tailLength );
        if (z == 0 && prt.dimmed) {
          colorScale *= 0.25;
        }
        Serial.println(slot);
        leds.setPixel(slot, colorFromRGB(prt.redColor*colorScale, 
                                              prt.blueColor*colorScale, 
                                              prt.greenColor*colorScale));

        slot = pixel + ((z+1) * (emitter.maxVelocity > 0 ? -1 : 1));
      }
      Serial.println(slot);
      leds.setPixel(slot, colorFromRGB(0,0,0));
    }
    leds.show();
    delay(50);
  }
  // emitter.begin();
}

int getPixelAddress(int row, int col)
{
  int addr;
  if(row % 2 == 0)
  {
    addr = (row * HORI) + col;
  }
  else
  {
    int offset = HORI - ((col * 2) + 1) ;
    addr = ((row * HORI) + col) + offset;
  }
  return addr;
}

uint32_t Wheel(byte WheelPos) {
  if(WheelPos < 85) {
   return colorFromRGB(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return colorFromRGB(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return colorFromRGB(0, WheelPos * 3, 255 - WheelPos * 3);
  }
}

uint32_t colorFromRGB(int red, int green, int blue)
{
  uint32_t color = red<<16 | green<<8 | blue;
  return color;
}
