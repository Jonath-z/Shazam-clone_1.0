

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

const record = document.querySelector('.record');

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
                record.style.background = "red";
                record.style.color = "black";
                // console.log(stream);

                function stopMediaRecorder() {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    console.log("recorder stopped");
                    record.style.background = "";
                    record.style.color = "";
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
    const user = {
        id: userID,
        shazam: {
            album: album,
            name: name,
            artists: artists
        }
    };
    window.localStorage.setItem('user', JSON.stringify(user));
    
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
});


// ********************************** GET CHARTS TRACKS**********************************************************//
// socket.on("charts-traks", (traks) => {
//     traks.forEach(trak => {
//         console.log(trak);
//     });
// })