/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {logger} = require("firebase-functions");
const {onRequest, onCall, HttpsError} = require("firebase-functions/v2/https");

const {initializeApp} = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
initializeApp();

exports.helloworld = onRequest(async (req, res)=> {
    res.send("Hello from Cloud Function!");
})
exports.setrole = onCall(async (request) => {
    if(request.data.uid.length < 5) return {result:"Invalid UID"}
    logger.log("Role route start");
    logger.log("Role route", request.data.uid, request.data.role);
    getAuth().setCustomUserClaims(request.data.uid, {role: request.data.role});
    return {result:"User role set successfully!"}
});

