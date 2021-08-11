
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

function recordTransform() {
    record.style.transform = record.style.transform == "scale(0.95)" ? "scale(0.9)" : "scale(0.95)";
    record.style.transition = "transform 1000ms";
}
setInterval(recordTransform, 1000);

record.addEventListener('click', startRecording);

function startRecording() {
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
socket.on('shazam', ({ artistName, musicTitle,musicCover,musicUrl,lyrics}) => {
    // console.log(album, name, artists);
            const user = {
                id: userID,
                shazam: {
                    artistName: artistName,
                    musicTitle: musicTitle,
                    musicCover: musicCover,
                    musicUrl:musicUrl
                }
            };
            window.localStorage.setItem('user', JSON.stringify(user));
            const userData = JSON.parse(localStorage.getItem('user'));
            console.log(userData);
        
            window.open('../shazam/response', '_self').document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <link rel="stylesheet" href="/statics/shazam-response.css">
                    <link href="http://fonts.cdnfonts.com/css/mank-sans" rel="stylesheet">
                    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
                    <script src="https://cdn.socket.io/3.1.3/socket.io.min.js" integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh" crossorigin="anonymous"></script>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Shazam</title>
                </head>
                <body id="shazamBody">
                    <section class="musicOption">
                        <div class="arrowleft">
                             <i class="fa fa-arrow-left" style="font-size:25px"></i>
                        </div>
                        <div class="optionContainer">
                            <p class="option">SONG</p>
                            <p class="option">LYRICS</p>
                            <p class="option">ARTIST</p>
                        </div>
                        <div class="shareContainer">
                        <i class="fa fa-share-alt" style="font-size:25px"></i>
                        </div>
                    </section>
                    <section class="musicCover">
                        <div class="musicCoverDiv">
                            <img id="cover" src="${userData.shazam.musicCover}" alt="cover">
                        </div>
                    </section>
                    <section class="detailsContainer">
                        <div class="musicDetails">
                            <h2>${userData.shazam.musicTitle}</h2>
                            <p class="artistName">${userData.shazam.artistName}</p>
                        </div>
                        <div class="playFullMusic">
                           <a href="${userData.shazam.musicUrl}"><button class="fullMusicButton">PLAY FULL SONG</button></a>
                        </div>
                    </section>
                    <section id="lyricsContainer">
                    
                    </section>
                    <section id="artistContainer">
                    <div id="artistImg">
                    <img src="${userData.shazam.musicCover}" alt="artist image" id="artistImage">
                    </div>
                    <p id="trackParagraph">In your library</p>
                    <hr>
                    <div id="musicShazamInLibrary">
                    <p>${lyrics}</p>
                    </div>
                    </section>
                    <script src="/static/shazam-response.js"></script>
                    <script>
                        const body = document.getElementById('shazamBody');
                        body.style.background = "url('${userData.shazam.musicCover}')";
                        body.style.backgroundSize = "100% 100vh";
                        body.style.backgroundRepeat = "no-repeat";
                        body.style.backgroundAttachement = "fixed";
                        body.style.backgroundPosition = "center";
                        // body.style.backDrop = "blur(10px)";
                    </script>
                </body>
                </html>
            `);
            h3.innerHTML = "Tap to shazam";
    

});

// *********************************************get lyrics ***********************************************************//
// const lyricsContainer = document.getElementById('lyricsContainer');
// socket.on('lyrics', lyrics => {
//     const lyricsResult = {
//         id: userID,
//         lyrics : lyrics
//     }
//     window.localStorage.setItem('user', JSON.stringify(lyricsResult));
//     const shazamLyrics = JSON.parse(localStorage.getItem('lyricsResult'));
//     lyricsContainer.style.display = "block";
//     const p = document.createElement('p');
//     p.classList = "lyrics";
//     p.style.textAlign = "center";
//     const finalLyrics = shazamLyrics.lyrics.replaceAll('/\n', '<br>');
//     p.innerHTML = `${finalLyrics}`;
//     console.log(lyrics);
// });



// socket.on('shazam-single', ({ name, song, songLink }) => {
//     const user = {
//         id: userID,
//         shazam: {
//             name: name,
//             songTitle: song,
//             songLink: songLink,
//         }
//     };
//     window.localStorage.setItem('user', JSON.stringify(user));
//     const userData = JSON.parse(localStorage.getItem('user'));
//     console.log(userData);
//     const shazamResponseWindow = window.open('../shazam/response', '_self').document.write(`
//                 <!DOCTYPE html>
//                 <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//                     <link rel="stylesheet" href="/statics/shazam-response.css">
//                     <link href="http://fonts.cdnfonts.com/css/mank-sans" rel="stylesheet">
//                     <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
//                     <script src="https://cdn.socket.io/3.1.3/socket.io.min.js" integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh" crossorigin="anonymous"></script>
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>Shazam</title>
//                 </head>
//                 <body id="shazamBody">
//                     <section class="musicOption">
//                         <div class="arrowleft">
//                              <i class="fa fa-arrow-left" style="font-size:25px"></i>
//                         </div>
//                         <div class="optionContainer">
//                         </div>
//                         <div class="shareContainer">
//                         <i class="fa fa-share-alt" style="font-size:25px"></i>
//                         </div>
//                     </section>
//                     <section class="musicCover">
//                         <div class="musicCoverDiv">
//                             <img id="cover" src="/public/default-music.jpg" alt="cover">
//                         </div>
//                     </section>
//                     <section class="detailsContainer">
//                         <div class="musicDetails">
//                             <h2>${userData.shazam.songTitle}</h2>
//                             <p class="artistName">${userData.shazam.name}</p>
//                         </div>
//                         <div class="playFullMusic">
//                            <a href="${userData.shazam.songLink}"><button class="fullMusicButton">PLAY FULL SONG</button></a>
//                         </div>
//                     </section>
//                     <script src="/static/shazam-response.js"></script>
//                     <script src="/static/record.js"></script>

//                     <script>
//                         const body = document.getElementById('shazamBody');
//                         body.style.backgroundImage = "url('/public/default-music.jpg')";
//                         body.style.backgroundRepeat = "no-repeat";
//                         body.style.backgroundPositionY = "50px";
//                         body.style.backDrop = "blur(10px)";
//                     </script>
//                 </body>
//                 </html>
//         `);
//     h3.innerHTML = "Tap to shazam";

// });

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