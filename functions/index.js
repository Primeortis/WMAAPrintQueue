/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");

const {initializeApp} = require("firebase-admin/app");
initializeApp();

exports.addmessage = onRequest(async (req, res)=> {
    res.send("Hello from Cloud Function!");
})