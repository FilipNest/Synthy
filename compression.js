<script>
     
var fourdigit = function(number) {
    var output = number.toString();
    while (output.length < 4) {
        output = '0' + output;
    }
    return output;
}

Base64 = {

    _Rixits : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",
  
    fromNumber : function(number) {
        if (isNaN(Number(number)) || number === null ||
            number === Number.POSITIVE_INFINITY)
            throw "The input is not valid";
        if (number < 0)
            throw "Can't represent negative numbers now";

        var rixit;  
        var residual = Math.floor(number);
        var result = '';
        while (true) {
            rixit = residual % 64
           
            result = this._Rixits.charAt(rixit) + result;
           
            residual = Math.floor(residual / 64);
            

            if (residual == 0)
                break;
            }
        return result;
    },

    toNumber : function(rixits) {
        var result = 0;
       
        rixits = rixits.split('');
        for (e in rixits) {
         
            result = (result * 64) + this._Rixits.indexOf(rixits[e]);

        }
        return result;
    }
}

var compress = function(array){
    
var output = "";
    
array.forEach(function(element){

output += fourdigit(element);
 
});

//Strip leading 0s
    
output = output.substr(3,output.length);
   
return Base64.fromNumber(parseInt(output,10));

}

var decompress = function(note,filter){

note = Base64.toNumber(note).toString();
    
var waveform = note.substring(0, 1);
var pitch = note.substring(1,5);
var time = note.substring(5,9);
var volume = note.substring(9,13);

filter = Base64.toNumber(filter).toString();
    
var filter_type = filter.substring(0,1);
var cutoff = filter.substring(1,5);
var resonance = filter.substring(5,9);

return {waveform:waveform,pitch:pitch,time:time,volume:volume,filter:filter_type,cutoff:cutoff,resonance:resonance}

}

//Waveform,freq,length,amp

var note = compress([5,2345,6799,9999]);
var filter = compress([5,5000,5000]);

var output = decompress(note,filter);

console.log(note.length);
console.log(filter.length);
console.log(output);

//Note + filter + divider + end = 15 characters. 30 rows each makes 450 a row. 450 * 3 = 1350+3 = 1353. 15 chars for user = 1368.
    
console.log(btoa("filipnest").length);
    
</script>
