var synthy = {};
        
// create web audio api context
synthy.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//Set maximum frequency
        
synthy.top = 7902;

//Define oscillator types
synthy.types = [];
synthy.types[0] = "sine";
synthy.types[1] = "sawtooth";
synthy.types[2] = "square";
synthy.types[3] = "triangle";


//First oscillator
        
synthy.osc1 = synthy.audioCtx.createOscillator();
synthy.osc1.frequency.value = 0; // value in hertz
synthy.osc1.speaker = synthy.audioCtx.createGain();
synthy.osc1.speaker.gain.value = 0.0005;
synthy.osc1.filter = synthy.audioCtx.createBiquadFilter();
synthy.osc1.filter.gain = 1;
synthy.osc1.filter.Q.value = 1;
synthy.osc1.connect(synthy.osc1.filter);
synthy.osc1.filter.connect(synthy.osc1.speaker);
synthy.osc1.speaker.connect(synthy.audioCtx.destination);

        
//Second oscillator
        
synthy.osc2 = synthy.audioCtx.createOscillator();
synthy.osc2.frequency.value = 0; // value in hertz
synthy.osc2.speaker = synthy.audioCtx.createGain();
synthy.osc2.speaker.gain.value = 0.0005;
synthy.osc2.filter = synthy.audioCtx.createBiquadFilter();
synthy.osc2.filter.gain = 1;
synthy.osc2.filter.Q.value = 1;
synthy.osc2.connect(synthy.osc2.filter);
synthy.osc2.filter.connect(synthy.osc2.speaker);
synthy.osc2.speaker.connect(synthy.audioCtx.destination);

//Third oscillator
        
synthy.osc3 = synthy.audioCtx.createOscillator();
synthy.osc3.frequency.value = 0; // value in hertz
synthy.osc3.speaker = synthy.audioCtx.createGain();
synthy.osc3.speaker.gain.value = 0.0005;
synthy.osc3.filter = synthy.audioCtx.createBiquadFilter();
synthy.osc3.filter.gain = 1;
synthy.osc3.filter.Q.value = 1;
synthy.osc3.connect(synthy.osc3.filter);
synthy.osc3.filter.connect(synthy.osc3.speaker);
synthy.osc3.speaker.connect(synthy.audioCtx.destination);

//Start
        
synthy.osc1.start();
synthy.osc2.start();
synthy.osc3.start();
        
//Functions for changing pitch
        
synthy.pitch = function(osc, frequency){

if (frequency > synthy.top){
    
frequency = top;
    
}

synthy["osc"+osc].frequency.value = frequency;

synthy["osc"+osc].frequency.note = synthy.note(frequency);

//Change colour
    
synthy.colourchange(osc,synthy["osc"+osc].frequency.note)
    
return synthy["osc"+osc];
    
};
        
//Note list

synthy.notes = {};
synthy.notes["C"] = {frequencies:[16,33,65,131,262,523,1047,2093,4186],name:"C",colour:"#FF0000"};
synthy.notes["C#"] = {frequencies:[17,35,69,139,278,554,1109,2218,4435],name:"C#",colour:"#FF6600"};
synthy.notes["D"] = {frequencies:[18,37,73,147,294,587,1175,2349,4699],name:"D",colour:"#FF9900"};
synthy.notes["D#"] = {frequencies:[20,39,78,156,311,622,1245,2489,4978],name:"D#",colour:"#FFCC00"};
synthy.notes["E"] = {frequencies:[21,41,82,165,330,659,1319,2637,5274],name:"E",colour:"#FFFF00"};
synthy.notes["F"] = {frequencies:[22,44,87,175,349,699,1397,2794,5588],name:"F",colour:"#00AA00"};
synthy.notes["F#"] = {frequencies:[23,46,93,185,370,740,1475,2960,5920],name:"F#",colour:"#007777"};
synthy.notes["G"] = {frequencies:[25,49,98,196,392,784,1568,3136,6272],name:"G",colour:"#0099FF"};
synthy.notes["G#"] = {frequencies:[26,52,104,208,415,831,1661,3322,6645],name:"G#",colour:"#6600CC"};
synthy.notes["A"] = {frequencies:[28,55,110,220,440,880,1760,3520,7040],name:"A",colour:"#660099"};
synthy.notes["A#"] = {frequencies:[29,58,117,233,466,932,1865,3729,7459],name:"A#",colour:"#990088"};
synthy.notes["B"] = {frequencies:[31,62,124,247,494,988,1976,3951,7902],name:"B",colour:"#CC00AA"};

//Frequency to note converter (with offset)
        
synthy.note = function(frequency){

 function closest (num, arr) {
                var curr = arr[0];
                var offset = Math.abs (num - curr);
                for (var val = 0; val < arr.length; val++) {
                    var newoffset = Math.abs (num - arr[val]);
                    if (newoffset < offset) {
                        offset = newoffset;
                        octave = val;
                    }
                }
                return {offset:offset,octave:octave};
            }
 
var chosen = {octave:null,note:null,offset:synthy.top};
    
for(note in synthy.notes){

var check = closest(frequency,synthy.notes[note]["frequencies"]);
var offset = check.offset;
var octave = check.octave;

if (offset < chosen.offset){
 
chosen.offset = offset;
chosen.octave = octave;
chosen.note = synthy.notes[note]["name"];    
}
}

return chosen;
    
}

synthy.colourchange = function(osc,note){
document.getElementById('osc'+osc).style.background = synthy.notes[note.note].colour;
document.getElementById('osc'+osc).style.color = synthy.notes[note.note].colour;
    
}

synthy.timeouts = [];
synthy.intervals = [];

// Trigger single note

synthy.trigger = function(osc, play){

var frequency = play.pitch;
var length = play.time;
var volume = play.volume;
var waveform = synthy.types[play.waveform];
    
// Cap volume at 1
    
if(volume > 1){
 
volume = 1;
    
}
    
//Start note
    
synthy.glow(osc,length);
synthy.pitch(osc,frequency);
synthy["osc"+osc].speaker.gain.value = volume;
synthy["osc"+osc].type = waveform;
};

synthy.play = function(phrase){
    
//Calculate phrase length

var phraselength = function(phrase){
    
var length = 0;
    
if(phrase.length !== 0){
 
phrase.forEach(function(element){
 
length += parseInt(element.time);
    
})      
    
}

return length;
    
}

var longest = 0;
    
phrase.forEach(function(element){
 
if(phraselength(element) > longest){
    
longest = phraselength(element);
    
}
    
});

synthy.currentphrase = function(){
               
if(phrase[0].length !== 0){
synthy.phraseplayer(1,phrase[0]);
}
if(phrase[1].length !== 0){
synthy.phraseplayer(2,phrase[1]);
}
if(phrase[2].length !== 0){
synthy.phraseplayer(3,phrase[2]);
}
    
//Repeat when longest is done
    
synthy.loop = window.setInterval(function(){

window.clearInterval(synthy.loop); 

synthy.timeouts.forEach(function(element){

window.clearTimeout(element);
    
})

synthy.clear();
synthy.end();
    
},longest);
    
};
    
synthy.currentphrase();
    
};

synthy.end = function(){
if(synthy.player || document.getElementById('repeat').checked){
    
synthy.currentphrase();
    
}
    
    
};

synthy.clear = function(){

window.clearInterval(synthy.loop);
    
synthy.timeouts.forEach(function(element){window.clearTimeout(element)});
    
synthy.osc1.speaker.gain.value = 0;
synthy.osc2.speaker.gain.value = 0;
synthy.osc3.speaker.gain.value = 0;
    
document.getElementById('osc1').style.background = null;
document.getElementById('osc1').style.color = null;
    
document.getElementById('osc2').style.background = null;
document.getElementById('osc2').style.color = null;
    
document.getElementById('osc3').style.background = null;
document.getElementById('osc3').style.color = null;
    
};
    
synthy.phraseplayer = function(osc,pattern){
    
var time = 0;
    
pattern.forEach(function(element,index){

synthy.timeouts.push(window.setTimeout(function(){
   
synthy.trigger(osc, element);
    
},time));

time += element.time;
    
});
    
};

//Make a new row in the phrase builder

synthy.newrow = function(osc){
    
var osc = $("#build"+osc);

$(osc).find(".pitch").append("<input />");
$(osc).find(".length").append("<input />");
$(osc).find(".volume").append("<input />");
$(osc).find(".waveform").append("<select><option value='0'>Sine</option><option value='1'>Saw</option><option value='2'>Square</option><option value='3'>Triangle</option></select>");
$(osc).find(".cutoff").append("<input />");
    
};

//Starting rows

synthy.newrow(1);
synthy.newrow(2);
synthy.newrow(3);

$(".newrow").on("click",function(){

var osc = $(this).parent().attr("id").replace("build", "");
    
synthy.newrow(osc);
 
});

$(".clonerow").on("click",function(){

var osc = $(this).parent().attr("id").replace("build", "");

var osc = $("#build"+osc);
    
var pitch = $(osc).find(".pitch").children().last().val();
var length = $(osc).find(".length").children().last().val();
var volume = $(osc).find(".volume").children().last().val();
var waveform = $(osc).find(".waveform").children().last().val();
var cutoff = $(osc).find(".cutoff").children().last().val();

$(osc).find(".pitch").append("<input />").find("input").last().val(pitch);
$(osc).find(".length").append("<input />").find("input").last().val(length);
$(osc).find(".volume").append("<input />").find("input").last().val(volume);
$(osc).find(".waveform").append("<select><option value='0'>Sine</option><option value='1'>Saw</option><option value='2'>Square</option><option value='3'></option></select>").find("select").last().val(waveform);
$(osc).find(".cutoff").append("<input />").find("input").last().val(cutoff);
 
});

//Delete row

$(".delete button").on("click",function(){
   
console.log($(this).parent());
    
});

//Get details from phrase builder

$("#play").on("click",function(){
  
synthy.startphrase();
    
});

$("#stop").on("click",function(){
    
synthy.clear();
synthy.currentphrase = null;    
});
    
synthy.startphrase = function(){
    
synthy.clear();
    
synthy.seq = {};
synthy.seq["1"] = [];
synthy.seq["2"] = [];
synthy.seq["3"] = [];

var getdata = function(osc){
 
var column = $("#build"+osc);
    
var rows = $(column).find(".pitch input").length;

for(i=0; i<rows; i+=1){

var pitch = $($(column).find(".pitch input")[i]).val();
var length = $($(column).find(".length input")[i]).val();
var volume = $($(column).find(".volume input")[i]).val();
var waveform = $($(column).find(".waveform select")[i]).val();
var cutoff = $($(column).find(".cutoff input")[i]).val();
    
if(isNaN(pitch)){
//Note
var note = pitch[0].toUpperCase();
//Sharp?
if(pitch.indexOf("#") !== -1){
note += "#";
}
//Octave
var octave = pitch[pitch.length-1];
//Frequency
pitch = synthy.notes[note].frequencies[octave];    
   }
    
if(pitch && length){

synthy.seq[osc].push({pitch:parseFloat(pitch),time:parseInt(length), volume:parseFloat(volume), waveform:parseInt(waveform)});
}
}
   
}

//Get data from form

getdata(1); getdata(2); getdata(3);
    
//Send sequence to synthy
    
synthy.play([synthy.seq["1"],synthy.seq["2"],synthy.seq["3"]]);
    
//Create bundle
    
var bundle = "title=synthy";
    
for (sequence in synthy.seq){
    
//Add oscillator spacer 
    
bundle+= "&osc"+sequence+"=";

//Loop over notes for each oscillator 

synthy.seq[sequence].forEach(function(element,index){
    
var note = [element.waveform+1,element.pitch,element.time,element.volume*100];
    
var pack = synthy.compression.compress(note);

//Add note
    
bundle += pack;

//Add note spacer

if(index !== synthy.seq[sequence].length-1){
bundle += "_"
}
});

}   

synthy.bundle = bundle;
    
//Clear output
    
$("#share").attr("href"," ");
$("#push").attr("href"," ");

//Set output

$("#share").attr("href",window.location.origin+"/synthy?"+bundle).text("Share this phrase");
$("#push").text("PUSH to SYNTHY");    
};

$("#push").click(function(){

synthy.socket.emit("bundle",synthy.bundle);
    
});

synthy.unpack = function(bundle){
    
//Extract oscillators from url paramaters

var first = bundle.substring(bundle.indexOf("&osc1=")+6,bundle.indexOf("&osc2="));
    
var second = bundle.substring(bundle.indexOf("&osc2=")+6,bundle.indexOf("&osc3="));
    
var third = bundle.substring(bundle.indexOf("&osc3=")+6,bundle.length);

//Turn into arrays of notes
    
first = first.split("_");
second = second.split("_");
third = third.split("_");
    
var decode = function(array){

array.forEach(function(element,index){

array[index] = synthy.compression.decompress(element);
    
});
    
};
    
decode(first);
decode(second);
decode(third);
    
sequences = [];
    
sequences.push(first);
sequences.push(second);
sequences.push(third); 
               
//Dummy sequences if missing

if(!sequences[0]){
 
sequences[0] = [{pitch: "0", time: "0", volume: 0, waveform: 0}]
    
}
    
if(!sequences[1]){
 
sequences[1] = [{pitch: "0", time: "0", volume: 0, waveform: 0}]
    
}
    
if(!sequences[2]){
 
sequences[2] = [{pitch: "0", time: "0", volume: 0, waveform: 0}]
    
}
    
return sequences;
    
}

//Add sequences to phrasebuilder
    
synthy.populate = function(osc,sequences){
     
sequences[osc-1].forEach(function(element,index){
 


//First item
if(index !== 0){
    
synthy.newrow(osc);

}
var column = osc;
    
$("#build"+column).find(".pitch").find("input").last().val(element.pitch);
$("#build"+column).find(".volume").find("input").last().val(element.volume);
$("#build"+column).find(".waveform").find("select").last().val(element.waveform);
$("#build"+column).find(".length").find("input").last().val(element.time);

});

};

//Glow synthy, glow

synthy.glow = function(osc,ms){

var osc = $("#osc"+osc);
    
$(osc).css("transition","box-shadow"+" "+ms/2+"ms").removeClass("off").addClass("on");
    
window.setTimeout(function(){
$(osc).removeClass("on").addClass("off");
},ms/2)
}

//Change pattern on form change

$("form").change(function(){
if(synthy.currentphrase){
synthy.startphrase();
}
});

$(document).ready(function(){
    
if(window.location.search){

var loaded = window.location.search.substr(1,window.location.search.length);
    
var unpacked = synthy.unpack(loaded);
synthy.populate(1,unpacked);
synthy.populate(2,unpacked);
synthy.populate(3,unpacked);
    
}
    
//Connect to server

var server = "http://"+window.location.host
.substring(0, window.location.href.length - 1)+":1337";
                                            
//synthy.socket = io(server);

})

//Reset synthy

synthy.reset = function(){

$(".buildcolumn input").remove();
$(".buildcolumn select").remove();
    
};

if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}