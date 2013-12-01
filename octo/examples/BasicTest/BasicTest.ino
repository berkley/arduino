#include <OctoWS2811.h>

#define HORI 16
#define VERT 16

const int ledsPerStrip = 32;

DMAMEM int displayMemory[ledsPerStrip*6];
int drawingMemory[ledsPerStrip*6];

const int config = WS2811_GRB | WS2811_800kHz;

OctoWS2811 leds(ledsPerStrip, displayMemory, drawingMemory, config);

void setup() {
  leds.begin();
  leds.show();
}

#define RED    0xFF0000
#define GREEN  0x00FF00
#define BLUE   0x0000FF
#define YELLOW 0xFFFF00
#define PINK   0xFF1088
#define ORANGE 0xE05800
#define WHITE  0xFFFFFF
#define LIGHT_WHITE 0x191919
#define PURPLE  0x4C0099

void loop() 
{
  int microsec = 2000000 / leds.numPixels(); 

  // uncomment for voltage controlled speed
  // millisec = analogRead(A9) / 40;

  // colorWipe(RED, microsec);
  // colorWipe(GREEN, microsec);
  // colorWipe(BLUE, microsec);
  // colorWipe(YELLOW, microsec);
  // colorWipe(PINK, microsec);
  // colorWipe(ORANGE, microsec);
  // colorWipe(WHITE, microsec);

  sparkle(GREEN, RED);
  delay(20);
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
