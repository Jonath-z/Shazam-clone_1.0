const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes');
const ejs = require('ejs');
const favicon = require('serve-favicon');
const axios = require('axios').default;


const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });


app.use(express.json());
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));
app.use('/static', express.static(path.join(__dirname, './src')));
app.set('view engine', 'ejs');
app.set('socketio', io);
app.set("views", path.join(__dirname, "views"));

app.use('/', router);


function socket() {
    io.on('connection', (socket) => {
        console.log('socekt ID' + socket.id);
        socket.on('audioURL', (url) => {


            // const options = {
            //     method: 'POST',
            //     url: 'https://shazam.p.rapidapi.com/songs/detect',
            //     headers: {
            //       'content-type': 'text/plain',
            //       'x-rapidapi-key': '5d8653681dmshd89639507d3fd0ap13628fjsn37e488cc2c3e',
            //       'x-rapidapi-host': 'shazam.p.rapidapi.com'
            //     },
            //     data: `${url}`
            //   };
              
            //   axios.request(options).then(function (response) {
            //       console.log(response.data);
            //   }).catch(function (error) {
            //       console.error(error);
            //   });


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
                // console.log(response.data.lyrics);
                console.log(response.data.result.spotify.album.images);
            })
            .catch((error) =>  {
                console.log(error);
            });
        })
    })
}
socket();

const port = process.env.PORT || 7070

server.listen(port, () => { console.log("server is running on 7070") });