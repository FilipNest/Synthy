synthy.compression = {   
    
fourdigit: function(number) {
    
    var output = number.toString();
    while (output.length < 4) {
        output = '0' + output;
    }
    return output;
},

Base64: {

    _Rixits : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-",
  
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
},

compress: function(array){
    
var output = "";
    
array.forEach(function(element){

output += synthy.compression.fourdigit(element);
 
});

//Strip leading 0s
    
output = output.substr(2,output.length);
   
return synthy.compression.Base64.fromNumber(parseInt(output,10));

},

decompress: function(note){

note = synthy.compression.Base64.toNumber(note).toString();
    
var waveform = note.substring(0, 1);
var pitch = note.substring(1,5);
var time = note.substring(5,9);
var volume = note.substring(9,13);
var cutoff = note.substring(13,17);
var tie = note.substring(17,18);

return {waveform:waveform-1,pitch:pitch,time:time,volume:volume/100, cutoff: cutoff, tie:tie}

}
}