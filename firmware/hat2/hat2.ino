#include <OctoWS2811.h>
#include "math.h"
#include <ParticleEmitter.h>
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
// ParticleEmitter emitter = ParticleEmitter(leds.numPixels(), 0x999999);
ParticleEmitter emitter = ParticleEmitter(8 * 41);

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

//Byte val 2PI Cosine Wave, offset by 1 PI 
//supports fast trig calcs and smooth LED fading/pulsing.
uint8_t const cos_wave[256] PROGMEM =  
{0,0,0,0,1,1,1,2,2,3,4,5,6,6,8,9,10,11,12,14,15,17,18,20,22,23,25,27,29,31,33,35,38,40,42,
45,47,49,52,54,57,60,62,65,68,71,73,76,79,82,85,88,91,94,97,100,103,106,109,113,116,119,
122,125,128,131,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,
189,191,194,197,199,202,204,207,209,212,214,216,218,221,223,225,227,229,231,232,234,236,
238,239,241,242,243,245,246,247,248,249,250,251,252,252,253,253,254,254,255,255,255,255,
255,255,255,255,254,254,253,253,252,252,251,250,249,248,247,246,245,243,242,241,239,238,
236,234,232,231,229,227,225,223,221,218,216,214,212,209,207,204,202,199,197,194,191,189,
186,183,180,177,174,171,168,165,162,159,156,153,150,147,144,141,138,135,131,128,125,122,
119,116,113,109,106,103,100,97,94,91,88,85,82,79,76,73,71,68,65,62,60,57,54,52,49,47,45,
42,40,38,35,33,31,29,27,25,23,22,20,18,17,15,14,12,11,10,9,8,6,6,5,4,3,2,2,1,1,1,0,0,0,0
};


//Gamma Correction Curve
uint8_t const exp_gamma[256] PROGMEM =
{0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,
4,4,4,4,4,5,5,5,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,10,10,10,11,11,12,12,12,13,13,14,14,14,15,15,
16,16,17,17,18,18,19,19,20,20,21,21,22,23,23,24,24,25,26,26,27,28,28,29,30,30,31,32,32,33,
34,35,35,36,37,38,39,39,40,41,42,43,44,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,
61,62,63,64,65,66,67,68,70,71,72,73,74,75,77,78,79,80,82,83,84,85,87,89,91,92,93,95,96,98,
99,100,101,102,105,106,108,109,111,112,114,115,117,118,120,121,123,125,126,128,130,131,133,
135,136,138,140,142,143,145,147,149,151,152,154,156,158,160,162,164,165,167,169,171,173,175,
177,179,181,183,185,187,190,192,194,196,198,200,202,204,207,209,211,213,216,218,220,222,225,
227,229,232,234,236,239,241,244,246,249,251,253,254,255
};

uint8_t x_bitmap[8][8][3] = {
  {{255,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,255,0}}, 
  {{0,0,0}, {255,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,255,0}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {255,0,0}, {0,0,0}, {0,0,0}, {0,255,0}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {0,0,0}, {255,0,0}, {0,255,0}, {0,0,0}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {0,0,0}, {0,255,0}, {255,0,0}, {0,0,0}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {0,255,0}, {0,0,0}, {0,0,0}, {255,0,0}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {0,255,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {255,0,0}, {0,0,0}}, 
  {{0,255,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {255,0,0}}
};

uint8_t const space_invader1[8][11][3] PROGMEM = {
  {{0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {255,255,255}, {255,255,255}, {0,0,255}, {255,255,255}, {255,255,255}, {255,255,255}, {0,0,255}, {255,255,255}, {255,255,255}, {0,0,0}}, 
  {{255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}}, 
  {{255,255,255}, {0,0,0}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {0,0,0}, {255,255,255}}, 
  {{255,255,255}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {255,255,255}}, 
  {{0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {255,255,255}, {0,0,0}, {255,255,255}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}}
};


uint8_t const space_invader2[8][11][3] PROGMEM = {
  {{0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}}, 
  {{255,255,255}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {255,255,255}}, 
  {{255,255,255}, {0,0,0}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {0,0,0}, {255,255,255}}, 
  {{255,255,255}, {255,255,255}, {255,255,255}, {0,255,0}, {255,255,255}, {255,255,255}, {255,255,255}, {0,255,0}, {255,255,255}, {255,255,255}, {255,255,255}}, 
  {{255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}}, 
  {{0,0,0}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {255,255,255}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {255,255,255}, {0,0,0}}
};

uint8_t const timbers_logo[8][8][3] PROGMEM = {
  {{0,0,0}, {0,0,0}, {0,0,0}, {0,0,0}, {1,1,1}, {0,0,0}, {0,0,0}, {0,0,0}}, 
  {{0,0,0}, {0,0,0}, {254,254,254}, {0,71,7}, {8,73,19}, {7,75,24}, {253,255,254}, {0,0,0}}, 
  {{0,0,0}, {12,76,15}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {255,255,255}, {128,160,49}}, 
  {{0,0,0}, {8,73,19}, {8,73,19}, {6,68,21}, {255,255,255}, {9,73,21}, {7,72,18}, {9,73,21}}, 
  {{0,0,0}, {9,74,18}, {8,72,20}, {14,72,24}, {255,255,255}, {10,66,19}, {9,72,17}, {9,72,17}}, 
  {{0,0,0}, {11,71,19}, {6,72,26}, {158,191,40}, {255,255,255}, {0,66,13}, {14,70,23}, {13,69,8}}, 
  {{0,0,0}, {82,95,88}, {183,211,66}, {8,73,19}, {255,255,255}, {8,73,19}, {6,74,17}, {1,78,10}}, 
  {{0,0,0}, {0,0,0}, {0,0,0}, {12,61,29}, {255,255,255}, {2,74,26}, {12,59,15}, {0,2,1}}
};

uint8_t invader2_1[192] PROGMEM = {0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 
                                   0,0,0, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 
                                   0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 
                                   255,255,255, 255,255,255, 255,0,0, 255,255,255, 255,255,255, 255,0,0, 255,255,255, 255,255,255,
                                   255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 
                                   0,0,0, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 
                                   0,0,0, 255,255,255, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 255,255,255, 0,0,0, 
                                   255,255,255, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 0,0,0, 255,255,255};
uint8_t invader2_1_w = 8;
uint8_t invader2_1_h = 8;

uint8_t invader2_2[192] PROGMEM = {0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 254,254,254, 254,254,254, 255,255,255, 255,255,255, 0,0,0, 255,255,255, 255,255,255, 0,255,0, 255,255,255, 255,255,255, 0,255,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 15,15,15, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 15,15,15, 0,0,0, 255,255,255, 0,0,0, 0,0,0};
uint8_t invader2_2_w = 8;
uint8_t invader2_2_h = 8;

uint8_t invader3_1[288] PROGMEM = {0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,255, 0,0,255, 255,255,255, 255,255,255, 0,0,255, 0,0,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 15,15,15, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 15,15,15, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 0,0,0, 0,0,0, 0,0,0};
uint8_t invader3_1_w = 12;
uint8_t invader3_1_h = 8;

uint8_t invader3_2[288] PROGMEM = {0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,0,0, 255,0,0, 255,255,255, 255,255,255, 255,0,0, 255,0,0, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 252,252,252, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 17,17,17, 32,32,32, 255,255,255, 255,255,255, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 255,255,255, 255,255,255, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 255,255,255, 255,255,255};
uint8_t invader3_2_w = 12;
uint8_t invader3_2_h = 8;

void setBitmap(uint8_t* bmp, int height, int width, int upperLeft, bool show)
{
  int index = 0;
  for(int y=0; y<height; y++)
  {
    for(int x=upperLeft; x<(upperLeft + (width * 3)); x+=3)
    {
      int addr;
      int realx = x / 3;
      addr = getPixelAddress(y,realx);
      int r = bmp[index + 0];
      int g = bmp[index + 1];
      int b = bmp[index + 2];
      leds.setPixel(addr, colorFromRGB(r, g, b));
      index += 3;
    }
    
  }
  if(show)
    leds.show();
}

void setAllOff()
{
  for(int i=0; i<HORI; i++)
  {
    for(int j=0; j<VERT; j++)
    {
      leds.setPixel(getPixelAddress(j,i), colorFromRGB(0,0,0));
    }
  }
}

void spaceInvaders()
{
  int i = 0;
  // for(int i=0; i<HORI; i++)
  while(true)
  {
    setBitmap(invader3_1, invader3_1_h, invader3_1_w, i, false);
    // setBitmap(invader3_1, invader3_1_h, invader3_1_w, i + 24, false);
    leds.show();
    delay(500);
    setAllOff();
    i++;

    setBitmap(invader3_2, invader3_2_h, invader3_2_w, i, false);
    // setBitmap(invader3_1, invader3_1_h, invader3_1_w, i + 24, false);
    leds.show();
    delay(500);
    setAllOff();
    i++;

    // setBitmap(invader2_2, invader2_2_h, invader2_2_w, i, false);
    // // setBitmap(invader3_2, invader3_2_h, invader3_2_w, i + 24, false);
    // leds.show();
    // delay(500);
    // setAllOff();
    // i++;
    if(i > HORI * 2)
      i = 0;
  }
}

void loop() 
{
  spaceInvaders();

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

  // plasma();

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
  //    particles();
  // }

  // for(int i=0; i<200; i++)
  // {
  //   sparkle(BLACK, GREEN);
  //   delay(30);
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
      uint32_t red = (MAX_VAL + 96 * sin(t + 0.8)) / 10;
      uint32_t green = (MAX_VAL + 96 * sin(t + 0.6)) / 10;
      uint32_t blue = (MAX_VAL + 96 * sin(t + 0.1)) / 10;
      uint32_t color = colorFromRGB(red, green, blue);
      Serial.print("color:");
      Serial.println(color);

      leds.setPixel(pixel, colorFromRGB(red, green, blue));
  }
  leds.show();
  delay(10);
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
      
      particle prt = emitter.updateParticle(i);
      uint16_t pixel = leds.numPixels() * prt.currentStripPosition;
  
      // High velocity particles have longer tails
      uint8_t tailLength = abs(prt.velocity * 5);
      uint8_t slot = pixel;
      
      for (int z=0; z < tailLength; z++) { 
        
        float colorScale = ( (tailLength-z*0.999) / tailLength );
        if (z == 0 && prt.dimmed) {
          colorScale *= 0.25;
        }

        leds.setPixel(slot, colorFromRGB(prt.redColor*colorScale, 
                                              prt.blueColor*colorScale, 
                                              prt.greenColor*colorScale));

        slot = pixel + ((z+1) * (prt.velocity > 0 ? -1 : 1));
      }
      leds.setPixel(slot, colorFromRGB(0,0,0));
    }
    leds.show();
    delay(50);
  }
}

void plasma()
{
  unsigned long frameCount=25500;  // arbitrary seed to calculate the three time displacement variables t,t2,t3
  for(int i=0; i<1000; i++) {
    frameCount++ ; 
    uint16_t t = fastCosineCalc((42 * frameCount)/100);  //time displacement - fiddle with these til it looks good...
    uint16_t t2 = fastCosineCalc((35 * frameCount)/100); 
    uint16_t t3 = fastCosineCalc((38 * frameCount)/100);

    for (uint8_t y = 0; y < VERT; y++) {
      int left2Right, pixelIndex;
      if (((y % (VERT/8)) & 1) == 0) {
        left2Right = 1;
        pixelIndex = y * HORI;
      } else {
        left2Right = -1;
        pixelIndex = (y + 1) * HORI - 1;
      }
      for (uint8_t x = 0; x < HORI ; x++) {
        //Calculate 3 seperate plasma waves, one for each color channel
        uint8_t r = fastCosineCalc(((x << 3) + (t >> 1) + fastCosineCalc((t2 + (y << 3))))) / 10;
        uint8_t g = fastCosineCalc(((y << 3) + t + fastCosineCalc(((t3 >> 2) + (x << 3))))) / 10;
        uint8_t b = fastCosineCalc(((y << 3) + t2 + fastCosineCalc((t + x + (g >> 2))))) / 10;
        //uncomment the following to enable gamma correction
        //r=pgm_read_byte_near(exp_gamma+r);  
        //g=pgm_read_byte_near(exp_gamma+g);
        //b=pgm_read_byte_near(exp_gamma+b);
        leds.setPixel(pixelIndex, ((r << 16) | (g << 8) | b));
        pixelIndex += left2Right;
      }
    }
    digitalWrite(13, HIGH);
    leds.show();  // not sure if this function is needed  to update each frame
    delay(8);
    digitalWrite(13, LOW);
  }
}

void setPixels(uint8_t pixels[][8][3], int size_x, int size_y, int row, int start_col)
{
  for(int x=0; x<size_x; x++)
  {
    int col = x + start_col;
    if(col > HORI)
      continue;
    for(int y=0; y<size_y; y++)
    {
      int addr = getPixelAddress(x, y);
      leds.setPixel(addr, colorFromRGB(pixels[x][y][0], 
                          pixels[x][y][1], 
                          pixels[x][y][2]));
    }
  }
}

inline uint8_t fastCosineCalc( uint16_t preWrapVal)
{
  uint8_t wrapVal = (preWrapVal % 255);
  if (wrapVal<0) wrapVal=255+wrapVal;
  return (pgm_read_byte_near(cos_wave+wrapVal)); 
}

int getPixelAddress(int row, int col)
{
  return (row * HORI) + col;

  // int addr;
  // if(row % 2 == 0)
  // {
  //   addr = (row * HORI) + col;
  // }
  // else
  // {
  //   int offset = HORI - ((col * 2) + 1) ;
  //   addr = ((row * HORI) + col) + offset;
  // }
  // return addr;
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
