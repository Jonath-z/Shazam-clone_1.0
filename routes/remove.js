const express = require('express');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const bodyparser = require('body-parser');
const router = express.Router();

// database connection
mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
const mongodb = mongoose.connection;
router.use(bodyparser.urlencoded({ extended: false }));

router.post('/', (req, res) => {
    const id = req.body.id;
    const mongoID = new ObjectId(id);
    console.log(mongoID, id);
    mongodb.collection("users").deleteOne({ _id: mongoID });
    
});

module.exports = router;