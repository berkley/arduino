#define PUFFER_1_PIN 5

void setup() {                
  pinMode(0, OUTPUT); 
  pinMode(1, OUTPUT);   
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
}

void P1On()
{
  digitalWrite(PUFFER_1_PIN, HIGH);
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

void P4On()
{
  digitalWrite(2, HIGH);
}

void P4Off()
{
  digitalWrite(2, LOW);
}

void P5On()
{
  digitalWrite(2, HIGH);
}

void P5Off()
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


// the loop routine runs over and over again forever:
void loop() 
{
 
} 
