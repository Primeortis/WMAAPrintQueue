import {setCustomUserClaims} from "firebase-tools"
import {firebaseApp} from "../src/firebase-config.js"
import {getAuth} from "firebase/auth"

function setLevel(levelInput){
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

export {setLevel, checkAdmin};