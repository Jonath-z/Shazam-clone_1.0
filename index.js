const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const axios = require('axios').default;
const mongoose = require('mongoose');
const router = require('./routes');
const signup = require('./routes/signup.js');
const login = require('./routes/login.js');
const shazam = require('./routes/shazam.js');
const ObjectId = require('mongodb').ObjectId;
const { emit } = require('process');
const firestore = require('./routes/firebase.js');
const welcome = require('./routes/welcome.js');
const response = require('./routes/shazam-response.js');

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

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

                    socket.on('audioURL', (url) => {
                        console.log(url);
                        var data = {
                            'api_token': 'e2ba9ab8836fa4ff1853912d97858931',
                            'url': `${url}`,
                            'return': 'lyrics,apple_music,spotify',
                        };
                        axios({
                            method: 'post',
                            url: 'https://api.audd.io/',
                            data: data,
                            headers: { 'Content-Type': 'multipart/form-data' },
                        })
                            .then((response) => {
                                console.log(response.data.result);
                                async function getUserSocektID() {
                                    const snapshot = await db.collection("users").where("id", "==", `${id}`).get();
                                    if (snapshot.empty) {
                                        console.log(err);
                                    }
                                    snapshot.forEach(doc => {
                                        socket.emit('shazam-result', response.data.result.spotify);
                                        
                                        const shazam = {
                                            id: id,
                                            lyrics: response.data.result.lyrics,
                                            artistName: response.data.result.spotify.artists[0].name,
                                            musicTitle: response.data.result.spotify.name,
                                            musicCover: response.data.result.spotify.album.images[1],
                                            albumName: response.data.result.spotify.album.name,
                                            albumType: response.data.result.spotify.album.album_type,
                                            musicUrl: response.data.result.spotify.album.external_urls.spotify,
                                            releaseDate: response.data.result.spotify.album.release_date,
                                            releaseDatePrecision: response.data.result.album.release_date_precision
                                        }
                                        
                                        mongodb.collection("users").insertOne(shazam);
                                       
                                        // console.log(doc.data().socketID + " soceket id ======> " + socket.id);
                                    });
                                }
                                getUserSocektID();
                                
                            })
                            .catch((error) => {
                                console.log(error);
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