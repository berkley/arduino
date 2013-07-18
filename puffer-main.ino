// the setup routine runs once when you press reset:
void setup() {                
  // initialize the digital pin as an output.
  pinMode(0, OUTPUT); //LED on Model B
  pinMode(1, OUTPUT); //LED on Model A   
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
}

void P1On()
{
  digitalWrite(5, HIGH);
}

void P1Off()
{
  digitalWrite(5, LOW);
}

void P2On()
{
  digitalWrite(1, HIGH);
}

void P2Off()
{
  digitalWrite(1, LOW);
}

void P3On()
{
  digitalWrite(2, HIGH);
}

void P3Off()
{
  digitalWrite(2, LOW);
}

void puffP1(int d)
{
  P1Off();
  P1On();
  delay(d);
  P1Off();
}

void puffP2(int d)
{
  P2Off();
  P2On();
  delay(d);
  P2Off();
}

void puffP3(int d)
{
  P3Off();
  P3On();
  delay(d);
  P3Off();
}

void addrToggle(int addr, int on)
{
  if(addr == 0)
  { //red
    if(on)
      P1On();
     else
       P1Off();
  }
  else if(addr == 1)
  {
    if(on)
      P2On();
    else 
      P2Off();
  }
  else if(addr == 2)
  {
    if(on)
      P3On();
    else
      P3Off();
  }
}

void allOff()
{
  P1Off();
  P2Off();
  P3Off();
}

void puffMulti(boolean p1, boolean p2, boolean p3, int d)
{
  allOff();
  if(p1)
    P1On();
  if(p2)
    P2On();
  if(p3)
    P3On();
    
  delay(d);
  allOff();
}

void oneTwoThree(int d)
{
  puffMulti(1, 0, 0, 250);
  puffMulti(0, 1, 0, 250);
  puffMulti(0, 0, 1, 250);
  puffMulti(0, 1, 0, 250);
  puffMulti(1, 0, 0, 250);
  puffMulti(0, 0, 0, 250);
  puffMulti(1, 1, 1, 500);
}

void middleOutter(int d)
{
  puffMulti(0, 1, 0, 250);
  puffMulti(1, 0, 1, 250); 
}

void outterMiddle(int d)
{
  puffMulti(1, 0, 1, 250);
  puffMulti(0, 1, 0, 250);
}

void jomamma()
{
  puffMulti(1, 1, 1, 500);
  puffMulti(0, 0, 0, 500);
  puffMulti(1, 0, 1, 500);
  puffMulti(0, 1, 0, 500);
  puffMulti(0, 0, 0, 500);
  puffMulti(1, 1, 1, 500);
  puffMulti(1, 1, 0, 500);
  puffMulti(1, 0, 0, 500);
  puffMulti(0, 0, 0, 1000);
  
}

void sos()
{
  puffMulti(1, 0, 0, 250);
  puffMulti(0, 0, 0, 250);
  puffMulti(1, 0, 0, 250);
  puffMulti(0, 0, 0, 250);
  puffMulti(1, 0, 0, 250);
  puffMulti(0, 0, 0, 250);
  
  puffMulti(1, 0, 0, 750);
  puffMulti(0, 0, 0, 750);
  puffMulti(1, 0, 0, 750);
  puffMulti(0, 0, 0, 750);
  puffMulti(1, 0, 0, 750);
  puffMulti(0, 0, 0, 750);
}

void rapidFire(int d)
{
  puffMulti(1, 0, 0, d);
  puffMulti(0, 0, 0, d);
  puffMulti(0, 1, 0, d);
  puffMulti(0, 0, 0, d);
  puffMulti(0, 0, 1, d);
  puffMulti(0, 0, 0, d);
}

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

void circular(float d)
{
  float radians = 0.0;
  float inc = M_PI / 24; 
  
  while (radians < 2 * M_PI)
  {
    puffMulti(1, 0, 0, fabs(d * sin(radians)) + 50 );
    radians += inc;
  }
}


// the loop routine runs over and over again forever:
void loop() 
{
  int to = 10000;
  
//  for(int i=0; i<5; i++)
//  {
//    oneTwoThree(50);  
//  }
  
//  delay(to);
//  for(int i=0; i<10; i++)
//  {
//    middleOutter(50);
//  }
//  
//  delay(to);
//  for(int i=0; i<10; i++)
//  {
//    outterMiddle(50);
//  }

//  delay(to);
//  jomamma();
  
//  delay(to);
  for(int i=0; i<10; i++)
  {
    rapidFire(50);
  }
  
  delay(to);

//  puffMulti(1, 0, 0, 500);
//  puffMulti(0, 0, 0, 500);
//  puffMulti(0, 1, 0, 500);
//  puffMulti(0, 0, 0, 500);
//  puffMulti(0, 0, 1, 500);
//  puffMulti(0, 0, 0, 500);
} 


