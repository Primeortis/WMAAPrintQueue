// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
import * as functions from "firebase-functions/v2";

import {setCustomUserClaims} from "firebase-tools"
import {firebaseApp} from "../src/firebase-config.js"
import {getAuth} from "firebase/auth"

//Sets the level of a user based on given UID and level from the user 
const setlevel = functions.https.onRequest((request, response) => {
    const auth = getAuth(firebaseApp);
    auth.setCustomUserClaims(request[0], {level: request[1]});
    logger.write("Updated " + auth.name())
});

const isadmin = onRequest(async () => {
    const auth = getAuth(firebaseApp);
    if(auth.currentUser.level == "admin"){
        return true;
    }
    return false;
});

export {setlevel, isadmin}