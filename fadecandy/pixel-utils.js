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
		return (row * WIDTH) + col;
	}

	function setColumn(column, red, green, blue)
	{
		for(var i=0; i<HEIGHT; i++)
		{ 
			this.setPixel(getPixelAddress(i, column), red, green, blue);
		}
	}

	function setRow(row, red, green, blue)
	{
		for(var i=0; i<WIDTH; i++)
		{
			this.setPixel(i + (row * WIDTH), red, green, blue);
		}
	}

	// Fill the dots one after the other with a color
	function colorWipe(wait, red, green, blue) {
		for(var i=0; i<numPixels(); i++) {
			this.setPixel(i, red, green, blue);

			// if (wait > 0) {
			// 	refresh();
			// 	// delay(wait);
			// }
		}

		refresh();
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

	function randomColor(max) {
		max = max || 255.0;
		return parseInt((max/2.0) * Math.random() + (max/2.0));
	}

	return {
		setPixel: setPixel,
		setRow: setRow,
		setColumn: setColumn,
		colorWipe: colorWipe,
		refresh: refresh,
		randomColor: randomColor
	};
}