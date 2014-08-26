var fourdigit = function(number) {
    var output = number.toString();
    while (output.length < 4) {
        output = '0' + output;
    }
    return output;
}

var compress = function(array){

var output = "";
    
array.forEach(function(element){

output += fourdigit(element);
 
});

return parseInt(output).toString(36);

}

var decompress = function(string){

string = parseInt(string,36).toString();
    
var waveform = string.substring(0, 1);
var pitch = string.substring(1,5);
var time = string.substring(5,9);
var volume = string.substring(9,13);
    
return {waveform:waveform,pitch:pitch,time:time,volume:volume}

}

var input = compress([1,4000,2000,1000,5000]);

var output = decompress(input);

console.log(input);
console.log(output);
