const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const { urlencoded } = require('body-parser');
const router = express.Router();
const firestore = require('./firebase.js');
const { body, validationResult } = require('express-validator');

const db = firestore.firestore();

router.use(bodyparser.urlencoded({ extended: false }));

router.post('/',
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 4 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send('validation error');
        }
        const email = req.body.email.trim();
        const password = req.body.password.trim();
        // console.log('new mail')
        async function updateForgotenPassword() {
            const snapshot = await db.collection('users').where("email", "==", `${email}`).get();
            if (snapshot.empty) {
                console.log('no data');
            }
            snapshot.forEach(doc => {
                async function cryptPassword() {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    db.collection('users').doc(doc.id).update({
                        password: `${hashedPassword}`
                    });
                    res.send('200');
                }
                cryptPassword();
                
            });
        }
        updateForgotenPassword();
    });
module.exports = router;