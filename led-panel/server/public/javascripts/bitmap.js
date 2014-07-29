

var Pixel = function() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
};

var Bitmap = function(width, height, svg) {
	this.data = [];
	this.buildArray(width, height);
	this.width = width;
	this.height = height;
	this.svg = svg;
};

Bitmap.prototype.buildArray = function(width, height) {
	for (var i = 0; i < width; i++) {
		this.data[i] = new Array(height);
	}
};

Bitmap.prototype.drawSVG = function() {
	var col, row, color;
	if (this.svgPixels != null) {
		for (c in this.svgPixels) {
			col = this.svgPixels[c];
			for (r in col) {
				row = this.data[c][r];
				color = "rgb(" + row[0] + "," + row[1] + "," + row[2] + ")";
				this.svgPixels[c][r].attr('fill', color);
			}
		}
	}
	else {
		this.svgPixels = {};
		for (var i = 0; i < this.data.length; i++) {
			col = this.data[i];
			this.svgPixels[i] = {};
			for (var j = 0; j < col.length; j++) {
				row = col[j];
				if (row != null) {
					color = "rgb(" + row[0] + "," + row[1] + "," + row[2] + ")";
					this.svgPixels[i][j] = svg.append('rect')
												.attr('width', 1)
												.attr('height', 1)
												.attr('x', i)
												.attr('y', j)
												.attr('fill', color);
				}
				else {
					this.svgPixels[i][j] = svg.append('rect')
												.attr('width', 1)
												.attr('height', 1)
												.attr('x', i)
												.attr('y', j)
												.attr('fill', 'rgb(255,255,255)');
				}
			}
		}
	}
};

Bitmap.prototype.setPixel = function(x, y, r, g, b) {
	this.data[x][y] = [r, g, b];
};

Bitmap.prototype.drawRect = function(x1, y1, x2, y2, r, g, b) {
	if (!(x1 < x2) || !(y1 < y2)) {
		throw new Error("I can't draw this rectangle, asshole");
	}

	for (var i = x1; i < x2; i++) {
		for (var j = y1; j < y2; j++) {
			this.data[i][j] = [r, g, b];
		}
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
	this.parsed = parse(d);
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
	var delta = Math.PI / 180;

	var i =0;

	for (var radians=0.0; radians < Math.PI*2; radians+=delta) {
		i += 1;
		var ix = parseInt(x + (Math.cos(radians)*radius));
		var iy = parseInt(y + (Math.sin(radians)*radius));
		var degrees = parseInt(radians * 180.0 / Math.PI);
		// console.log(i, ': degrees', degrees, 'x', ix, 'y', iy);
		if (ix < this.width && iy < this.height) {
			this.data[ix] = this.data[ix] || [];
			this.data[ix][iy] = [red, green, blue];
		}
	}
};

Bitmap.prototype.filledCircle = function(x, y, radius, red, green, blue) {
	radius = parseInt(radius);
	for (var smallerRadius=1; smallerRadius <= radius; smallerRadius++) {
		this.hollowCircle(x, y, smallerRadius, red, green, blue);
	}
};

Bitmap.prototype.circle = function(x, y, radius, strokeRed, strokeGreen, fillBlue, fillRed, fillGreen, strokeBlue) {
	x = parseInt(x);
	y = parseInt(y);
	var defaultColor = 255;
	strokeRed = strokeRed || defaultColor;
	strokeGreen = strokeGreen || defaultColor;
	strokeBlue = strokeBlue || defaultColor;
	fillRed = fillRed || defaultColor;
	fillGreen = fillGreen || defaultColor;
	fillBlue = fillBlue || defaultColor;

	this.filledCircle(x,y,radius,fillRed,fillGreen,fillBlue);

	if (strokeRed !== fillRed && strokeGreen !== fillGreen && strokeBlue !== fillBlue) {
		this.hollowCircle(x,y,radius,strokeRed,strokeGreen,strokeBlue);			
	}
};
