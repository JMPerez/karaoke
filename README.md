Karaoke with Web Audio API
=========

Using the Web Audio API it is possible to reproduce the karaoke filter present in some desktop applications to remove the voice from a song. Who needs a program other than a browser?

  - Drag and drop a music file (mp3, wav, ogg...)
  - Sing it!

Tech
-----------

This karaoke uses a number of projects to work properly:

* [jDataView](https://github.com/jDataView/jDataView) - a library that makes it super easy to read metadata from audio files, as explained on [Reading .mp3 ID3 tags in JavaScript](http://ericbidelman.tumblr.com/post/8343485440/reading-mp3-id3-tags-in-javascript).
* [Kevin Cennis' gist](https://gist.github.com/kevincennis/3928503) - that shows the way to remove central panned sound.
* [Happy by MMO](http://www.jamendo.com/en/track/1074874/happy) - it's a sample song I'm using for demo purposes. It's free and legal for personal use.

Installation
--------------

Clone the project. Then install its dependencies:

`$ npm install`

You can generate the output running `npm run build`. For generating an optimized build with minified CSS and JS, run `NODE_ENV=production npm run build`.

You will end up having a `build` folder with the static files. In order to play the demo song you need to start the code from a server (a local one would work), due to browser limitations.

Browser support
--------------

* Chrome for Desktop
* Chrome Beta for Android. Open `chrome://flags/` and enable "Enable WebAudio Android -
Enabling this option allows web sites to access the WebAudio API."

Future improvements
-------------------

* Improve karaoke filter
* Advanced options to tweak the filter
* Play / pause controls
* Research lyrics integration
* Spotify Web Player integration?

Authors
--------------
I, [@jmperezperez](https://twitter.com/jmperezperez), just put everything in place. Without [@possan](https://twitter.com/possan)'s help on how to use the Web Audio API this would have been impossible. Big kudos to him!

License
-------
MIT
