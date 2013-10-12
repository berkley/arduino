#include <Adafruit_NeoPixel.h>
#include "ParticleEmitter.h"

#define PIN 6
#define VERT 8
#define HORI 18
#define NUM_PIXELS 144

#define ORANGE strip.Color(255, 69, 0)
#define YELLOW strip.Color(255, 255, 0)
#define RED strip.Color(255, 0, 0)
#define BLUE strip.Color(0, 0, 255)
#define GREEN strip.Color(0, 255, 0)
#define WHITE strip.Color(255, 255, 255)
#define BLACK strip.Color(0, 0, 0)

/*
0 00 .. 17
1 18 .. 35 //reverse
2 36 .. 53
3 54 .. 71 //reverse
4 72 .. 89
5 90 .. 107 //reverse
6 108 .. 125
7 126 .. 143 //reverse
*/

// Parameter 1 = number of pixels in strip
// Parameter 2 = pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_RGB     Pixels are wired for RGB bitstream
//   NEO_GRB     Pixels are wired for GRB bitstream
//   NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
//   NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, PIN, NEO_GRB + NEO_KHZ800);
ParticleEmitter emitter = ParticleEmitter(NUM_PIXELS);

bool H[][6] = {{1, 1, 0, 0, 1, 1},
                      {1, 1, 0, 0, 1, 1},
                      {1, 1, 0, 0, 1, 1},
                      {1, 1, 1, 1, 1, 1},
                      {1, 1, 1, 1, 1, 1},
                      {1, 1, 0, 0, 1, 1},
                      {1, 1, 0, 0, 1, 1},
                      {1, 1, 0, 0, 1, 1}};

void setup() {
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

void loop() {
  // createChar(RED, H, 6, 8, 0);
  // strip.show();

  // delay(10000);
  particles();
  rowSwipe(ORANGE, false);
  particles();
  colSwipe(BLUE, false);

  // Some example procedures showing how to display to the pixels:
  // colorWipe(strip.Color(255, 0, 0), 50); // Red
  // colorWipe(strip.Color(0, 255, 0), 50); // Green
  // colorWipe(strip.Color(0, 0, 255), 50); // Blue
  // rainbow(20);
  // rainbowCycle(20);
}

void createChar(uint32_t c, bool character[][6], int size_t, int size_u, int start)
{
  for(int i=0; i<size_t; i++)
  { //rows
    for(int j=0; j<size_u; j++)
    { //cols
      setCol(c, j, character[i], size_u);
    }
  }
}

void rowSwipe(uint32_t c, bool reset)
{
  for(int i=0; i<HORI; i++)
  {
    if(reset)
    {
      if(i > 0)
        setCol(BLACK, i - 1);
      else
        setCol(BLACK, HORI - 1);
    }
    setCol(c, i);
    strip.show();
    delay(10);
  }
}

void colSwipe(uint32_t c, bool reset)
{
  for(int i=0; i<VERT; i++)
  {
    if(reset)
    {
      if(i > 0)
        setRow(BLACK, i - 1);
      else
        setRow(BLACK, VERT - 1);
    }
    setRow(c, i);
    strip.show();
    delay(10);
  }
}

void allOff()
{
  setRow(strip.Color(0, 0, 0), 0);
  setRow(strip.Color(0, 0, 0), 1);
  setRow(strip.Color(0, 0, 0), 2);
  setRow(strip.Color(0, 0, 0), 3);
  setRow(strip.Color(0, 0, 0), 4);
  setRow(strip.Color(0, 0, 0), 5);
  setRow(strip.Color(0, 0, 0), 6);
  setRow(strip.Color(0, 0, 0), 7);
}

void setRow(uint32_t c, uint8_t row)
{
  for(int i=0; i<HORI; i++)
  {
    int addr = i + (row * HORI);
    strip.setPixelColor(addr, c);
  }
}

int getColAddr(int row, int col)
{
  int addr;
  if(row % 2 == 0)
  {
    addr = (row * HORI) + col;
  }
  else
  {
    // int offset = ((i * HORI) + col) + (HORI - col);
    int offset = 0;
    offset = HORI - ((col * 2) + 1) ;
    addr = ((row * HORI) + col) + offset;
  }

  return addr;
}

void setCol(uint32_t c, uint8_t col)
{
  for(int i=0; i<VERT; i++)
  { 
    int addr = getColAddr(i, col);  
    strip.setPixelColor(addr, c);
  }
}

void setCol(uint32_t c, uint8_t col, bool* pixels, int size_t)
{
  if(size_t != VERT) //size of the array must be the same as the vertical resolution
    setCol(strip.Color(255,0,0), 0); //set the first row to red if there's an error

  for(int i=0; i<size_t; i++)
  {
    int addr = getColAddr(i, col);
    if(pixels[i])
    {
      strip.setPixelColor(addr, c);
    }
    else
    {
      strip.setPixelColor(addr, strip.Color(0,0,0)); //set the pixel off
    }
  }
}

// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
      delay(wait);
  }
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  if(WheelPos < 85) {
   return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
}

void particles() {
  emitter.stripPosition = random(100) / 100.0;

  for (int j=0; j < emitter.numParticles * 10; j++) {  
    for (int i=0; i < emitter.numParticles; i++) {
      particle prt = emitter.updateParticle(i);
      uint16_t pixel = NUM_PIXELS * prt.currentStripPosition;
  
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
    delay(1);
  }
}

