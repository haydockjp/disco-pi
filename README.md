# disco-pi
This repository is example code for an [Instructable](https://www.instructables.com).

This example shows how to create a basic website using [Node.js](https://nodejs.org) over HTTPS and [socket.io](https://socket.io/) over WSS.

The website has a single page which has a very basic layout. The webpage populates a drop down list with music files, which are located in the public/audio folder on the server. Selecting an option in the list plays the music file in the webpage using the [HTML 5 audio](https://www.w3schools.com/html/html5_audio.asp) element.

While playing the music file, the webpage uses the [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) interface to analyse the music, which is then sent to the server over a secure websocket connection.

The server running on a [Raspberry Pi](https://www.raspberrypi.org) uses the [WS281X](https://github.com/jgarff/rpi_ws281x) library to change the colours of the LEDs on a WS2811 LED strip, based on the data sent through the websocket.

Please see the instructable for full details.

