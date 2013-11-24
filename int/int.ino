#include <Adafruit_NeoPixel.h>
#include "ParticleEmitter.h"

#define PIN 4
#define INT1_PIN 6
#define VERT 8
#define HORI 8
#define NUM_PIXELS 64
#define CHAR_WIDTH 6
#define CHAR_HEIGHT 8

#define ORANGE strip.Color(255, 69, 0)
#define YELLOW strip.Color(255, 255, 0)
#define RED strip.Color(255, 0, 0)
#define BLUE strip.Color(0, 0, 255)
#define GREEN strip.Color(0, 255, 0)
#define WHITE strip.Color(255, 255, 255)
#define BLACK strip.Color(0, 0, 0)

#define PROG_MAX 3

#define CHECKINT if(intOccured) {return;}

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_PIXELS, PIN, NEO_GRB + NEO_KHZ800);
ParticleEmitter emitter = ParticleEmitter(NUM_PIXELS);

// bool HALLOWEEN[9][CHAR_HEIGHT][CHAR_WIDTH] = {H,A,L,L,O,W,E,E,N};
// bool HAPPY[5][CHAR_HEIGHT][CHAR_WIDTH] = {H,A,P,P,Y};
int SIZE_HAPPY = 5;
int SIZE_HALLOWEEN = 9;
volatile int pixelNum = 0;
volatile uint32_t millisLastInterrupt = 0;
volatile int progNum = -1;
volatile bool intOccured = false;
volatile int bounceDelay = 180;

void progChangeHandler()
{
  Serial.println("int0");
  intOccured = true;
  int m = millis();
  Serial.print("millis since last: ");
  uint32_t sinceLast = m - millisLastInterrupt;
  Serial.println(sinceLast);

  if(sinceLast > 0 && sinceLast < 250) {
    return;
  }
  millisLastInterrupt = m;

  if(progNum >= PROG_MAX)
    progNum = 0;
  else
    progNum++;

  Serial.print("progNum:");
  Serial.println(progNum);

  if(progNum == 0)
  {
    while(true)
    {
      intOccured = false;
      rainbowCycle(100);
    }
    // letterTest();
  }
  else if(progNum == 1)
  {
    intOccured = false; 
    while(true)
    {
      intOccured = false;
      colorWipe(RED, 100);
    }
  }
  else if(progNum == 2)
  {
    intOccured = false;
    while(true)
    {
      intOccured = false;
      bounce(20);
    }
  }
  else if(progNum == 3)
  {
    intOccured = false;
    while(true)
    {
      intOccured = false;
      particles();
    }
  }
}

void bounceSet()
{
  Serial.println("bounceSet");
  intOccured = true;
  int m = millis();
  Serial.print("millis since last: ");
  uint32_t sinceLast = m - millisLastInterrupt;
  Serial.println(sinceLast);

  if(sinceLast > 0 && sinceLast < 50) {
    return;
  }
  millisLastInterrupt = m;

  bounceDelay = sinceLast;
  Serial.print("bounceDelay:");
  Serial.println(bounceDelay);
  while(true)
  {
    intOccured = false;
    bounce(20);
  }
}

void setup() {
  pinMode(INT1_PIN, INPUT);
  pinMode(PIN, OUTPUT);

  attachInterrupt(INT1_PIN, bounceSet, FALLING);

  Serial.begin(9600);

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  millisLastInterrupt = millis();
}

void loop() {
  
}

void createObj(bool obj[8][8], uint32_t c, uint32_t c2)
{
  for(int i=0; i<8; i++)
  { //rows
      setPixels(c, c2, obj[i], HORI, i, 0, false);
  }

  strip.show();
}

void bounce(int cycles)
{
  for (int j=0; j < cycles; j++)
  { 
    CHECKINT
    uint32_t c = Wheel(random(255));
    for(int i=VERT-1; i>=0; i--)
    {
      CHECKINT
      setRow(c, i);
      strip.show();
      delay(10);
    }
    for(int i=0; i<VERT; i++)
    {
      CHECKINT
      setRow(BLACK, i);
      strip.show();
      delay(10);
    }
    delay(bounceDelay);
  }
}


int calcFadeStep(int from, int to, int numSteps)
{
  if(from > to)
  {
    int total = from - to;
    total = total / numSteps;
    return total * -1;
  }
  else
  {
    int total = to - from;
    total = total / numSteps;
    return total;
  }
}

void fadeColor(bool obj[][8], uint32_t baseColor, int fromR, int fromG, int fromB, int toR, int toG, int toB)
{
  // createObj(ALL, baseColor, BLACK);
  allOff();
  strip.show();
  int steps = 255;
  int animDelay = 1;
  int fadeR = calcFadeStep(fromR, toR, steps);
  int fadeG = calcFadeStep(fromG, toG, steps);
  int fadeB = calcFadeStep(fromB, toB, steps);
  int R = fromR;
  int G = fromG;
  int B = fromB;

  for(int i=0; i<steps; i++)
  {
    R += fadeR;
    G += fadeG;
    B += fadeB;
    uint32_t c = strip.Color(R, G, B);
    createObj(obj, c, baseColor);
    delay(animDelay);
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

int getPixelAddress(int row, int col)
{
  int addr;
  if(row % 2 != 0)
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

void setPixels(uint32_t c, uint32_t c2, bool *pixels, int size_t, int row, int start_col, bool invert)
{
  for(int i=0; i<size_t; i++)
  {
    int col = i + start_col;
    if(col > HORI)
      continue;

    int addr = getPixelAddress(row, col);
    if(pixels[i])
    {
      if(invert)
        strip.setPixelColor(addr, c2);
      else
        strip.setPixelColor(addr, c);
    }
    else
    {
      if(invert)
        strip.setPixelColor(addr, c);
      else
        strip.setPixelColor(addr, c2); //set the pixel off
    }
  }
}

void createChar(uint32_t c, uint32_t c2, bool character[][CHAR_WIDTH], int size_t, int size_u, int start, bool invert)
{
  for(int i=0; i<size_t; i++)
  { //rows
      setPixels(c, c2, character[i], size_u, i, start, invert);
  }
}

void setCol(uint32_t c, uint8_t col)
{
  for(int i=0; i<VERT; i++)
  { 
    int addr = getPixelAddress(i, col);  
    strip.setPixelColor(addr, c);
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

