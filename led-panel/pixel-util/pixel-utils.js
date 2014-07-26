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

	function hollowCircle(x, y, radius, red, green, blue)
	{
		var radians = 0;
		var steps = 36;
		var delta = Math.PI / 10;

		for (var radians=0; i < Math.PI*2; i+=delta) {
			this.setPixel(
				parseInt(x + (Math.cos(radians)*radius)), 
				parseInt(y + (Math.sin(radians)*radius)), 
				red, green, blue);
		}
	}

	function drawLine(x1, y1, x2, y2, r, g, b) {

		x1 = parseInt(x1);
		y1 = parseInt(y1);
		x2 = parseInt(x2);
		y2 = parseInt(y2);
		r = parseInt(r);
		g = parseInt(g);
		b = parseInt(b);
		var dx=x2-x1;
		var dy=y2-y1;
		var e=0;

		setXYPixel(x1, y1, r, g, b);

		while (x1 < x2) {
			if (e + 2 * dy < dx) {
				x1 += 1;
				e += 2 * dy;
				setXYPixel(x1, y1, r, g, b);
			}
			else {
				y1 += 1;
				e -= 2 * dx;
			}
		}
	};

	function filledCircle(x, y, radius, red, green, blue)
	{
		for (var smallerRadius=1; smallerRadius <= radius; smallerRadius++) {
			hollowCircle(x, y, smallerRadius, red, green, blue);
		}
	}

	function circle(x, y, radius, strokeRed, strokeGreen, fillBlue, fillRed, fillGreen, strokeBlue)
	{
		var defaultColor = 255;
		strokeRed = strokeRed || defaultColor;
		strokeGreen = strokeGreen || defaultColor;
		strokeBlue = strokeBlue || defaultColor;
		fillRed = fillRed || defaultColor;
		fillGreen = fillGreen || defaultColor;
		fillBlue = fillBlue || defaultColor;

		filledCircle(x,y,radius,fillRed,fillGreen,fillBlue);

		if (strokeRed !== fillRed && strokeGreen !== fillGreen && strokeBlue !== fillBlue) {
			hollowCircle(x,y,radius,strokeRed,strokeGreen,strokeBlue);			
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
	     var COLUMNS_PER_SCREEN = 16
		 var PPS = 384
		 // var x = 31
		 // var y = 23
		 var w = COLUMNS_PER_SCREEN * SCREENS
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

	function setBitmap(bitmap) {
		for (var x=0; x < WIDTH; x++) {
			for (var y=0; y < HEIGHT; y++) {
				var pixel = bitmap[x][y];
				setXYPixel(x, y, pixel.r, pixel.g, pixel.b);
			}
		}
	}

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
		circle: circle,
		setWideXYPixel: setWideXYPixel
	};
}