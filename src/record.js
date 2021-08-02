const socket = io();

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
const stop = document.querySelector('.stop');
const audio = document.querySelector('.audioClip');

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
            }
            let chunks = [];

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }
            stop.onclick = function () {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
                record.style.background = "";
                record.style.color = "";
            }
            
            mediaRecorder.onstop = function (e) {
                // const audio = document.createElement('audio');
                const blob = new Blob(chunks, { 'type': 'audio/mp3; codecs=opus' });
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                console.log(audioURL);
                console.log(blob);
                console.log(audio);
                // blob.arrayBuffer().then(buffer => {
                //     const context = new AudioContext();
                //     buffer = context.createBuffer(1, 22050, 22050);

                    
                //     function ArrayBufferToBase64(buffer) {
                //         //The first step is to convert the ArrayBuffer to a binary string
                //         var binary = '';
                //         var bytes = new Uint8Array(buffer);
                //         for (var len = bytes.byteLength, i = 0; i < len; i++) {
                //             binary += String.fromCharCode(bytes[i]);
                //         }
                //         //Convert binary string to base64 string
                //         socket.emit('audioURL', binary);
                //         console.log(binary);
                //         return window.btoa(binary);
                //     }
                //     ArrayBufferToBase64(buffer);
                // });
                // // const fileReader = new FileReader();
                // const myURL = fileReader.readAsDataURL(blob);
                // console.log(myURL);
                // const  arrayBuffer;
                // var fileReader = new FileReader();
                // fileReader.onload = function (event) {
                //     arrayBuffer = event.target.result;
                // };
                // const mybyte = String.raw(blob);
                // console.log(mybyte);
                // fileReader.addEventListener('loadend', () => {
                // const byteArrey = new Uint8Array(chunks);
                // const len = byteArrey.byteLength;
                // let binary = '';
                // for (let i = 0; i < len; i++) {
                //     binary += String.fromCharCode(byteArrey[i]);
                    
                //     }
                //     console.log(byteArrey);
                // });
                async function emitURL() {
                    await fireDb.ref('/myFolder' + Date.now()).put(blob).then((snapshot) => {
                        console.log('blob uploaded');
                        snapshot.ref.getDownloadURL().then(myURL => {
                            console.log(myURL);
                            socket.emit('audioURL', myURL);
                            audio.src = myURL;
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