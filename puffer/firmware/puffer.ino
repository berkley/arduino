#define PUFFER_1_PIN 8
#define PUFFER_2_PIN 9
#define PUFFER_3_PIN 10
#define PUFFER_4_PIN 11
#define PUFFER_5_PIN 12

void setup() {                
  pinMode(PUFFER_1_PIN, OUTPUT); 
  pinMode(PUFFER_2_PIN, OUTPUT);   
  pinMode(PUFFER_3_PIN, OUTPUT);
  pinMode(PUFFER_4_PIN, OUTPUT);
  pinMode(PUFFER_5_PIN, OUTPUT);
}

void P1On()
{
  digitalWrite(PUFFER_1_PIN, HIGH);
}

void P1Off()
{
  digitalWrite(PUFFER_1_PIN, LOW);
}

void P2On()
{
  digitalWrite(PUFFER_2_PIN, HIGH);
}

void P2Off()
{
  digitalWrite(PUFFER_2_PIN, LOW);
}

void P3On()
{
  digitalWrite(PUFFER_3_PIN, HIGH);
}

void P3Off()
{
  digitalWrite(PUFFER_3_PIN, LOW);
}

void P4On()
{
  digitalWrite(PUFFER_4_PIN, HIGH);
}

void P4Off()
{
  digitalWrite(PUFFER_4_PIN, LOW);
}

void P5On()
{
  digitalWrite(PUFFER_5_PIN, HIGH);
}

void P5Off()
{
  digitalWrite(PUFFER_5_PIN, LOW);
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

void puffP4(int d)
{
  P4Off();
  P4On();
  delay(d);
  P4Off();
}

void puffP5(int d)
{
  P5Off();
  P5On();
  delay(d);
  P5Off();
}

void allOff()
{
  P1Off();
  P2Off();
  P3Off();
  P4Off();
  P5Off();
}

//puff individual puffers or multiple at a time
void puffMulti(boolean p1, boolean p2, boolean p3, boolean p4, boolean p5, unsigned long d)
{
  allOff();
  if(p1)
    P1On();
  if(p2)
    P2On();
  if(p3)
    P3On();
  if(p4)
    P4On();
  if(p5)
    P5On();
    
  delay(d);
  allOff();
}

//puff the puffer at index addr.  0 <= addr <= 4
void puffAddr(int d, int addr)
{
  switch(addr)
  {
    case 0:
      puffMulti(1, 0, 0, 0, 0, d);
      break;
    case 1:
      puffMulti(0, 1, 0, 0, 0, d);
      break;
    case 2:
      puffMulti(0, 0, 1, 0, 0, d);
      break;
    case 3:
      puffMulti(0, 0, 0, 1, 0, d);
      break;
    case 4:
      puffMulti(0, 0, 0, 0, 1, d);
      break;
  }
}

void roundAndBack(unsigned long d, int iterations)
{
  for(int i=0; i<iterations; i++)
  {
    puffMulti(1, 0, 0, 0, 0, d);
    puffMulti(0, 1, 0, 0, 0, d);
    puffMulti(0, 0, 1, 0, 0, d);
    puffMulti(0, 0, 0, 1, 0, d);
    puffMulti(0, 0, 0, 0, 1, d);
    puffMulti(0, 0, 0, 1, 0, d);
    puffMulti(0, 0, 1, 0, 0, d);
    puffMulti(0, 1, 0, 0, 0, d);
  }
  puffMulti(1, 0, 0, 0, 0, d);
}

void roundAndRound(unsigned long d, int iterations)
{
  for(int i=0; i<iterations; i++)
  {
    puffMulti(1, 0, 0, 0, 0, d);
    puffMulti(0, 1, 0, 0, 0, d);
    puffMulti(0, 0, 1, 0, 0, d);
    puffMulti(0, 0, 0, 1, 0, d);
    puffMulti(0, 0, 0, 0, 1, d);
  }
}

void bigBlast(int d)
{
  puffMulti(1, 1, 1, 1, 1, d);
}

void bounce(unsigned long d, int iterations)
{
  for(int i=0; i<iterations; i++)
  {
    puffMulti(0, 0, 1, 0, 0, d);
    puffMulti(0, 1, 0, 1, 0, d);
    puffMulti(1, 0, 0, 0, 1, d);
    puffMulti(0, 1, 0, 1, 0, d);
  }
  puffMulti(0, 0, 1, 0, 0, d);
}

void marquee(unsigned long d, int iterations)
{
  for(int i=0; i<iterations; i++)
  {
    puffMulti(1, 0, 0, 0, 0, d);
    puffMulti(0, 1, 0, 0, 0, d);
    puffMulti(1, 0, 1, 0, 0, d);
    puffMulti(0, 1, 0, 1, 0, d);
    puffMulti(1, 0, 1, 0, 1, d);
    puffMulti(0, 1, 0, 1, 0, d);
    puffMulti(0, 0, 1, 0, 1, d);
    puffMulti(0, 0, 0, 1, 0, d);
    puffMulti(0, 0, 0, 0, 1, d);
  }
}

//puff a random puffer, then wait a semi-random amount of time
void randomPuffs(unsigned long d, int iterations)
{
  randomSeed(analogRead(0));
  for(int i=0; i<iterations; i++)
  {
    long rand = random(5);
    puffAddr(d, rand);
    puffMulti(0, 0, 0, 0, 0, d * rand);
  }
}

//play a random routine, then wait with all puffers closed
void playRandomProgramAndWait(int wait)
{
  int NUM_PROGRAMS = 5; //this should be the number of case statements
  randomSeed(analogRead(0));
  long rand = random(NUM_PROGRAMS);
  switch(rand)
  {
    case 0:
      roundAndBack(50, 10);
      bigBlast(5000);
      break;
    case 1:
      roundAndRound(50, 10);
      bigBlast(5000);
      break;
    case 2:
      bounce(150, 10);
      bigBlast(5000);
      break;
    case 3:
      marquee(50, 10);
      bigBlast(5000);
      break;
    case 4:
      randomPuffs(1000, 10);
      break;
  }
  delay(wait);
}

void playAllProgramsInOrder(unsigned long wait)
{
  roundAndBack(100, 10);
  delay(wait);
  roundAndRound(100, 10);
  delay(wait);
  bounce(150, 10);
  delay(wait);
  marquee(100, 10);
  delay(wait);
  randomPuffs(500, 15);
  delay(wait);
}

void loop() 
{
  Serial.print("p1on");
  // puffMulti(1,0,0,0,0,2000);
  // delay(2000);
  unsigned long wait = 5
  000; //1 minute
  // playRandomProgramAndWait(wait);
  playAllProgramsInOrder(wait);
  // roundAndBack(50, 10);
  // roundAndRound(1000,10);
  // bounce(150, 10);
  // marquee(100, 10);
 // randomPuffs(100, 100);

  // delay(3000);
} 
