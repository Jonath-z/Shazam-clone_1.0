const firestore = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

module.exports = firestore.initializeApp({
    credential: firestore.credential.cert(serviceAccount)
});