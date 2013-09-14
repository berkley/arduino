int PIN_PINK = 6;
int PIN_BLUE = 9;
int PIN_ORANGE = 10;
int PIN_YELLOW = 11;

int PIN_PINK_MAX = 153;
int PIN_BLUE_MAX = 153;
int PIN_YELLOW_MAX = 102;
int PIN_ORANGE_MAX = 102;

void setup()
{
	pinMode(PIN_PINK, OUTPUT); 
	pinMode(PIN_YELLOW, OUTPUT); 
	pinMode(PIN_ORANGE, OUTPUT);
	pinMode(PIN_BLUE, OUTPUT);
}

void blueOn()
{
	analogWrite(PIN_BLUE, PIN_BLUE_MAX);
}

void blueOff()
{
	analogWrite(PIN_BLUE, 0);
}

void blueSet(int val)
{
	if(val > PIN_BLUE_MAX)
		return;
	analogWrite(PIN_BLUE, val);
}

void pinkOn()
{
	analogWrite(PIN_PINK, PIN_PINK_MAX);
}

void pinkOff()
{
	analogWrite(PIN_PINK, 0);
}

void pinkSet(int val)
{
	if(val > PIN_PINK_MAX)
		return;
	analogWrite(PIN_PINK, val);
}

void orangeOn()
{
	analogWrite(PIN_ORANGE, PIN_ORANGE_MAX);
}

void orangeOff()
{
	analogWrite(PIN_ORANGE, 0);
}

void orangeSet(int val)
{
	if(val > PIN_ORANGE_MAX)
		return;
	analogWrite(PIN_ORANGE, val);
}

void yellowOn()
{
	analogWrite(PIN_YELLOW, PIN_YELLOW_MAX);
}

void yellowOff()
{
	analogWrite(PIN_YELLOW, 0);
}

void yellowSet(int val)
{
	if(val > PIN_YELLOW_MAX)
		return;
	analogWrite(PIN_YELLOW, val);
}

void allOff()
{
	yellowOff();
	blueOff();
	orangeOff();
	pinkOff();
}

void allOn()
{
	yellowOn();
	blueOn();
	orangeOn();
	pinkOn();
}

void allSet(int val)
{
	blueSet(val);
	yellowSet(val);
	orangeSet(val);
	pinkSet(val);
}

//programs

void fadeIn()
{
	int animDelay = 50;
	allOff();
	for(int i=0; i<150; i+=5)
	{
		allSet(i);
		delay(animDelay);
	}
	allOn();
}

void fadeOut()
{
	int animDelay = 50;
	allOn();
	for(int i=150; i>0; i-=5)
	{
		allSet(i);
		delay(animDelay);
	}
	allOff();
}

void breath(int iterations)
{
	int animDelay = 50;
	for(int i=0; i<iterations; i++)
	{
		for(int i=150; i>=10; i-=5)
		{
			allSet(i);
			delay(animDelay);
		}
		for(int i=10; i<150; i+=5)
		{
			allSet(i);
			delay(animDelay);
		}
	}
}

void strobe(int iterations)
{
	for(int i=0; i<iterations; i++)
	{
		allOff();
		delay(100);
		allOn();
		delay(100);
	}
}

void colorCycle(int iterations)
{
	int animDelay = 150;
	for(int i=0; i<iterations; i++)
	{
		allOff();
		delay(animDelay);
		pinkOn();
		delay(animDelay);
		blueOn();
		delay(animDelay);
		orangeOn();
		delay(animDelay);
		yellowOn();
		delay(animDelay);
		fadeOut();
	}
}

void oneColor(int iterations)
{
	int animDelay = 50;
	for(int i=0; i<iterations; i++)
	{
		allOff();
		pinkOn();
		delay(animDelay);
		allOff();

		allOff();
		blueOn();
		delay(animDelay);
		allOff();

		allOff();
		orangeOn();
		delay(animDelay);
		allOff();

		allOff();
		yellowOn();
		delay(animDelay);
		allOff();		
	}
}

void fadeInOut(int iterations)
{
	for(int i=0; i<iterations; i++)
	{
		int animDelay = 500;
		fadeIn();
		delay(animDelay);
		fadeOut();
		delay(animDelay);
	}
}

void multiStrobe(int iterations)
{
	int animDelay = 50;
	for(int i=0; i<iterations; i++)
	{
		allOff();
		delay(animDelay);
		allOn();
		delay(animDelay);
		allOff();
		delay(animDelay);
		allOn();
		delay(animDelay);
		allOff();
		delay(animDelay);
		allOn();
		delay(animDelay);
		allOff();
		delay(animDelay);
		allOn();
		delay(animDelay);
		allOff();
		delay(animDelay);
		allOn();
		delay(2000);
		fadeOut();
		delay(1000);
	}
}

void loop()
{
	multiStrobe(25);
	fadeInOut(25);
	colorCycle(25);
	oneColor(100);
	strobe(100);
	breath(100);
}
