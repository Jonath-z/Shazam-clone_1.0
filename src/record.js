

const socket = io();
const param = window.location.search;
const userID = param.replace('?id=', '');
socket.emit('userID', userID);

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


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia(
        // constraints - only audio needed for this app
        {
            audio: true
        })
 
        // Success callback
        .then(function (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            record.onclick = function () {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                h3.innerHTML = "listening";
                // console.log(stream);

                function stopMediaRecorder() {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    console.log("recorder stopped");
                }
                setTimeout(stopMediaRecorder, 5000);
                
            }
            let chunks = [];

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }            
            mediaRecorder.onstop = function (e) {
                const blob = new Blob(chunks, { 'type': 'audio/mp3; codecs=opus' });
                chunks = [];
                // const audioURL = window.URL.createObjectURL(blob);
                // console.log(audioURL);
                // console.log(blob);
                // console.log(audio);
                async function emitURL() {
                    await fireDb.ref('/myFolder' + Date.now()).put(blob).then((snapshot) => {
                        console.log('blob uploaded');
                        snapshot.ref.getDownloadURL().then(myURL => {
                            console.log(myURL);
                            socket.emit('audioURL', myURL);
                        })
                    });

                }
                emitURL();

            }
        })
 
        // Error callback
        .catch(function (err) {
            console.log('The following getUserMedia error occurred: ' + err);
        }
        );
} else {
    console.log('getUserMedia not supported on your browser!');
}


// ********************************** GET SHAZAM RESPONSE *******************************************************//
socket.on('shazam-result', ({album,name,artists}) => {
    console.log(album, name, artists);
    if (album !== "undefined" && artists !== "undefined") {
        const user = {
            id: userID,
            shazam: {
                album: album,
                name: name,
                artists: artists
            }
        };
        window.localStorage.setItem('user', JSON.stringify(user));
        const shazamResponseWindow = window.open('../shazam/response', '_self').document.write(`
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
                            <p class="option">VIDEO</p>
                            <p class="option">ARTIST</p>
                        </div>
                        <div class="shareContainer">
                        <i class="fa fa-share-alt"></i>
                        </div>
                    </section>
                    <section class="detailsContainer">
                        <div class="musicDetails">
                            <h2>${name}</h2>
                            <p class="artistName">${artists[0].name}</p>
                        </div>
                        <div class="playFullMusic">
                            <button class="fullMusicButton">PLAY FULL SONG</button>
                        </div>
                    </section>
                    <script src="/static/record.js"></script>
                    <script>
                        const body = document.getElementById('shazamBody');
                        body.style.backgroundImage = "url('${album.images[1].url}')",linear-gradient(to top,black,rgba(0, 0, 0, 0))";
                        body.style.backgroundRepeat = "no-repeat";
                        body.style.backgroundSize = "cover";
                    </script>
                </body>
                </html>
        `);
        h3.innerHTML = "Tap to shazam";
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log(userData); 
    }
});


// ********************************** GET CHARTS TRACKS**********************************************************//
// socket.on("charts-traks", (traks) => {
//     traks.forEach(trak => {
//         console.log(trak);
//     });
// })