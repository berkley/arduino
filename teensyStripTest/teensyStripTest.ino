#include <OctoWS2811.h>

#define HORI 16
#define VERT 16
#define CHAR_WIDTH 16


const int ledsPerStrip = 5;

DMAMEM int displayMemory[ledsPerStrip*6];
int drawingMemory[ledsPerStrip*6];

const int config = WS2811_GRB | WS2811_800kHz;

OctoWS2811 leds(ledsPerStrip, displayMemory, drawingMemory, config);

void setup() {
  Serial.begin(9600);
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
#define LIGHT_WHITE 0x202020
#define PURPLE  0x4C0099
#define BLACK  0x000000
#define LIGHT_BLUE 0x0000A0

uint32_t currentChristmasFade = 0;

void loop() 
{
  int microsec = 2000000 / leds.numPixels(); 
  int addr = getPixelAddress(0, 0);
  leds.setPixel(addr, RED);
  addr = getPixelAddress(0, 1);
  leds.setPixel(addr, GREEN);
  leds.show();
  delay(500);

  addr = getPixelAddress(0, 0);
  leds.setPixel(addr, WHITE);
  addr = getPixelAddress(0, 1);
  leds.setPixel(addr, BLUE);
  leds.show();
  delay(500);
  

}

void mandelbrot(int iterations)
{
  double x,xx,y,cx,cy;
  uint32_t iteration,hx,hy;
  uint32_t itermax = 100;    /* how many iterations to do  */
  double magnify=1.0;   /* no magnification   */
  uint32_t hxres = 512;    /* horizonal resolution   */
  uint32_t hyres = 512;    /* vertical resolution    */
  int count = 0;

  /* header for PPM output */
  // printf("P6\n# CREATOR: Eric R Weeks / mandel program\n");
  // printf("%d %d\n255\n",hxres,hyres);

  for (hy=1;hy<=hyres;hy++)  {
    count++;
    for (hx=1;hx<=hxres;hx++)  {
      cx = (((float)hx)/((float)hxres)-0.5)/magnify*3.0-0.7;
      cy = (((float)hy)/((float)hyres)-0.5)/magnify*3.0;
      x = 0.0; y = 0.0;
      for (iteration=1;iteration<itermax;iteration++)  {
        xx = x*x-y*y+cx;
        y = 2.0*x*y+cy;
        x = xx;
        if (x*x+y*y>100.0)  iteration = 999999;
      }
      Serial.print("X: ");
      Serial.print(x);
      Serial.print("Y: ");
      Serial.println(y);
      Serial.print("iteration:");
      Serial.println(iteration);
      int addr = getPixelAddress(y, x);
      uint32_t color;
      // if (iteration<99999)
      // {
      //    color = colorFromRGB(0, 255, 0);
      // }
      // else
      // { 
      //   color = colorFromRGB(255, 0, 0);
      // }
      color = colorFromRGB(random(255), random(255), random(255));


      Serial.print("addr");
      Serial.println(addr);
      if(addr < 1)
        addr *= -1;
      leds.setPixel(addr, color);
      leds.show();
    }
    if(count > iterations)
      break;
  }
}

void christmasFade(int iterations)
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

  for(int i=0; i<iterations; i++)
  {
    for(int j=0; j<255; j++)
    {
      int blue = 0;
      int red;
      int green;

      if(fadingToRed)
      {
        red = j;
        green = 255 - j;
      }
      else
      {
        green = j;
        red = 255 - j;
      }

      uint32_t newColor = colorFromRGB(red, green, blue);
      setAll(newColor);
      delay(20);
      currentChristmasFade = newColor;
    }
    fadingToRed = !fadingToRed;
  }
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

void setRow(uint32_t c, uint8_t row)
{
  for(int i=0; i<HORI; i++)
  {
    int addr = i + (row * HORI);
    leds.setPixel(addr, c);
  }
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

void createObj(bool obj[16][16], uint32_t c, uint32_t c2)
{
  for(int i=0; i<CHAR_WIDTH; i++)
  { //rows
      setPixels(c, c2, obj[i], HORI, i, 0, false);
  }

  leds.show();
}

void createChar(uint32_t c, uint32_t c2, bool character[][CHAR_WIDTH], int size_t, int size_u, int start, bool invert)
{
  for(int i=0; i<size_t; i++)
  { //rows
      setPixels(c, c2, character[i], size_u, i, start, invert);
  }
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
        leds.setPixel(addr, c2);
      else
        leds.setPixel(addr, c);
    }
    else
    {
      if(invert)
        leds.setPixel(addr, c);
      else
        leds.setPixel(addr, c2); //set the pixel off
    }
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

uint32_t colorFromRGB(int red, int green, int blue)
{
  uint32_t color = red<<16 | green<<8 | blue;
  return color;
}
