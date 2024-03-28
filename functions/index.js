/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {logger} = require("firebase-functions");
const functions = require("firebase-functions/v1");
const {onRequest, onCall, HttpsError} = require("firebase-functions/v2/https");

const {initializeApp} = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
initializeApp();
const auth = getAuth();

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

exports.getuserinformation = onCall(async (request) => {
    logger.log(request.data)
    if(!(request.data.email || request.data.uid)) return {result:"Invalid Request"};
    let user;
    if(request.data.uid){
        user = await getAuth().getUser(request.data.uid);
    } else {
        user = await getAuth().getUserByEmail(request.data.email);
    }
    // remove unnecessary/possibly sensitive data
    let moduser = {
        role: user.customClaims.role,
        disabled: user.disabled,
        displayName: user.displayName,
        email: user.email,
        lastSignIn: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime,
        uid: user.uid
    }
    return {result:moduser};
})

exports.handlenewuser = functions.auth.user().onCreate((user) => {
    logger.log("New User Created: " + user.displayName);
    getAuth().setCustomUserClaims(user.uid, {role: "pending"});
    return {result:"New User Created: " + user.displayName};
});

exports.pauseuser = onCall(async (request) => {
    if(request.data.uid.length < 5) return {result:"Invalid UID"}
    logger.log(request.data.disabled)
    getAuth().updateUser(request.data.uid, {disabled: request.data.disabled});
    return {result:"User paused state updated successfully!"}
})