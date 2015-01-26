#About Synthy
Synthy is an online synthesiser and sequencer with live world output and colours made by [Filip Hnízdo](http://filipnest.com) using the Web Audio API, the live server is powered by Socket.IO and Node.js.

[VISIT SYNTHY](http://synthy.io)

Synthy was originally started, late in the summer of 2014 with inspiration provided by [Fiona Shipwright](http://instagram.com/edwardiansnow) and has been expanded since then. It may grow even more if you like it.

##Controls

Synthy has three oscillators which can be set to play sine waves, sawtooth waves, square waves, triangle waves but can also be piped through to a source of white noise.

Synthy works in rows, much like a [tracker](http://en.wikipedia.org/wiki/Music_tracker). Each oscillator can have several rows and each will be played after the previous row has finished. Each oscillator works independently from the others but waits until the oscillator with the longest pattern has finished before starting again.

You can set frequency for each oscillator row (does't work for white noise as the frequencies are all already there, somewhere) using hz or typing note values with the note name followed by an octave number.

You can set a gain/volume for each oscillator row using a value between 0 and 1.  There is a limiter in place for each oscillator to stop things getting too loud and hurting you.

You can set a cut off point and resonance/q factor for each oscillator step. These are raw values and can lead to unpredictable things.

You can randomise the pitch and volume by using two consecutive digits (for amount of randomness followed by each other) 70 for very random frequency and regular volume.

##Song mode

Patterns (copied as URLS) can be played together and rearranged in a sequence using the song mode. You can assign each one a colour as the URLs may look similar to anyone but Synthy.

##Sharing

Each pattern has a unique URL which should be regenerated whenever you change anything.

Patterns can also be pushed to synthy so that the whole world can hear them, live, if they are on the listen page. This may eventually have multiple channels but as it's the initial launch you can all play in the one.

Please suggest improvements by posting a new issue on GitHub or contacting me [@filipnest](http://www.twitter.com/filipnest) on Twitter
