// pixel-utils.js
module.exports = function(opcClient, WIDTH, HEIGHT)
{
	function setPixel(addr, red, green, blue)
	{
		opcClient.setPixel(tpix(addr), red, green, blue);
	}

	function refresh()
	{
		opcClient.writePixels();		
	}

	function getPixelAddress(row, col)
	{
		var addr;
		if(row % 2 == 0)
		{
			addr = (row * WIDTH) + col;
		}
		else
		{
			var offset = WIDTH - ((col * 2) + 1) ;
			addr = ((row * WIDTH) + col) + offset;
		}

		return addr;
	}

	function setColumn(c, col)
	{
		for(var i=0; i<HEIGHT; i++)
		{ 
			opcClient.setPixelColor(getPixelAddress(i, col), c);
		}
	}

	function setRow(c, row)
	{
		for(var i=0; i<WIDTH; i++)
		{
			opcClient.setPixelColor(i + (row * WIDTH), c);
		}
	}

	// Fill the dots one after the other with a color
	function colorWipe(c, wait) {
		for(var i=0; i<this.numPixels(); i++) {
			opcClient.setPixelColor(i, c);
			opcClient.show();
			delay(wait);
		}
	}

	function numPixels() {
		return (WIDTH * HEIGHT);
	}

	function tpix(addr) {
	    var actualPixPerChannel = 48;
	    var mod = addr % actualPixPerChannel;
	    var base = addr - mod;
	    var newaddr;
	    var upperBounds = actualPixPerChannel - WIDTH - 1;
	    var addrMinusBase = addr - base;

	    if(addrMinusBase >= 0 && addrMinusBase < WIDTH)
	    {
	        newaddr = addrMinusBase;
	    }
	    if(addrMinusBase >= WIDTH && addrMinusBase <= upperBounds)
	    { //invert
	        var offset = addrMinusBase - WIDTH;
	        newaddr = upperBounds - offset;
	    }
	    if(addrMinusBase > upperBounds)
	    {
	        newaddr = addrMinusBase;
	    }
	    
	    return newaddr + base;
	};

	return {
		setPixel: setPixel,
		setRow: setRow,
		setColumn: setColumn,
		colorWipe: colorWipe,
		refresh: refresh
	};
}