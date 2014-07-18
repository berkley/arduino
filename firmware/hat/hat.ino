#include "letters.h"
#include <Adafruit_NeoPixel.h>
#include <ParticleEmitter.h>


#define PIN 24
#define INT0_PIN 0
#define VERT 8
#define HORI 18
#define NUM_PIXELS 144

#define ORANGE strip.Color(255, 69, 0)
#define YELLOW strip.Color(255, 255, 0)
#define LIGHT_YELLOW strip.Color(50, 50, 0)
#define PURPLE strip.Color(76, 0, 153)
#define RED strip.Color(255, 0, 0)
#define BLUE strip.Color(0, 0, 255)
#define GREEN strip.Color(0, 255, 0)
#define LIGHT_WHITE strip.Color(25, 25, 25)
#define WHITE strip.Color(255, 255, 255)
#define BLACK strip.Color(0, 0, 0)

#define PROG_MAX 7

uint32_t currentChristmasFade = 0;

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

 
// bool HALLOWEEN[9][CHAR_HEIGHT][CHAR_WIDTH] = {H,A,L,L,O,W,E,E,N};
// bool HAPPY[5][CHAR_HEIGHT][CHAR_WIDTH] = {H,A,P,P,Y};
int SIZE_HAPPY = 5;
int SIZE_HALLOWEEN = 9;
int AXE_WIDTH = 18;
volatile int millisLastInterrupt = 0;
volatile int progNum = -1;
volatile bool intOccured = false;
bool startupDone = false;

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

  Serial.print("progNum:");
  Serial.println(progNum);
  if(progNum >= PROG_MAX)
    progNum = 0;
  else
    progNum++;

  if(progNum == 0)
  {
    while(true)
    {
      intOccured = false; 
      // timbers();
      int MAX_VAL = 20;
      int step = 1;
      int del = 50;
      int iterations = 10;

      rainbowCycle(5);

      // candyCane(iterations, MAX_VAL, step, 10000);
      // christmasFade(iterations, MAX_VAL, step, del);
    }
    // letterTest();
  }
  else if(progNum == 1)
  {
    while(true)
    {
      intOccured = false; 
      // goal();

      intOccured = false; 
      // timbers();
      int MAX_VAL = 150;
      int step = 1;
      int del = 50;
      int iterations = 10;

      // candyCane(iterations, MAX_VAL, step, 10000);
      // christmasFade(iterations, MAX_VAL, step, del);

      colorWipe(strip.Color(255, 0, 0), 10); // Red
      colorWipe(strip.Color(0, 255, 0), 10); // Green
      colorWipe(strip.Color(0, 0, 255), 10); // Blue
      colorWipe(strip.Color(0, 100, 100), 10);
      colorWipe(strip.Color(100, 100, 100), 10);
    }
  }
  else if(progNum == 2)
  {
    while(true)
    {
      intOccured = false; 
      rowSwipe(GREEN, false);
      colSwipe(YELLOW, false);
      rowSwipe(PURPLE, false);
      colSwipe(ORANGE, false);
    }
  }
  else if(progNum == 3)
  {
    while(true)
    {
      intOccured = false;
      // mental(GREEN, BLACK);
      rainbowCycle(10);
      // rowSwipe(GREEN, false);
      delay(2000);
    }
  }
  else if(progNum == 4)
  {
    while(true)
    {
      intOccured = false;
      bounce(20);
    }
  }
  else if(progNum == 5)
  {
    while(true)
    {
      intOccured = false;
      particles();
    }
  }
  else if(progNum == 6)
  {
    while(true)
    {
      intOccured = false;
      sparkle(LIGHT_WHITE, PURPLE);
      delay(50);
    }
  }
  else if(progNum == 7)
  {
    while(true)
    {
      intOccured = false;
      sparkle(LIGHT_WHITE, GREEN);
      delay(50);
    }
  }
}

void setup() {
  pinMode(INT0_PIN, INPUT);
  pinMode(PIN, OUTPUT);

  attachInterrupt(INT0_PIN, progChangeHandler, FALLING);

  Serial.begin(9600);

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  millisLastInterrupt = millis();
}

void loop() {
  if(!startupDone)
    progChangeHandler();  
}

void happyBirthdayStefan(uint32_t c, uint32_t c2)
{
  int array_size = 24;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + 10; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 23)
          createChar(c, c2, H, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 22)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 21)
          createChar(c, c2, P, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 20)
          createChar(c, c2, P, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 19)
          createChar(c, c2, Y, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 18)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 17)
          createChar(c, c2, B, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 16)
          createChar(c, c2, I, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 15)
          createChar(c, c2, R, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 14)
          createChar(c, c2, T, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 13)
          createChar(c, c2, H, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 12)
          createChar(c, c2, D, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 11)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 10)
          createChar(c, c2, Y, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 9)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 8)
          createChar(c, c2, S, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 7)
          createChar(c, c2, T, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 6)
          createChar(c, c2, E, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 5)
          createChar(c, c2, F, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 4)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(c, c2, N, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 0)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void candyCane(int iterations, int  MAX_VAL, int step, int del) {
  //randomly pick a pixel and turn it form red
  //randomly pick a pixel and turn it from green
  //repeat for iterations

  for(int i=0; i<HORI; i+=2)
  {
    setCol(strip.Color(MAX_VAL, 0, 0), i);
    setCol(strip.Color(MAX_VAL, MAX_VAL, MAX_VAL), i+1);
  }

  strip.show();
  
  delay(del);
}

void christmasFade(int iterations, int  MAX_VAL, int step, int del)
{
  //randomly pick a pixel and turn it form red
  //randomly pick a pixel and turn it from green
  //repeat for iterations

  bool fadingToRed;
  if(currentChristmasFade == 0 || currentChristmasFade == RED)
  { //..fade from black
    //fading to GREEN
    currentChristmasFade = RED;
    fadingToRed = false;
  }
  else
  {
    //fading to RED
    currentChristmasFade = GREEN;
    fadingToRed = true;
  }

  for(int i=0; i<iterations; i+=step)
  {
    for(int j=0; j<MAX_VAL; j+=step)
    {
      int blue = 0;
      int red;
      int green;

      if(fadingToRed)
      {
        red = j;
        green = MAX_VAL - j;
      }
      else
      {
        green = j;
        red = MAX_VAL - j;
      }

      uint32_t newColor = strip.Color(red, green, blue);
      setAll(newColor);
      delay(del);
      currentChristmasFade = newColor;
    }
    fadingToRed = !fadingToRed;
  }
}

void sparkle(uint32_t c, uint32_t c2)
{
  setAll(c);
  for(int i=0; i<10; i++)
  {
    int addr = random(VERT * HORI);
    strip.setPixelColor(addr, c2);
  }
  strip.show();
}

void ptfc()
{
  bool invert = false;
  int pos = 5;

  createChar(GREEN, BLACK, P, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(400);

  createChar(RED, BLACK, T, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(400);

  createAxe(GREEN, YELLOW);
  delay(200);
  allOff();
  strip.show();
  delay(200);

  createAxe(YELLOW, GREEN);
  delay(200);
  allOff();
  strip.show();
  delay(200);

  createChar(RED, BLACK, F, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(400);

  createChar(GREEN, BLACK, C, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(400);

  createAxe(GREEN, YELLOW);
  delay(200);
  allOff();
  strip.show();
  delay(200);

  createAxe(YELLOW, GREEN);
  delay(200);
  allOff();
  strip.show();
  delay(200);

}

void goal()
{
  intOccured = false; 
  uint32_t c = GREEN;
  uint32_t c2 = BLACK;
  bool invert = false;
  int pos = 5;

  
  rowSwipe(GREEN, false);
  rowSwipe(YELLOW, false);
  rowSwipe(BLACK, false);
  
  createChar(c, c2, G, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(500);
  
  
  rowSwipe(GREEN, false);
  rowSwipe(YELLOW, false);
  rowSwipe(BLACK, false);

  
  createChar(c, c2, O, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(500);

  rowSwipe(GREEN, false);
  rowSwipe(YELLOW, false);
  rowSwipe(BLACK, false);

  
  createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(500);

  rowSwipe(GREEN, false);
  rowSwipe(YELLOW, false);
  rowSwipe(BLACK, false);

  
  createChar(c, c2, L, CHAR_HEIGHT, CHAR_WIDTH, pos, invert);
  strip.show();
  
  delay(500);

  rowSwipe(GREEN, false);
  rowSwipe(YELLOW, false);
  rowSwipe(BLACK, false);
  createAxe(YELLOW, GREEN);
  delay(1000);
}

void timbers()
{
  goTimbers(GREEN, BLACK);
  
  rowSwipe(GREEN, false);
  colSwipe(YELLOW, false);
  
  createAxe(GREEN, YELLOW);
  
  delay(2000);
  mental(RED, BLACK);
  rowSwipe(GREEN, false);
  
  delay(3000);
  rowSwipe(YELLOW, false);
  createAxe(GREEN, YELLOW);
  
  delay(3000);

  beatRSL(RED, BLACK);
  rowSwipe(YELLOW, false);
  createAxe(GREEN, YELLOW);
  delay(3000);

  allOff();
  strip.show();
  for(int i=0; i<10; i++)
    ptfc();

}

void halloween()
{
  happyHalloween(ORANGE, BLACK);
  rowSwipe(Wheel(random(255)), false);

  particles();
  colSwipe(Wheel(random(255)), false);  

  // howl(Wheel(random(255)), BLACK);
  // monsterMarch(Wheel(random(255)), BLACK);
  // rowSwipe(Wheel(random(255)), false);
  // colSwipe(Wheel(random(255)), false);

  // colSwipe(Wheel(random(255)), false);
  // particles();
  // colSwipe(Wheel(random(255)), false);
  
  bounce(20);
  

  colSwipe(Wheel(random(255)), false);
  particles();
  colSwipe(Wheel(random(255)), false);
  bounceSide(20);
  

  // rowSwipe(Wheel(random(255)), false);
  // happyHalloween(Wheel(random(255)));
  // happyHalloween(BLUE, ORANGE);
  // rowSwipe(Wheel(random(255)), false);

  // particles();
  // rowSwipe(strip.Color(random(180), random(100), random(50)), false);

  // happyHalloween(YELLOW, GREEN);

  // particles();
  // colSwipe(strip.Color(random(180), random(100), random(50)), false);

  // particles();
  // colSwipe(BLUE, false);

  // Some example procedures showing how to display to the pixels:
  // colorWipe(strip.Color(255, 0, 0), 50); // Red
  // colorWipe(strip.Color(0, 255, 0), 50); // Green
  // colorWipe(strip.Color(0, 0, 255), 50); // Blue
  // rainbow(20);
  // rainbowCycle(20);
}

void spellGoal(uint32_t c, uint32_t c2)
{
  int array_size = 7;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + SIZE_HALLOWEEN; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 6)
          createChar(c, c2, G, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 5)
          createChar(c, c2, O, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 4)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(c, c2, L, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 0)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void tree(uint32_t c, uint32_t c2)
{
  int array_size = 1;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + SIZE_HALLOWEEN; i>=0; i--)
  {
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 0)
          createChar(c, c2, TREE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void beatRSL(uint32_t c, uint32_t c2)
{
  int array_size = 12;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + SIZE_HALLOWEEN; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 11)
          createChar(c, c2, B, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 10)
          createChar(c, c2, E, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 9)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 8)
          createChar(c, c2, T, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 7)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 6)
          createChar(c, c2, R, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 5)
          createChar(c, c2, S, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 4)
          createChar(c, c2, L, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 0)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void mental(uint32_t c, uint32_t c2)
{
  int array_size = 10;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + SIZE_HALLOWEEN; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 9) 
          createChar(RED, c2, M, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 8)
          createChar(BLUE, c2, E, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 7)
          createChar(GREEN, c2, N, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 6)
          createChar(YELLOW, c2, T, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 5)
          createChar(GREEN, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 4)
          createChar(BLUE, c2, L, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(RED, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(BLUE, c2, N, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 0)
          createChar(GREEN, c2, D, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void happyHalloween(uint32_t c, uint32_t c2)
{
  int array_size = SIZE_HALLOWEEN + SIZE_HAPPY + 2;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + SIZE_HALLOWEEN; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 15)
          createChar(c, c2, H, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 14)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 13)
          createChar(c, c2, P, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 12)
          createChar(c, c2, P, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 11)
          createChar(c, c2, Y, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);

        else if(j == 10)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);

        else if(j == 9)
          createChar(c, c2, H, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 8)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 7)
          createChar(c, c2, L, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 6)
          createChar(c, c2, L, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 5)
          createChar(c, c2, O, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 4)
          createChar(c, c2, W, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(c, c2, E, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(c, c2, E, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(c, c2, N, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);

        else if(j == 0)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void monsterMarch(uint32_t c, uint32_t c2)
{
  int array_size = 17;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + 5; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 16)
          createChar(c, c2, M, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 15)
          createChar(c, c2, O, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 14)
          createChar(c, c2, N, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 13)
          createChar(c, c2, S, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 12)
          createChar(c, c2, T, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 11)
          createChar(c, c2, E, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 10)
          createChar(c, c2, R, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 9)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 8)
          createChar(c, c2, M, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 7)
          createChar(c, c2, A, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 6)
          createChar(c, c2, R, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 5)
          createChar(c, c2, C, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 4)
          createChar(c, c2, H, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 0)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void howl(uint32_t c, uint32_t c2)
{
  int array_size = 5;
  bool invert = false;
  for(int i=(CHAR_WIDTH * array_size) + SIZE_HALLOWEEN; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size; j>=0; j--)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 4)
          createChar(c, c2, H, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(c, c2, O, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(c, c2, W, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(c, c2, L, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 0)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

void goTimbers(uint32_t c, uint32_t c2)
{
  int array_size = 20;
  bool invert = false;
  // for(int i=0; i<(CHAR_WIDTH * array_size) + array_size; i++)
  for(int i=(CHAR_WIDTH * array_size) + array_size; i>=0; i--)
  {
    
    allOff();
    for(int j=array_size - 1; j>=0; j--)
    // for(int j=0; j<array_size; j++)
    {
      
      if(i >= (CHAR_WIDTH * j))
      {
        if(j == 19)
          createChar(c, c2, G, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 18)
          createChar(c, c2, O, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 17)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 16)
          createChar(c, c2, T, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 15)
          createChar(c, c2, I, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 14)
          createChar(c, c2, M, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 13)
          createChar(c, c2, B, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 12)
          createChar(c, c2, E, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 11)
          createChar(c, c2, R, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 10)
          createChar(c, c2, S, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 9)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 8)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 7)
          createChar(c, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 6)
          createChar(c, c2, SPACE, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 5)
          createChar(RED, c2, R, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 4)
          createChar(RED, c2, C, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 3)
          createChar(RED, c2, T, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 2)
          createChar(RED, c2, I, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 1)
          createChar(RED, c2, D, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
        else if(j == 0)
          createChar(RED, c2, EXC, CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
      }
    }
    strip.show();
    delay(100);
  }
}

// void createWord(uint32_t c, uint32_t c2, bool word[][CHAR_HEIGHT][CHAR_WIDTH])
// {
//   int array_size = 17;
//   bool invert = false;
//   int i = 0;
//   int j = 0;
//   for(int k=0; k<(CHAR_WIDTH * array_size) + array_size; k++)
//   for(int i=(CHAR_WIDTH * array_size) + array_size; i>=0; i--)
//   {
//     allOff();
//     for(int j=array_size - 1; j>=0; j--)
//     // for(int j=0; j<array_size; j++)
//     {
//       if(i >= (CHAR_WIDTH * j))
//       {
//         if(j == 16)
//           createChar(c, c2, word[k], CHAR_HEIGHT, CHAR_WIDTH, i - (CHAR_WIDTH * j), invert);
//       }
//     }
//     strip.show();
//     delay(100);
//   }
// }

void createAxe(uint32_t c, uint32_t c2)
{
  for(int i=0; i<8; i++)
  { //rows
    
      setPixels(c, c2, AXE[i], AXE_WIDTH, i, 0, false);
  }
  // createChar(c, c2, AXE, CHAR_HEIGHT, CHAR_WIDTH, 0, false);
  strip.show();
}

void bounce(int cycles)
{
  for (int j=0; j < cycles; j++)
  { 
    
    uint32_t c = Wheel(random(255));
    for(int i=VERT-1; i>=0; i--)
    {
      
      setRow(c, i);
      strip.show();
      delay(10);
    }
    for(int i=0; i<VERT; i++)
    {
      
      setRow(BLACK, i);
      strip.show();
      delay(10);
    }
    delay(180);
  }
}

void bounceSide(int cycles)
{
  for (int j=0; j < cycles; j++)
  { 
    
    uint32_t c = Wheel(random(255));
    for(int i=HORI-1; i>=0; i--)
    {
      
      setCol(c, i);
      strip.show();
      delay(10);
    }
    for(int i=0; i<HORI; i++)
    {
      
      setCol(BLACK, i);
      strip.show();
      delay(10);
    }
    delay(180);
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

void setAll(uint32_t c)
{
  for(int i=0; i<HORI; i++)
  {
    setCol(c, i);
  }
  strip.show();
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

void letterTest()
{
  int wait = 1000;
  createChar(GREEN, BLACK, A, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, B, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, C, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, D, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, E, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, F, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, G, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, H, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, I, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, J, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, K, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, L, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, M, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, N, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, O, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, P, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  // createChar(GREEN, BLACK, Q, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  // strip.show();
  // delay(wait);
  createChar(GREEN, BLACK, R, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, S, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, T, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  createChar(GREEN, BLACK, U, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  // createChar(GREEN, BLACK, V, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  // strip.show();
  // delay(wait);
  createChar(GREEN, BLACK, W, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  // createChar(GREEN, BLACK, X, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  // strip.show();
  // delay(wait);
  createChar(GREEN, BLACK, Y, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  strip.show();
  delay(wait);
  // createChar(GREEN, BLACK, Z, CHAR_HEIGHT, CHAR_WIDTH, 6, false);
  // strip.show();
  // delay(wait);
}

