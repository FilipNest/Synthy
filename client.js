var phasebuilder = "";

$(document).ready(function(){
   
    window.setTimeout(function(){
       
        $("body").fadeIn("slow");
        
    },1000);
    
    $("#abouttoggle").click(function(){
        
        $("#about").show();

    });
    
    $("#about button").click(function(){
        
        $("#about").hide();
    
    });
    
});

var synthy = {};
        
// create web audio api context
synthy.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//Create speaker for Synthy to output out of

synthy.amplifier = synthy.audioCtx.createGain();

//Three limiters to save ears

synthy.limiter1 = synthy.audioCtx.createDynamicsCompressor();
synthy.limiter1.threshold.value = -50;
synthy.limiter1.ratio.value = 20;
synthy.limiter1.connect(synthy.audioCtx.destination);

synthy.limiter2 = synthy.audioCtx.createDynamicsCompressor();
synthy.limiter2.threshold.value = -50;
synthy.limiter2.ratio.value = 20;
synthy.limiter2.connect(synthy.audioCtx.destination);

synthy.limiter3 = synthy.audioCtx.createDynamicsCompressor();
synthy.limiter3.threshold.value = -50;
synthy.limiter3.ratio.value = 20;
synthy.limiter3.connect(synthy.audioCtx.destination);

//Amplifier 

synthy.amplifier.connect(synthy.audioCtx.destination);

//Set maximum frequency
        
synthy.top = 7902;

//Define oscillator types
synthy.types = [];
synthy.types[0] = "sine";
synthy.types[1] = "sawtooth";
synthy.types[2] = "square";
synthy.types[3] = "triangle";
synthy.types[4] = "noise";

//Noise!

var bufferSize = 2 * synthy.audioCtx.sampleRate,
    noiseBuffer = synthy.audioCtx.createBuffer(1, bufferSize, synthy.audioCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}

var whiteNoise = synthy.audioCtx.createBufferSource();
whiteNoise.buffer = noiseBuffer;
whiteNoise.loop = true;
whiteNoise.start(0);

synthy.noise1 = synthy.audioCtx.createGain()
synthy.noise2 = synthy.audioCtx.createGain()
synthy.noise3 = synthy.audioCtx.createGain()

whiteNoise.connect(synthy.noise1);
whiteNoise.connect(synthy.noise2);
whiteNoise.connect(synthy.noise3);

synthy.init = function(osc, frequency,volume,cutoff, resonance, waveform, tie, random){

if(random){
    
random = random.toString();
var change = {};
    
//Split out randomness values
    
change.frequency = random[0];
change.volume = random[1];
  
//General randomising function
    
var randomise = function(input,top,randomness){
    
    var offset = (top/100) * randomness/50,
        min = input - offset,
        max = input + offset;
    
    return Math.random()*(min-max+1)+min;
    
};
    
if(change.frequency){
  
    frequency = randomise(frequency,synthy.top,change.frequency);
    
};
    
if(change.volume){
  
    volume = randomise(volume,1,change.volume);
    
};

}
    
if(!frequency){
 
    frequency = 0;
    
}
    
if(!frequency){
 
    volume = 0;
    
}
    
if(!frequency){
 
    cutoff = 0;
    
}
    
if(!waveform){
 
    waveform = 0;
    
}
    
if(tie === 0 || !synthy["osc" + osc]){

    if(synthy["osc" + osc] && synthy["osc" + osc] !== synthy["noise" + osc]){
      synthy["osc" + osc].stop();  
    };
    
//Disconnect noise
    
if(synthy["osc"+osc] && synthy["osc"+osc].filter){
synthy["noise"+osc].disconnect(synthy["osc"+osc].filter);
}

if(waveform == 4){
 
synthy["osc" + osc] = synthy["noise"+osc];
    
} else {
    
synthy["osc" + osc] = synthy.audioCtx.createOscillator();

}
    
synthy["osc" + osc].filter = synthy.audioCtx.createBiquadFilter();
synthy["osc" + osc].connect(synthy["osc" + osc].filter);
synthy["osc" + osc].speaker = synthy.audioCtx.createGain();
synthy["osc" + osc].filter.connect(synthy["osc" + osc].speaker);
synthy["osc" + osc].speaker.connect(synthy["limiter"+osc]);
    
if(synthy["osc" + osc] !== synthy["noise" + osc]){
    synthy["osc" + osc].start();
    
}
    
}
 
if(synthy["osc" + osc] !== synthy["noise" + osc]){
synthy["osc"+osc].frequency.value = frequency;
}
 
synthy["osc"+osc].type = synthy.types[waveform];
synthy["osc" + osc].speaker.gain.value = volume;
    
if(resonance){
synthy["osc" + osc].filter.Q.value = resonance;
}
if(cutoff){
synthy["osc" + osc].filter.frequency.value = cutoff;
}
    
}

//Initialise oscillators

synthy.init(1);
synthy.init(2);
synthy.init(3);
        
//Functions for changing pitch
        
synthy.pitch = function(osc, frequency, volume){

var on = true;
    
if(volume == "0"){
  
    var on = false;
    
}
    
if (frequency > synthy.top){
    
frequency = top;
    
}

if(synthy["osc"+osc] !== synthy["noise"+osc]){
    
synthy["osc"+osc].frequency.note = synthy.note(frequency);

//Change colour
    
synthy.colourchange(osc,synthy["osc"+osc].frequency.note,on)
return synthy["osc"+osc];
} else {
  
    synthy.colourchange(osc,{octave:0,note:"NOISE",offset:0},on);
    
};
    
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
synthy.notes["NOISE"] = {frequencies:[9999],name:"NOISE",colour:"#FFFFFF"};
synthy.notes["EMPTY"] = {frequencies:[9999],name:"NOISE",colour:"#000000"};

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

synthy.colourchange = function(osc,note,on){
    if(on){
        
    document.getElementById('osc'+osc).style.opacity = "1";
    document.getElementById('osc'+osc).style.background = synthy.notes[note.note].colour;
    document.getElementById('osc'+osc).style.color = synthy.notes[note.note].colour;
        
    } else {
        
    document.getElementById('osc'+osc).style.opacity = "0";
    document.getElementById('osc'+osc).style.background = "#333333";
    document.getElementById('osc'+osc).style.color = "#333333";
        
    }
    
}

synthy.timeouts = [];
synthy.intervals = [];

// Trigger single note

synthy.trigger = function(osc, play){
        
// Cap volume at 1
    
if(play.volume > 1){
 
play.volume = 1;
    
}
    
synthy.init(osc,play.pitch, play.volume, play.cutoff, play.resonance, play.waveform, play.tie, play.random);

//Start note


synthy.glow(osc,play.time);
synthy.pitch(osc,play.pitch,play.volume);

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
    
if(synthy.playlistmode){
    
if(synthy.currentpattern < synthy.song.length - 1){    
synthy.currentpattern += 1;
synthy.songplayer(synthy.currentpattern);
} else if (document.getElementById('repeat').checked) {
    
    synthy.songplayer(0);
    
} else {
    
    $("li .triggerpattern").css("background-color","white").css("color","black");
    
}
    
    
} else if(synthy.player || document.getElementById('repeat').checked){

if(synthy.changed){
  
    synthy.changed = false;
    synthy.startphrase();
    
} else {

    synthy.currentphrase();
    
}
   
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

$(osc).find(".tie").append("<input type='checkbox' />");
$(osc).find(".pitch").append("<input />");
$(osc).find(".length").append("<input />");
$(osc).find(".volume").append("<input />");
$(osc).find(".resonance").append("<input />");
$(osc).find(".random").append("<input />");
$(osc).find(".waveform").append("<select><option value='0'>Sine</option><option value='1'>Saw</option><option value='2'>Square</option><option value='3'>Triangle</option><option value='4'>Noise</option></select>");
$(osc).find(".cutoff").append("<input />");
    
};

//Start again

synthy.clearall = function(){
    
$(".tie input").remove();
$(".pitch input").remove();
$(".length input").remove();
$(".volume input").remove();
$(".resonance input").remove();
$(".random input").remove();
$(".cutoff input").remove();
$(".waveform select").remove();
    
//Make starting rows
    
synthy.newrow(1);
synthy.newrow(2);
synthy.newrow(3);
    
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
    
synthy.changed = true;

var osc = $(this).parent().attr("id").replace("build", "");

var osc = $("#build"+osc);
    
var pitch = $(osc).find(".pitch").children().last().val();
var length = $(osc).find(".length").children().last().val();
var volume = $(osc).find(".volume").children().last().val();
var waveform = $(osc).find(".waveform").children().last().val();
var cutoff = $(osc).find(".cutoff").children().last().val();
var tie = $(osc).find(".tie").children().last().prop("checked");
var resonance = $(osc).find(".resonance").children().last().val();
var random = $(osc).find(".random").children().last().val();

$(osc).find(".pitch").append("<input />").find("input").last().val(pitch);
$(osc).find(".length").append("<input />").find("input").last().val(length);
$(osc).find(".volume").append("<input />").find("input").last().val(volume);
$(osc).find(".waveform").append("<select><option value='0'>Sine</option><option value='1'>Saw</option><option value='2'>Square</option><option value='3'>Triangle</option><option value='4'>Noise</option</select>").find("select").last().val(waveform);
$(osc).find(".cutoff").append("<input />").find("input").last().val(cutoff);
$(osc).find(".resonance").append("<input />").find("input").last().val(resonance); 
$(osc).find(".random").append("<input />").find("input").last().val(random); 
$(osc).find(".tie").append("<input type='checkbox' />").find("input").last().prop("checked",tie);
 
});

//Delete row

$(".deleterow").on("click",function(){
   
var osc = $(this).parent();

if ($(osc).find(".tie").find("input").length > 1) {
   
    $(osc).find(".tie").find("input").last().remove();
    $(osc).find(".pitch").find("input").last().remove();
    $(osc).find(".length").find("input").last().remove();
    $(osc).find(".volume").find("input").last().remove();
    $(osc).find(".waveform").find("select").last().remove();
    $(osc).find(".cutoff").find("input").last().remove();
    $(osc).find(".random").find("input").last().remove();
    $(osc).find(".resonance").find("input").last().remove();
    
};
    
synthy.changed = true;
    
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
var random = $($(column).find(".random input")[i]).val();
var resonance = $($(column).find(".resonance input")[i]).val();
var tie = $($(column).find(".tie input")[i]).prop("checked");
    

if(!resonance || isNaN(resonance)){
 
    resonance = 1;
    
}
    
if (!cutoff || isNaN(cutoff)) {
   
    cutoff = synthy.top;
   
   };
    
if(tie){
    
    tie = 1;
    
} else {
    
    tie = 0;
    
}
        
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
    
if(waveform == "4"){
    
    pitch = "9999";
    
}
        
if(pitch && length){

synthy.seq[osc].push({pitch:parseFloat(pitch),time:parseInt(length), volume:parseFloat(volume), waveform:parseInt(waveform), cutoff:parseInt(cutoff), resonance:resonance, tie:tie, random:random});
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

var note = [element.waveform,element.pitch,element.time,element.volume*100,element.cutoff, element.resonance, element.tie, element.random];

//Pack into a , seperated string
    
var pack = note.join(",");

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

if(!synthy.songmode && !synthy.player){    
history.pushState({}, document.title, window.location.origin+"?name="+$("#name").val()+"&"+bundle)

//Set output
$("#push").show();
$("#name").css("display","block");
$("#namelabel").css("display","block");
$("#share").css("display","block");    
$("#push").text("Push to synthy");
}
};

$("#push").click(function(e){
    
synthy.socket.emit("bundle",{bundle:synthy.bundle,name:$("#name").val()});
    
$("#phrasebuilder").fadeOut();
    
window.setTimeout(function(){
    
    $("#phrasebuilder").fadeIn();
    $("#push").text("Pushed to Synthy")
    
},500);

e.preventDefault();
  
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

var note = element.split(",");
array[index] = {waveform:note[0],pitch:note[1],time:note[2],volume:note[3]/100, cutoff: note[4], resonance: note[5], tie:note[6], random:note[7]};
    
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
    
if(isNaN(element.volume)){
  
    element.volume = "";
    
};
        
if(element.tie === "1"){
    
    element.tie = true;
    
} else {
 
    element.tie = false;
    
}
    
$("#build"+column).find(".pitch").find("input").last().val(element.pitch);
$("#build"+column).find(".volume").find("input").last().val(element.volume);
$("#build"+column).find(".waveform").find("select").last().val(element.waveform);
$("#build"+column).find(".length").find("input").last().val(element.time);
$("#build"+column).find(".cutoff").find("input").last().val(element.cutoff);
$("#build"+column).find(".resonance").find("input").last().val(element.resonance);
$("#build"+column).find(".random").find("input").last().val(element.random);
$("#build"+column).find(".tie").find("input").last().prop("checked", element.tie);

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
synthy.changed = true;
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
                                            
synthy.socket = io(server);

})

//Reset synthy

synthy.reset = function(){

$(".buildcolumn input").remove();
$(".buildcolumn select").remove();
    
};

if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

//SONG MODE

$("body").on("click", "button", function(e){
    
e.preventDefault();
    
});

$("#newsongline").click(function(){
   
$(".songrow:last").after('<li class="songrow"><div class="square" data-colour=0></div><input class="songpattern"/> <button class="triggerpattern">Trigger</button><button class="startsong">START</button> <button class="moveup">&#x25B2;</button><button class="movedown">&#x25BC;</button></li>');
    
});

$("#removesongline").click(function(){

if ($(".songrow").length > 1){
    
$(".songrow:last").remove();
    
}
    
});

$("#songbuilder").on("click",".triggerpattern",function(){
     
    synthy.playlistmode = false;
    
    var loaded = ($(this).parent().find(".songpattern").val());
    var startpoint = $("#song li").index($(this).parent());
    
    var song = [];
    
    $(".songpattern").each(function(number,element){
       
        song.push(synthy.unpack($(element).val()));
        
    });
    
    synthy.clearall();
    
    synthy.populate(1,song[startpoint]);
    synthy.populate(2,song[startpoint]);
    synthy.populate(3,song[startpoint]);
    
    synthy.startphrase();
    
});

$("#songbuilder").on("click",".startsong",function(){
     
    synthy.playlistmode = true;
    
    var loaded = ($(this).parent().find(".songpattern").val());
    var startpoint = $("#song li").index($(this).parent());
    
    synthy.song = [];
    
    $(".songpattern").each(function(number,element){
       
        synthy.song.push(synthy.unpack($(element).val()));
        
    });
    
    synthy.songplayer = function(song){
    
    $("li .triggerpattern").css("background-color","white").css("color","black");
        
    $("li .triggerpattern").eq(song).css("background-color","#333333").css("color","white");
        
    if(!synthy.song[song]){
     
        return false;
        
    }
        
    synthy.currentpattern = song;
        
    synthy.clearall();
    
    synthy.populate(1,synthy.song[song]);
    synthy.populate(2,synthy.song[song]);
    synthy.populate(3,synthy.song[song]);
    
    synthy.startphrase();
        
    };
    
    synthy.songplayer(startpoint);
        
});

$("#songbuilder").on("click",".moveup",function(){
   
    var point = $("#song li").index($(this).parent());
    if(point != 0){
    $($(this).parent()).insertBefore("#songbuilder li:eq("+(point-1)+")");
    }
    
    synthy.clearall();
    
});

$("#songbuilder").on("click",".movedown",function(){
   
    var point = $("#song li").index($(this).parent());
    $($(this).parent()).insertAfter("#songbuilder li:eq("+(point + 1)+")");
    
    synthy.clearall();
    
});

//Change colours on song mode square click

$("#songbuilder").on("click", ".square", function(){
   
    var colours = ["#FF0000", "#FF9900", "#FFFF00", "#00AA00", "#0099FF", "#660099", "#CC00AA"];
    
    var currentcolour = parseInt($(this).attr("data-colour")) + 1;
    
    if(currentcolour > colours.length -1){
     
        currentcolour = 0;
        
    }
    
    $(this).attr("data-colour",currentcolour);
    
    $(this).css("background-color",colours[currentcolour]);
    
});

$("#stopsong").click(function(){
   
    synthy.clear();
    $("li .triggerpattern").css("background-color","white").css("color","black");

    
});