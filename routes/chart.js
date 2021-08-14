const express = require('express');
const axios = require('axios').default;
const router = express.Router();

router.get('/', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://shazam.p.rapidapi.com/charts/track',
        params: { locale: 'en-US', pageSize: '20', startFrom: '0' },
        headers: {
            'x-rapidapi-key': '5d8653681dmshd89639507d3fd0ap13628fjsn37e488cc2c3e',
            'x-rapidapi-host': 'shazam.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        // console.log(response.data.tracks);
        res.render('chart', {
            data: response.data.tracks
        });
    }).catch(function (error) {
        console.error(error);
    });
});

module.exports = router;