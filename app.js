// Dependancies & Constants
const  https = require('https')
, fs = require('fs')
, express = require('express')
, logger = require('morgan')
, helmet = require('helmet')
, ws281x = require('rpi-ws281x-native')
, https_options = require('./https_options')
, ONE_YEAR = 31536000000
;

// Environment variable DISCO_PI_PORT can set the port
// default is 443
const port = parseInt(process.env.DISCO_PI_PORT, 10) || 443;

// Passing in a parameter for the number of LEDs
//  or default to 50
const numLEDs = parseInt(process.argv[2], 10) || 50;

// Define an array for the number of LEDs we want to control
let pixelData = new Uint32Array(numLEDs);

// Initialise the ws281x library with the number of LEDS we want to control
ws281x.init(numLEDs);


// Create the express server using SSL
// Serve all files under the public as static content
const app = express();
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(helmet.hsts({
    maxAge: ONE_YEAR,
    includeSubdomains: true,
    force: true
}));

// Allow get requests to retrieve a list the audio files
app.get('/api/audio', (req, res) => {
    fs.readdir('./public/audio/', (err, files) => {
	if (files) {
	    res.send(files);
	} else {
	    res.status(500).send(err);
	}
    })
});

// Create the https and Socket IO servers
const server = https.createServer(https_options, app)
, io = require('socket.io')(server)
;

// On a new socket.io connection
// Log the connection and listen for a 'ws2811' message
io.on('connect', function (socket) {
    console.log('connection');
    socket.on('ws2811', function (data) {
	// On receiving a ws2811 message
	// translate each of values (0 - 255) in the array (numLEDs size) into rainbow colours
	pixelData = Object.keys(data).map(function(k) { return colorwheel(data[k]) });
	// Update the value for each LED based on the array
	ws281x.render(pixelData);
    });

});

// Start listening for requests
server.listen(port);




//////////////////////////////////////////////////////////////////////////////////////////////
// rainbow-colors, taken from Ada Fruit Example https://goo.gl/1Nvxca
function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
    else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
    else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
