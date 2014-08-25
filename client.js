var synthy = {};
        
// create web audio api context
synthy.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//Set maximum frequency
        
synthy.top = 7902;

//First oscillator
        
synthy.osc1 = synthy.audioCtx.createOscillator();
synthy.osc1.type = 'sine';
synthy.osc1.frequency.value = 0; // value in hertz

synthy.osc1.speaker = synthy.audioCtx.createGain();
synthy.osc1.speaker.gain.value = 0.0005;
synthy.osc1.speaker.connect(synthy.audioCtx.destination);

//First filter

synthy.osc1.filter = synthy.audioCtx.createBiquadFilter();
synthy.osc1.connect(synthy.osc1.filter);
synthy.osc1.filter.connect(synthy.osc1.speaker);
synthy.osc1.filter.type = 0;

        
//Second oscillator
        
synthy.osc2 = synthy.audioCtx.createOscillator();
synthy.osc2.type = 'sine';
synthy.osc2.frequency.value = 0; // value in hertz

synthy.osc2.speaker = synthy.audioCtx.createGain();
synthy.osc2.speaker.gain.value = 0.0005;
synthy.osc2.speaker.connect(synthy.audioCtx.destination);

//Second filter

synthy.osc2.filter = synthy.audioCtx.createBiquadFilter();
synthy.osc2.connect(synthy.osc2.filter);
synthy.osc2.filter.connect(synthy.osc2.speaker);
synthy.osc2.filter.type = 0;

//Third oscillator
        
synthy.osc3 = synthy.audioCtx.createOscillator();
synthy.osc3.type = 'sine';
synthy.osc3.frequency.value = 0; // value in hertz

synthy.osc3.speaker = synthy.audioCtx.createGain();
synthy.osc3.speaker.gain.value = 0.0005;
synthy.osc3.speaker.connect(synthy.audioCtx.destination);

//Third filter

synthy.osc3.filter = synthy.audioCtx.createBiquadFilter();
synthy.osc3.connect(synthy.osc3.filter);
synthy.osc3.filter.connect(synthy.osc3.speaker);
synthy.osc3.filter.type = 0;

$("#q").on("mouseup",function(){
    
synthy.filter.Q.value = $("#q").val()/100;
    
});

$("#freq").on("mouseup",function(){
    
synthy.filter.frequency.value = $("#freq").val();
    
});


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
var waveform = play.waveform;
    
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
 
length += element.time;
    
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

synthy.play(phrase);
    
},longest);
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

$(".newrow").on("click",function(){

var osc = $(this).parent().attr("id").replace("build", "");

var osc = $("#build"+osc);

$(osc).find(".pitch").append("<input />");
$(osc).find(".length").append("<input />");
$(osc).find(".volume").append("<input />");
$(osc).find(".waveform").append("<select><option value='sine'>Sine</option><option value='sawtooth'>Saw</option><option value='square'>Square</option><option value='triangle'>Triangle</option></select>");
 
});

$(".clonerow").on("click",function(){

var osc = $(this).parent().attr("id").replace("build", "");

var osc = $("#build"+osc);
    
var pitch = $(osc).find(".pitch").children().last().val();
var length = $(osc).find(".length").children().last().val();
var volume = $(osc).find(".volume").children().last().val();
var waveform = $(osc).find(".waveform").children().last().val();

$(osc).find(".pitch").append("<input />").find("input").last().val(pitch);
$(osc).find(".length").append("<input />").find("input").last().val(length);
$(osc).find(".volume").append("<input />").find("input").last().val(volume);;
$(osc).find(".waveform").append("<select><option value='sine'>Sine</option><option value='sawtooth'>Saw</option><option value='square'>Square</option><option value='trigangle'></option></select>").find("select").last().val(waveform);
 
});

//Get details from phrase builder

$(document).ready(function(){

$("#stop").hide();

});

$("#play").on("click",function(){
  
synthy.startphrase();
    
$("#play").hide();
$("#stop").show();
    
});

$("#stop").on("click",function(){
    
window.clearInterval(synthy.loop);
    
synthy.timeouts.forEach(function(element){window.clearTimeout(element)});

$("#play").show();
$("#stop").hide();
    
synthy.osc1.speaker.gain.value = 0;
synthy.osc2.speaker.gain.value = 0;
synthy.osc3.speaker.gain.value = 0;
    
});
    
synthy.startphrase = function(){
    
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

synthy.seq[osc].push({pitch:parseFloat(pitch),time:parseInt(length), volume:parseFloat(volume), waveform:waveform});
}
}
   
}

//Get data from form

getdata(1); getdata(2); getdata(3);
    
//Send sequence to synthy
    
synthy.play([synthy.seq["1"],synthy.seq["2"],synthy.seq["3"]]);

};

//Glow synthy, glow

synthy.glow = function(osc,ms){

var osc = $("#osc"+osc);
    
$(osc).css("transition","box-shadow"+" "+ms/2+"ms").removeClass("off").addClass("on");
    
window.setTimeout(function(){
$(osc).removeClass("on").addClass("off");
},ms/2)
}