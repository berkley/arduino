//use the OPC library to talk to fadecandy
var OPC = new require('./opc'); 
//create a new OPC client that we can use to to control the panel.  
//set it to connect to localhost on port 7890 (just like in a browser)
var client = new OPC('localhost', 7890);

//set some variables about our LED panel setup
//we have 8 rows
var numRows = 8;
//we have 8 columns
var numCols = 8;
//the total number of pixels is cols * rows
var numPixels = (numCols * numRows);
//use the pixel-utils library to control individual pixels
var PixelUtils = new require('./pixel-utils')(client, numCols, numRows);
//define a variable to hold the serial number of the pixel we want to control
//initiall set to pixel 0.
var slot = 0;

//define a funtion to control our panel.  It's called below with a setInterval timer.
var count = function()
{
    //loop over all 64 pixels, incrementing the counter each time the loop executes
    for (var pixel = 0; pixel < numPixels; pixel++)
    {
        //if pixel is equal to the slot we're trying to update, update it
        if(pixel == slot)
        {
            var red = PixelUtils.randomColor();
            var blue = PixelUtils.randomColor();
            var green = PixelUtils.randomColor();
            console.log("Setting pixel " + pixel + " to color " + red + "/" + green + "/" + blue);
            PixelUtils.setPixel(pixel, red, green, blue);
        }
        else
        { //if this isn't the pixel we're updating, turn it off
            PixelUtils.setPixel(pixel, 0, 0, 0);
        }
    }

    //increment the slot that we're updating
    slot++;
    //if the pixel we're updating is the last pixel, reset it to 0 so that the script starts over.
    if(slot > numPixels)
        slot = 0;

    //latch the pixels
    PixelUtils.refresh();
}

//this is a timer that calls the function count every 20 milliseconds.  
//this is an effective refresh rate of 50 frames/second (1000 / 20 == 50)
//everytime count is called, we update one frame, then latch it.
setInterval(count, 20);


