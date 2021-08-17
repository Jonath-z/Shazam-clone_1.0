const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const { urlencoded } = require('body-parser');
const router = express.Router();
const firestore = require('./firebase.js');
const { body, validationResult } = require('express-validator');

const db = firestore.firestore();

router.use(bodyparser.urlencoded({ extended: false }));

router.post('/', body('email').isEmail().normalizeEmail(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send('validation error');
        }
        const email = req.body.email.trim();
        // console.log(email);
        async function checkEmail() {
            const snapshot = await db.collection('users').where("email", "==", `${email}`).get();
            if (snapshot.empty) {
                res.send('404');
            }
            res.send('200');
        }
        checkEmail();
    });
module.exports = router;