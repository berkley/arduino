{// rotate-bitmap.js

var img_RetroStar = [
   [ 255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,248,216,32,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,248,216,32,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,0,0,0,248,216,32,0,0,0,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,248,216,32,248,216,32,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0 ],
   [ 0,0,0,248,216,32,248,216,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,248,216,32,248,216,32,0,0,0,0,0,0 ],
   [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ]
];


function rotate90(a){
  // transpose from http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
  // a = Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
  // row reverse
  // for (i in a){a[i] = a[i].reverse();}
  // var output = new Array(a.length * 3, new Array(a[0].length / 3));
  var output;
//new width = old height * 3
//new heith = old height / 3

  // console.log("a: ", a);
  console.log("a.length * 3:", a.length * 3);
  console.log("a[0].length / 3", a[0].length / 3);
  output = new Array(a.length * 3);
  for(var i=0; i<a.length * 3; i++)
  {
  	output[i] = new Array(a[0].length / 3);
  	console.log("outputputput: ", output[i]);
  }

  var m=0; 
  var n=0;
  for (var i=0; i<a.length; i++)
  {
  	console.log("OUTPUT: ", output);
  	var row = a[i];
  	for (var j=0; j<row.length; j+=3)
  	{

  		var tuple = [a[i][j], a[i][j+1], a[i][j+2]];
  		console.log("j:", j);
  		console.log("tuple: ", tuple);
  		output[m][n] = tuple[0];
  		output[m][n+1] = tuple[1];
  		output[m][n+2] = tuple[2];
  		m++
  		console.log("output[m]:", output[m]);
  	}
  	m = 0;
  	n += 3;
  }

  return output;
}

function printArray(a) {
	// var s = "{";

	// for (var j=0; j < a.length; j++) {
	// 	s += "{";
	// 	var row = a[j];

	// 	for (var i=0; i < row.length-1; i+=3) {
	// 		s += row[i + 0] + "," +
	// 			 row[i + 1] + "," +
	// 			 row[i + 2];

	// 		// if (i < (row.length / 3)-1) {
	// 			  s += ",";
	// 		// }
	// 	} 

	// 	s += "},\n";
	// }

	// s += "}";

	var jsonStr = JSON.stringify(a).replace(/\[/g, "{").replace(/\]/g, "}")/*.replace(/null/g, "0");*/;

	console.log(jsonStr);
}


var a = rotate90(img_RetroStar);

 printArray(a);

}