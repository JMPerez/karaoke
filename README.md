Karaoke with Web Audio API
=========

Using the Web Audio API it is possible to reproduce the karaoke filter present in some desktop applications to remove the voice from a song. Who needs a program other than a browser?

  - Drag and drop a music file (mp3, wav, ogg...)
  - Sing it!


Tech
-----------

This karaoke uses a number of open source projects to work properly:

* [jDataView](https://github.com/jDataView/jDataView) - a library that makes it super easy to read metadata from audio files, as explained on [Reading .mp3 ID3 tags in JavaScript](http://ericbidelman.tumblr.com/post/8343485440/reading-mp3-id3-tags-in-javascript).
* [Kevin Cennis' gist](https://gist.github.com/kevincennis/3928503) - that shows the way to remove central panned sound.

Installation
--------------

Download it and open the `index.html`file.

Browser support
--------------

At the moment it only seems to work in Chrome for Desktop. I have tried on Chrome for Android and Firefox for Desktop but they don't support the needed functions.

Authors
--------------
I, [@jmperezperez](https://twitter.com/jmperezperez), just put everything in place. Without [@possan](https://twitter.com/possan)'s help on how to use the Web Audio API this would have been impossible. Big kudos to him!

License
-

MIT