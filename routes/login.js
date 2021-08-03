const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const { urlencoded } = require('body-parser');
const router = express.Router();
const firestore = require('./firebase.js');
// const firestore = require('firebase-admin');
// const serviceAccount = require("./serviceAccount.json");

// // database connection
// firestore.initializeApp({
//     credential: firestore.credential.cert(serviceAccount)
// });
const db = firestore.firestore();

router.use(bodyparser.urlencoded({ extended: false }));

router.post('/', (req, res) => {
    const password = req.body.password.trim();
    const email = req.body.email.trim();
    async function findUser() {
        const snapshot = await db.collection('users').where("email", "==", `${email}`).get()
        if (snapshot.empty) {
            console.log('no data');
        }
        snapshot.forEach(doc => {
            async function checkUserIndentification() {
                const validPassword = await bcrypt.compare(password, doc.data().password);
                console.log(validPassword);
                if (validPassword) {
                    res.redirect('/shazam/?id=' + doc.data().id);
                }
                else {
                    res.send('<h1>Invalid password</h1');
                }
            }
            checkUserIndentification();
        });
    } findUser();
    
    // console.log(req.body);
});

module.exports = router;