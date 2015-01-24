#About Synthy
Synthy is an online synthesiser with live world output and colours made by Filip Hnízdo using the Web Audio API (the live world server is powered by Socket.IO and Node.js).
<p>Synthy was originally built in the summer of 2014 as a present for Fiona Shipwright and has been expanded since then.</p>
##Controls
<p>Synthy has three oscillators which can be set to play sine waves, sawtooth waves, square waves, triangle waves but can also be piped through to a source of white noise.</p>
<p>Synthy works in rows, much like a tracker. Each oscillator can have several rows and each will be played after the previous row has finished. Each oscillator works independently from the others but waits until the oscillator with the longest pattern has finished before starting again.</p>
<p>You can set frequency for each oscillator row (does't work for white noise as the frequencies are all already there, somewhere) using hz or typing note values with the note name followed by an octave number</p>
<p>You can set a gain/volume for each oscillator row using a value between 0 and 1.  There is a limiter in place for each oscillator to stop things getting too loud and hurting you.</p>
<p>You can set a cut off point and resonance/q factor for each oscillator step. These are raw values and can lead to unpredictable things.</p>
<p>You can randomise the pitch and volume by using two consequtive digits (for amount of randomness followed by each other) 70 for very random freqency and regular volume.</p>
##Sharing
<p>Each pattern has a unique URL which you can get using the SHARE button.</p>
<p>Patterns can also be pushed to synthy so that the whole world can hear them, live, if they are on the listen page.</p>
<small>Please suggest features by emailing filip@bluejumpers.com</small> 
</div>
