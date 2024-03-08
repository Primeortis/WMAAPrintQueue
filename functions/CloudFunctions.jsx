// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest, HttpsError} = require("firebase-functions/v2/https");

import {setCustomUserClaims} from "firebase-tools"
import {firebaseApp} from "../src/firebase-config.js"
import {getAuth} from "firebase/auth"

exports.setLevel = onRequest(async (levelInput) => {
    const auth = getAuth(firebaseApp);
    auth.setCustomUserClaims(auth.currentUser.uid, {level: levelInput});
});

exports.isAdmin = onRequest(async () => {
    const auth = getAuth(firebaseApp);
    if(auth.currentUser.level == "admin"){
        return true;
    }
    return false;
});

/*function setLevel(levelInput){
    const auth = getAuth(firebaseApp);
    auth.setCustomUserClaims(auth.currentUser.uid, {level: levelInput});
};

function checkAdmin(){
    const auth = getAuth(firebaseApp);
    if(auth.currentUser.level == "admin"){
        return true;
    }
    return false;
};

export {setLevel, checkAdmin};*/