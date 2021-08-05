
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
                h3.innerHTML = 'Listening...';
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
socket.on('shazam-album', ({ album, name, artists,}) => {
    // console.log(album, name, artists);
    if (album !== "undefined" && artists !== "undefined") {
            const user = {
                id: userID,
                shazam: {
                    album: album,
                    name: name,
                    artists: artists,
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
                        </div>
                        <div class="shareContainer">
                        <i class="fa fa-share-alt" style="font-size:25px"></i>
                        </div>
                    </section>
                    <section class="musicCover">
                        <div class="musicCoverDiv">
                            <img id="cover" src="${userData.shazam.album.images[1].url}" alt="cover">
                        </div>
                    </section>
                    <section class="detailsContainer">
                        <div class="musicDetails">
                            <h2>${userData.shazam.name}</h2>
                            <p class="artistName">${userData.shazam.artists[0].name}</p>
                        </div>
                        <div class="playFullMusic">
                           <a href="${userData.shazam.album.external_urls.spotify}"><button class="fullMusicButton">PLAY FULL SONG</button></a>
                        </div>
                    </section>
                    <script src="/static/shazam-response.js"></script>
                    <script>
                        const body = document.getElementById('shazamBody');
                        body.style.backgroundImage = "url('${userData.shazam.album.images[0].url}')";
                        body.style.backgroundRepeat = "no-repeat";
                        body.style.backgroundPositionY = "50px";
                        body.style.backDrop = "blur(10px)";
                    </script>
                </body>
                </html>
            `);
            h3.innerHTML = "Tap to shazam";
    }

});

// socket.on('lyrics', lyrics => {
//     console.log(lyrics);
//     window.localStorage.setItem('lyrics', JSON.stringify(lyrics));
//     const songLyrics = JSON.parse(localStorage.getItem('lyrics'));
//     console.log(songLyrics);
// });

socket.on('shazam-single', ({ name, song, songLink }) => {
    const user = {
        id: userID,
        shazam: {
            name: name,
            songTitle: song,
            songLink: songLink,
        }
    };
    window.localStorage.setItem('user', JSON.stringify(user));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
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
                        </div>
                        <div class="shareContainer">
                        <i class="fa fa-share-alt" style="font-size:25px"></i>
                        </div>
                    </section>
                    <section class="musicCover">
                        <div class="musicCoverDiv">
                            <img id="cover" src="/public/default-music.jpg" alt="cover">
                        </div>
                    </section>
                    <section class="detailsContainer">
                        <div class="musicDetails">
                            <h2>${userData.shazam.songTitle}</h2>
                            <p class="artistName">${userData.shazam.name}</p>
                        </div>
                        <div class="playFullMusic">
                           <a href="${userData.shazam.songLink}"><button class="fullMusicButton">PLAY FULL SONG</button></a>
                        </div>
                    </section>
                    <script src="/static/shazam-response.js"></script>
                    <script>
                        const body = document.getElementById('shazamBody');
                        body.style.backgroundImage = "url('/public/default-music.jpg')";
                        body.style.backgroundRepeat = "no-repeat";
                        body.style.backgroundPositionY = "50px";
                        body.style.backDrop = "blur(10px)";
                    </script>
                </body>
                </html>
        `);
    h3.innerHTML = "Tap to shazam";

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