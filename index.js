const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const axios = require('axios').default;
const mongoose = require('mongoose');
const musicxMatch = require('musixmatch-node');
const router = require('./routes');
const signup = require('./routes/signup.js');
const login = require('./routes/login.js');
const shazam = require('./routes/shazam.js');
const ObjectId = require('mongodb').ObjectId;
const { emit } = require('process');
const firestore = require('./routes/firebase.js');
const welcome = require('./routes/welcome.js');
const response = require('./routes/shazam-response.js');
const library = require('./routes/library.js');
const chart = require('./routes/chart.js');
const remove = require('./routes/remove.js');
const checkUserMail = require('./routes/checkEmail.js');

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

// initialize musixMAtch 
const Musixmatch = require('musixmatch-node')
const mxm = new Musixmatch(`${process.env.MUSIX_MATCH_API_KEY}`);
// database connection
mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;


const db = firestore.firestore();

app.use(express.json());
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));
app.use('/static', express.static(path.join(__dirname, './src')));
app.use('/statics', express.static(path.join(__dirname, './css')));
app.use('/public', express.static(path.join(__dirname, './images')));
app.set('view engine', 'ejs');
app.set('socketio', io);
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/login', router);
app.use('/', welcome);
app.use('/signup', signup);
app.use('/login', login);
app.use('/shazam/', shazam);
app.use('/shazam/response', response);
app.use('/library/', library);
app.use('/tracks/', chart);
app.use('/remove', remove);
app.use('/check/email', checkUserMail);

function socket() {
    io.on('connection', (socket) => {
        console.log('socekt ID' + socket.id);
        socket.on('userID', id => {
            async function updateUserSocketID() {
                const snapshot = await db.collection("users").where("id", "==", `${id}`).get();
                if (snapshot.empty) {
                    console.log("no data");
                }
                // console.log(snapshot);
                snapshot.forEach(doc => {
                    db.collection("users").doc(doc.id).update({
                        "socketID": `${socket.id}`
                    });

                    socket.on('song', (blob) => {
                        console.log(blob);
                        const buffer = blob;
                        const base64 = buffer.toString('base64');
                        // console.log(base64);
                       
                        const options = {
                            method: 'POST',
                            url: 'https://shazam.p.rapidapi.com/songs/detect',
                            headers: {
                                'content-type': 'text/plain',
                                'x-rapidapi-key': '5d8653681dmshd89639507d3fd0ap13628fjsn37e488cc2c3e',
                                'x-rapidapi-host': 'shazam.p.rapidapi.com'
                            },
                            data: `${base64}`
                        };
        
                        axios.request(options).then(function (response) {
                            console.log(response.data);
                            const matches = response.data.matches.length;
                            if (matches == 0) {
                                socket.emit('no-data', 'no data');
                            }
                            console.log(response.data.track.artists);
                            const shazam = {
                                id: id,
                                artistName: response.data.track.subtitle,
                                musicTitle: response.data.track.title,
                                musicCover: response.data.track.images.background,
                                musicUrl: response.data.track.share.href,
                                // lyrics: `${lyrics.message.body.lyrics.lyrics_body}`
                            }
                            socket.emit('shazam', shazam);
                            mongodb.collection("users").insertOne(shazam);
                            // getShazamLyrics();

                        }).catch(function (error) {
                            console.error(error);
                        });
                        socket.on('lyrics-parameters', ({ artist, song }) => {
                            const options = {
                                method: 'GET',
                                url: 'https://sridurgayadav-chart-lyrics-v1.p.rapidapi.com/apiv1.asmx/SearchLyricDirect',
                                params: { artist: `${artist}`, song: `${song}` },
                                headers: {
                                    'x-rapidapi-key': '5d8653681dmshd89639507d3fd0ap13628fjsn37e488cc2c3e',
                                    'x-rapidapi-host': 'sridurgayadav-chart-lyrics-v1.p.rapidapi.com'
                                }
                            };
                          
                            axios.request(options).then(function (response) {
                                console.log(response.data);
                            }).catch(function (error) {
                                console.error(error);
                            });
                        });
                    });
                });

            } updateUserSocketID();
         
        
        });
        // const options = {
        //     method: 'GET',
        //     url: 'https://shazam.p.rapidapi.com/charts/track',
        //     params: { locale: 'en-US', pageSize: '20', startFrom: '0' },
        //     headers: {
        //         'x-rapidapi-key': '5d8653681dmshd89639507d3fd0ap13628fjsn37e488cc2c3e',
        //         'x-rapidapi-host': 'shazam.p.rapidapi.com'
        //     }
        // };

        // axios.request(options).then(function (response) {
        //     console.log(response.data);
        //     socket.emit("charts-traks", response.data);
        // }).catch(function (error) {
        //     console.error(error);
        // });
    
    });
}
socket();

const port = process.env.PORT || 7070

server.listen(port, () => { console.log("server is running on 7070") });