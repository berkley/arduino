// pixel-utils.js
module.exports = function(opcClient, WIDTH, HEIGHT)
{
	function setPixel(addr, red, green, blue)
	{
		opcClient.setPixel(tpix(addr), red, green, blue);
	}

	function setXYPixel(x, y, red, green, blue)
	{
		var addr = getPixelAddress(x, y);
		setPixel(addr, red, green, blue);
	}

	function setWideXYPixel(x, y, red, green, blue)
	{
		var addr = wideAddr(x, y);
		setPixel(addr, red, green, blue);
	}


	function refresh()
	{
		opcClient.writePixels();		
	}

	function getPixelAddress(row, col)
	{
		var rowWidth = parseInt(row) * WIDTH;
		var add = rowWidth + parseInt(col);
		return add;
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

	function allOff()
	{
		for(var i=0; i<numPixels(); i++)
		{
			this.setPixel(i, 0, 0, 0);
		}
	}

	// Fill the dots one after the other with a color
	function colorWipe(wait, red, green, blue) {
		var count = numPixels();
		for(var i=0; i<count; i++) {
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

	function wideAddr(x, y) {
	     var SCREENS = 3
		 var PPS = 384
		 // var x = 31
		 // var y = 23
		 var w = 48
		 var l = parseInt(w / SCREENS)
		 var col = parseInt(x % w)
		 var scn = parseInt(col / l)
		 var xoffset = parseInt(x - (l * scn))
		 var yoffset = parseInt(y * l)
		 var p = (scn * PPS) + xoffset + yoffset
		 // console.log("\npixel address:", p);
		 // console.log("\nscreen:", scn);
		 return tpix(p);
	};

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
		setXYPixel: setXYPixel,
		setRow: setRow,
		setColumn: setColumn,
		colorWipe: colorWipe,
		refresh: refresh,
		randomColor: randomColor, 
		allOff: allOff, 
		numPixels: numPixels,
		setWideXYPixel: setWideXYPixel
	};
}