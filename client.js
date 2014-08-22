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

synthy.osc1.connect(synthy.osc1.speaker);

        
//Second oscillator
        
synthy.osc2 = synthy.audioCtx.createOscillator();
synthy.osc2.type = 'sine';
synthy.osc2.frequency.value = 0; // value in hertz

synthy.osc2.speaker = synthy.audioCtx.createGain();
synthy.osc2.speaker.gain.value = 0.0005;
synthy.osc2.speaker.connect(synthy.audioCtx.destination);

synthy.osc2.connect(synthy.osc2.speaker);

//Third oscillator
        
synthy.osc3 = synthy.audioCtx.createOscillator();
synthy.osc3.type = 'sine';
synthy.osc3.frequency.value = 0; // value in hertz

synthy.osc3.speaker = synthy.audioCtx.createGain();
synthy.osc3.speaker.gain.value = 0.0005;
synthy.osc3.speaker.connect(synthy.audioCtx.destination);

synthy.osc3.connect(synthy.osc3.speaker);

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
    
}

//Timeouts

synthy.timeouts = [];

//On sequence end

synthy.stop = function(){
  
//Delete trailing timeouts
    
synthy.timeouts.forEach(function(element,index){
    
window.clearTimeout(synthy.timeouts[index]);
synthy.timeouts = [];
    
});
    
//Mute
    
synthy.osc1.speaker.gain.value = 0;
synthy.osc2.speaker.gain.value = 0;
synthy.osc3.speaker.gain.value = 0;
    
};

synthy.restart = function(osc,sequence){
    
synthy.stop();
    
//If not final, restart
    
if(!synthy.final){
synthy.sequence(osc,sequence);
}    
};

// Trigger single note

synthy.trigger = function(osc, frequency, length, wait){
    
    
//Set wait time to 0 if not set
    
if(!wait){

var wait = 0;
    
}
    
//Start note
    
synthy.timeouts.push(window.setTimeout(function(){
    
synthy.pitch(osc,frequency);
synthy["osc"+osc].speaker.gain.value = 0.05;
    
},wait));
    
};

//Sequence

synthy.sequence = function(osc,sequence){
    
//Set initial wait time
    
var wait = 0;
    
for (i=0; i<sequence.length; i+=1){
    
var pitch = sequence[i][0];
var length = sequence[i][1]  

synthy.trigger(osc,pitch,length,wait);

wait += sequence[i][1]

if(i === (sequence.length -1)){
 
synthy.timeouts.push(window.setTimeout(function(){
    
synthy["osc"+osc].speaker.gain.value = 0;
    
synthy.restart(osc,sequence);
   
},wait));
    
}

}

return "Synthy is playing";

};

//Make a new row in the phrase builder

$("#newrow").on("click",function(){

$("#oscillator").append("<select><option value='1' selected='selected'>One</option><option value='2'>Two</option><option value='3'>Three</option></select>");
$("#pitch").append("<input />");
$("#length").append("<input />");
$("#volume").append("<input />");
$("#waveform").append("<select><option>Sine</option><option>Saw</option><option>Square</option></select>");
 
});

//Get details from phrase builder

$("#play").on("click",function(){
  
synthy.startphrase();
    
})
    
synthy.startphrase = function(){
    
synthy.final = false;
    
//Get amount of rows

var rows = $("#pitch input").length;

synthy.seq = {};
synthy.seq["1"] = [];
synthy.seq["2"] = [];
synthy.seq["3"] = [];
    
for(i=0; i<rows; i+=1){
 
var osc = $($("#oscillator select")[i]).val();
var pitch = $($("#pitch input")[i]).val();
var length = $($("#length input")[i]).val();
var volume = $($("#volume input")[i]).val();
var waveform = $($("#waveform select")[i]).attr("value");
synthy.seq[osc].push([parseInt(pitch),parseInt(length)]);    
  
}

synthy.sequence(1,synthy.seq[1]);
synthy.sequence(2,synthy.seq[2]);
synthy.sequence(3,synthy.seq[3]);

};