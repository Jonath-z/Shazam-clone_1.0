const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const uuid = require('uuid');
const router = express.Router();
const firestore = require('./firebase.js');
const { body, validationResult } = require('express-validator');
// const serviceAccount = require("./serviceAccount.json");

// // database connection
// firestore.initializeApp({
//     credential: firestore.credential.cert(serviceAccount)
// });
const db = firestore.firestore()
// mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

router.use(bodyparser.urlencoded({ extended: false }));

// ************************USER REGISTRATION************************************************//
router.post('/',
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 4 })
    , (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send('<h1 style:"font-family:sans-serif;text-align:center;margin-top:30px">Please complete the password with at least 4 characters then complete your Email</h1>');
        }
    const password = req.body.password.trim();
    const email = req.body.email.trim();

    async function cryptPassword() {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let userID = uuid()
        // console.log(userID);
        const userData = {
            id:userID,
            email: email,
            password: hashedPassword,
            shazam: [],
            socketID:''
        }
        const doc = db.collection('users');
        doc.doc(`${Date.now()}`).set(userData);
    }
    cryptPassword();

    res.redirect('/');
    // console.log(req.body);
});

// *****************************GET SIGNUP PAGE****************************************//  
router.get('/', (req, res) => {
    res.render('signup');
});

module.exports = router;