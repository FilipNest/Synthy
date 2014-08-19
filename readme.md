Synthy
======

Colour and sound synthesiser made in JavaScript using the web audio API.

User guide
----------

* Open up the developer console.
* Type something like:

```Javascript
synthy.sequence(1,[[220,250],[440,250],[220,250],[2000,250]]);
synthy.sequence(2,[[120,500],[240,500],[220,500],[2000,500]]);
synthy.sequence(3,[[220,500],[440,500],[220,500],[2000,500]]);
```

The first number is an oscillator from 1 to 3, then comes an array of note frequency (hz) and length (ms) pairs. 