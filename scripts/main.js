(function () {
  'use strict';

  function init() {

    var filedrag = document.getElementById('filedrag'),
        fileselect = document.getElementById('fileselect'),
        disableFilter = document.getElementById('disable-filter'),
        options = document.getElementById('options'),
        demoAudio = document.getElementById('demo-audio');

    // file select
    fileselect.addEventListener('change', fileSelectHandler, false);

    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      // file drop
      filedrag.addEventListener('dragover', fileDragHover, false);
      filedrag.addEventListener('dragleave', fileDragHover, false);
      filedrag.addEventListener('drop', fileSelectHandler, false);
      filedrag.style.display = 'block';
    } else {
      filedrag.style.display = 'none';
    }

    var karaokeEnabled = true;

    disableFilter.addEventListener('click', function() {
      if (karaokeEnabled) {
        disableKaraoke();
        karaokeEnabled = false;
        disableFilter.innerHTML = 'Enable karaoke';
      } else {
        enableKaraoke();
        karaokeEnabled = true;
        disableFilter.innerHTML = 'Disable karaoke';
      }
    });

    demoAudio.addEventListener('click', function() {
      playSound('audio/mmo-happy.mp3')
    }, false);
  }

  // plays a file
  function playSound(url) {
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Our asynchronous callback
    request.onload = function() {
      var data = request.response;
      initAudio(data);
    };

    request.send();
  }

  // file drag hover
  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type === 'dragover' ? 'hover' : '');
  }

  // file selection
  function fileSelectHandler(e) {
    // cancel event and hover styling
    fileDragHover(e);

    var droppedFiles = e.target.files || e.dataTransfer.files;

    var reader = new FileReader();

    reader.onload = function(fileEvent) {
      var data = fileEvent.target.result;
      initAudio(data);

      var currentSong = document.getElementById('current-song');
      var dv = new jDataView(this.result);

      // "TAG" starts at byte -128 from EOF.
      // See http://en.wikipedia.org/wiki/ID3
      if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
        var title = dv.getString(30, dv.tell());
        var artist = dv.getString(30, dv.tell());
        var album = dv.getString(30, dv.tell());
        var year = dv.getString(4, dv.tell());
        currentSong.innerHTML = 'Playing ' + title + ' by ' + artist;
      } else {
        // no ID3v1 data found.
        currentSong.innerHTML = 'Playing';
      }

      options.style.display = 'block';
    };

    // http://ericbidelman.tumblr.com/post/8343485440/reading-mp3-id3-tags-in-javascript
    // https://github.com/jDataView/jDataView/blob/master/src/jDataView.js

    reader.readAsArrayBuffer(droppedFiles[0]);

  }

  // call initialization file
  if (window.File && window.FileList && window.FileReader) {
    init();
  } else {
    alert('Your browser does not support File');
  }

  var context = new (window.AudioContext || window.webkitAudioContext)();
  var source;
  var processor,
    filterLowPass,
    filterHighPass,
    mix,
    mix2;

  function initAudio(data) {
    if (source) source.stop(0);

    source = context.createBufferSource();

    if (context.decodeAudioData) {
      context.decodeAudioData(data, function (buffer) {
        source.buffer = buffer;
        createAudio();
      }, function (e) {
        console.error(e);
      });
    } else {
      source.buffer = context.createBuffer(data, false);
      createAudio();
    }
  }

  function createAudio() {
    // create low-pass filter
    filterLowPass = context.createBiquadFilter();
    source.connect(filterLowPass);

    filterLowPass.type = 0;
    filterLowPass.frequency.value = 120;

    // create high-pass filter
    filterHighPass = context.createBiquadFilter();
    source.connect(filterHighPass);
    filterHighPass.type = 1;
    filterHighPass.frequency.value = 120;

    // create the gain node
    mix = context.createGainNode();

    mix2 = context.createGainNode();
    source.connect(mix2);
    mix2.connect(context.destination);

    mix.gain.value = 1;
    mix2.gain.value = 0;

    // create the processor
    processor = context.createJavaScriptNode(2048 /*bufferSize*/ , 2 /*num inputs*/ , 1 /*num outputs*/);

    // connect everything
    filterHighPass.connect(processor);
    filterLowPass.connect(mix);
    processor.connect(mix);
    mix.connect(context.destination);

    // connect with the karaoke filter
    processor.onaudioprocess = karaoke;

    // playback the sound
    source.start(0);

    setTimeout(disconnect, source.buffer.duration * 1000 + 1000);
  }

  function disconnect() {
    source.noteOff(0);
    source.disconnect(0);
    processor.disconnect(0);
    mix.disconnect(0);
    mix2.disconnect(0);
    filterHighPass.disconnect(0);
    filterLowPass.disconnect(0);
  }

  // based on https://gist.github.com/kevincennis/3928503
  // flip phase of right channel
  // http://www.soundonsound.com/sos/sep04/articles/qa0904-7.htm
  function karaoke(evt) {
    var inputL = evt.inputBuffer.getChannelData(0),
      inputR = evt.inputBuffer.getChannelData(1),
      output = evt.outputBuffer.getChannelData(0),
      len = inputL.length,
      i = 0;
    for (; i < len; i++) {
      output[i] = inputL[i] - inputR[i];
    }
  }

  function disableKaraoke() {
    mix2.gain.value = 1;
    mix.gain.value = 0;
  }

  function enableKaraoke() {
    mix.gain.value = 1;
    mix2.gain.value = 0;
  }

})();
