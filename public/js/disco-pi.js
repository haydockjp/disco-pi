window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;

$( document ).ready(function() {
    server = io(window.location.origin, { transports: ['websocket'], rejectUnauthorized: false });

    var ctx = new AudioContext();
    const audio = document.getElementById('audio');
    var audioSrc = ctx.createMediaElementSource(audio);
    var analyser = ctx.createAnalyser();

    // The fftSize property's value must be a non-zero power of 2 in a range from 32 to 32768; its default value is 2048.
    // NOTE: We only have 50 LEDs
    // So multiply by 2 and find the next power of 2 value
    analyser.fftSize = 128;

    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    audioSrc.connect(ctx.destination);
    
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    // we're ready to receive some data!
    // loop
    function renderFrame() {
	requestAnimationFrame(renderFrame);
	// update data in frequencyData
	analyser.getByteFrequencyData(frequencyData);
	// render frame based on values in frequencyData
	// NOTE: We only have 50 LEDs so limit the data to 50
	server.emit('ws2811', frequencyData.slice(0,50));
    }

    // Add the available music to the select list
    addMusic();
    // Start rendering the analysis
    renderFrame();
});


// Get the music form the api and add to the select list
function addMusic() {
    let musicFiles = getData('/api/audio');
    let musicList = $('#musicList');
    musicFiles.forEach(function(music) {
	musicList.append(new Option(music, music));
    });
}

// Add a click event handler to the select list
$('select#musicList').click(musicSelect);

// When a music option is selected
function musicSelect() {
    console.log('Play', this.value);
    audio.pause()
    // IF we seelct the None option, then stop playing music
    const audioFile = ((this.value==='None')?'':'/audio/'+this.value);
    audio.src=audioFile;
    if (audioFile!=='') {
	audio.load();
	audio.oncanplaythrough = audio.play();
    }
}

function getData(filename) {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': filename,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
};
