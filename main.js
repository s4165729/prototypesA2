const startStopButton = document.getElementById("startstopbutton");
const field = document.getElementById("field");
const dot = document.getElementById("dot");

let audioHasStarted = false;
let isPlaying = false; 

//same piano sampler as the little wings prototype// 
const piano = new Tone.Sampler({
    urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
    },

    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

//x position left and right picks the note letter//
const noteLetters = ["C", "D", "E", "F", "G", "A", "B"];

//y positon of up and down picks the type of octive- moving up plays it
//higher and moving it down plays it lower// 
//same idea as the plane A3/A4 toggle in the middle of little wings// 

const octaves = [5, 4, 3]; //top of the field is 5 high and bottom being 3 low
let lastCell = null; //tracks white note or cell the dot is currently in//
async function startAudioIfNeeded() {
    if (!audioHasStarted) {
        await Tone.start();
        audioHasStarted = true;
    }
}

startStopButton.addEventListener("click", async function () {
    await startAudioIfNeeded();
    isPlaying = !isPlaying;
    startStopButton.textContent = isPlaying ? "stop" : "start";
});

field.addEventListener("mousemove", function (e) {
    const rect = field.getBoundingClientRect();

    //position of the mouse within the field// 
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;
    x = Math.min(Math.max(x, 0), 1);
    y = Math.min(Math.max(y, 0),1);

dot.style.left = (x * 100) + "%";
dot.style.top = (y * 100) + "%";

if(!isPlaying) return; 
const column = Math.min(Math.floor(x * noteLetters.length), noteLetters.length -1);
const row = Math.min(Math.floor(y * octaves.length), octaves.length -1);

const note = noteLetters[column] + octaves[row];
const cellId = column + "-" + row;
if (cellId !== lastCell) {
    piano.triggerAttackRelease(note, "8n");
    lastCell = cellId;
    }
});

