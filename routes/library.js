const express = require('express');
const axios = require('axios');
const router = express.Router();
const mongoose = require('mongoose');


mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;

router.post('/', (req, res) => {
    const id = req.body.id;
    console.log(id);
    res.redirect('/library/');
});
router.get('/', (req, res) => {
    const id = req.query.id;
    console.log(id);
    mongodb.collection("users").find({id:`${id}`}).toArray((err, data) => {
        if (err) {
            console.log(err);
        }
        // console.log(data);
        res.render('library', {
            data: data
        });
    });
});

module.exports = router;