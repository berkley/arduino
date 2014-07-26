var Pixel = function() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
};

var Bitmap = function() {
	this.data = [];
};

Bitmap.prototype.buildArray = function(width, height) {
	for (var i = 0; i < width; i++) {
		this.data[i] = new Array(height);
	}
};

Bitmap.prototype.drawLine = function(x1, y1, x2, y2, r, g, b) {

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

	this.data[x1][y1] = [r,g,b];

	while (x1 < x2) {
		if (e + 2 * dy < dx) {
			x1 += 1;
			e += 2 * dy;
			this.data[x1][y1] = [r,g,b];
		}
		else {
			y1 += 1;
			e -= 2 * dx;
		}
	}
};

Bitmap.prototype.parseD = function(d) {
	this.parsed = svgParser.parse(d);
    console.log(this.parsed);
};

Bitmap.prototype.draw = function() {
	if (this.parsed != null) {
		for (var i = 0; i < this.parsed.length - 1; i++) {
			var command1 = this.parsed[i].args[0];
			var command2 = this.parsed[i+1].args[0];
			this.drawLine(command1.x, command1.y, command2.x, command2.y, 255, 255, 255);
		}
	}
};

Bitmap.prototype.debugFrame = function() {
	for (var i = 0; i < this.data.length; i++) {
		console.log(JSON.stringify(this.data[i]));
	}
};

Bitmap.prototype.hollowCircle = function(x, y, radius, red, green, blue) {
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

Bitmap.prototype.filledCircle = function(x, y, radius, red, green, blue) {
	for (var smallerRadius=1; smallerRadius <= radius; smallerRadius++) {
		hollowCircle(x, y, smallerRadius, red, green, blue);
	}
}

Bitmap.prototype.circle = function(x, y, radius, strokeRed, strokeGreen, fillBlue, fillRed, fillGreen, strokeBlue) {
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

exports = {

};
