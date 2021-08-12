
const socket = io();
const param = window.location.search;
const userID = param.replace('?id=', '');
socket.emit('userID', userID);

//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 
// shim for AudioContext when it's not avb. 
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext;

// ***********************************************FIREBASE*************************************************
const firebaseConfig = {
    apiKey: "AIzaSyAYzdAVD2UWcBq7PPxa6tO8w3tLCjFxoLQ",
    authDomain: "shazam-clone.firebaseapp.com",
    projectId: "shazam-clone",
    storageBucket: "shazam-clone.appspot.com",
    messagingSenderId: "577833969021",
    appId: "1:577833969021:web:f55110ba37655b51e75814",
    measurementId: "G-L1TP9FJMX1"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const fireDb = firebase.storage();

const h3 = document.querySelector('.stateDesignation');
const record = document.getElementById('record');
//***********************************RECODING WITH RECODER.JS LIBRARY************************************************** */
record.addEventListener('click', startRecording);
function startRecording() {
    h3.innerHTML = "Listening..."
    function recordTransform() {
        record.style.transform = record.style.transform == "scale(0.9)" ? "scale(0.95)" : "scale(0.9)";
        record.style.transition = "transform 1000ms";
    }
    setInterval(recordTransform, 1000);

    audioContext.resume().then(() => {
        console.log('audio context resumed');
    })
    console.log('recoding started');
    var constraints = {
        audio: true,
        video: false
    }

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        /* assign to gumStream for later use */
        gumStream = stream;
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
        rec = new Recorder(input, {
            numChannels: 1
        })
        //start the recording process 
        rec.record()
        console.log("Recording started");
        setTimeout(stopRecording, 3000);
    }).catch(function (err) {
        //enable the record button if getUserMedia() fails 
        console.log(err);
    });
}

function stopRecording() {
    console.log("stopButton clicked");
    //tell the recorder to stop the recording 
    rec.stop();
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
    console.log(blob);
    socket.emit('song', blob);
}


// ********************************** GET SHAZAM RESPONSE *******************************************************//
const musicCoverNode = document.getElementById('cover');
const musicTitleNode = document.getElementById('titleNode');
const musicArtistNameNode = document.querySelector('.artistName');
const musicUrlNode = document.getElementById('musicUrlNode');
const lyricscontainerNode = document.getElementById('lyricsPara');
const artistContainerNode = document.getElementById('artistContainer');
const artistImageNode = document.getElementById('artistImage');
const musicShazamLybrary = document.getElementById('musicShazamInLibrary');
const shazamResponseSection = document.getElementById('shazamResponse');
const welcomeNode = document.getElementById('ShazamWelcome');

socket.on('shazam', ({ artistName, musicTitle, musicCover, musicUrl, lyrics }) => {
    // console.log(album, name, artists);
    const user = {
        id: userID,
        shazam: {
            artistName: artistName,
            musicTitle: musicTitle,
            musicCover: musicCover,
            musicUrl: musicUrl,
            lyrics: lyrics
        }
    };
    window.localStorage.setItem('user', JSON.stringify(user));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    // set shazam response background
    // shazamResponseSection.setAttribute('style', `background-image: url("${userData.shazam.musicCover}");
    // background-repeat: no-repeat; background-size: cover;background: linear-gradient(to top,black,rgba(0, 0, 0, 0));`)
    // set music cover
    musicCoverNode.src = `${userData.shazam.musicCover}`;
    // set music title && name
    musicTitleNode.innerHTML = `${userData.shazam.musicTitle}`;
    musicArtistNameNode.innerHTML = `${userData.shazam.artistName}`;
    // set lyrics
    lyricscontainerNode.innerHTML = `${userData.shazam.lyrics}`;
    //set artist image container 
    artistImageNode.src = `${userData.shazam.musicCover}`;
    // shazamResponseSection.style.
    shazamResponseSection.hidden = "false";
    welcomeNode.hidden = "true";
    shazamResponseSection.style.display = "block";

    window.navigator.vibrate([200, 200]);
    
    h3.innerHTML = "Tap to shazam";
});

const arrowleft = document.querySelector('.fa-arrow-left');
arrowleft.addEventListener('click', () => {
    console.log(arrowleft);
    shazamResponseSection.hidden = "true";
    shazamResponseSection.style.display = "none";
    welcomeNode.hidden = "false";
});

const library = document.querySelector('.fa-music');
library.addEventListener('click', () => {
    window.open(`../library/?id=${userID}`,'_self');
});

// ********************************** GET CHARTS TRACKS**********************************************************//
// socket.on("charts-traks", (traks) => {
//     traks.forEach(trak => {
//         console.log(trak);
//     });
// })