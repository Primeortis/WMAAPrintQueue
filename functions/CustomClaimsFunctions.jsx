// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

import {setCustomUserClaims} from "firebase-tools"
import {firebaseApp} from "../src/firebase-config.js"
import {getAuth} from "firebase/auth"

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