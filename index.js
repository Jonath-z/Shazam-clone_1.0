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
const updateForgotenPassword = require('./routes/updatepassword.js');

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

// initialize musixMAtch 
const Musixmatch = require('musixmatch-node')
const mxm = new Musixmatch(`${process.env.MUSIX_MATCH_API_KEY}`);
// database connection
mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;


const db = firestore.firestore();
console.log(process.env.MONGO_DB);

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
app.use('/update/password', updateForgotenPassword);

function socket() {
    io.on('connection', (socket) => {
        console.log('socekt ID' + socket.id);
        socket.on('userID', id => {
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
                        'x-rapidapi-key': `${process.env.SHAZAM_RAPID_API_KEY}`,
                        'x-rapidapi-host': 'shazam.p.rapidapi.com'
                    },
                    data: `${base64}`
                };
        
                axios.request(options).then(function (response) {
                    console.log(response.data);
                    const matches = response.data.matches.length;
                            
                    // **************************check data response ********************//
                    if (matches == 0) {
                        socket.emit('no-data', 'no data');
                    }
                    
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
            });
        });
    });

}//updateUserSocketID();

socket();

const port = process.env.PORT || 7070

server.listen(port, () => { console.log("server is running on 7070") });