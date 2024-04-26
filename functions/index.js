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
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const app = initializeApp();



async function deleteCollection(db, collectionRef, batchSize) {
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve, deleteCorrespondingInStorage = false) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        if(deleteCorrespondingInStorage){
            const storage = getStorage();
            const file = storage.bucket().file(doc.data().filename);
            file.delete().then(() => {
                logger.log("File deleted successfully!");
            }).catch((e) => {
                logger.log(e);
            });
        }
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

exports.helloworld = onRequest(async (req, res)=> {
    res.send("Hello from Cloud Function!");
})

exports.setrole = onCall(async (request) => {
    // CHECK IF USER IS ADMIN
    if(request.auth.token.role != "admin") return {error:true, message:"Unauthorized"}
    // ---
    if(request.data.uid.length < 5) return {result:"Invalid UID"}
    logger.log("Role route start");
    logger.log("Role route", request.data.uid, request.data.role);
    getAuth().setCustomUserClaims(request.data.uid, {role: request.data.role});
    return {result:"User role set successfully!"}
});

exports.getuserinformation = onCall(async (request) => {
    // CHECK IF USER IS ADMIN
    if(request.auth.token.role != "admin") return {error:true, message:"Unauthorized"}
    // ---
    logger.log(request.data)
    if(!(request.data.email || request.data.uid)) return {result:{message:"Invalid Request", error:true}};
    let user;
    try{
    if(request.data.uid){
        user = await getAuth().getUser(request.data.uid);
    } else {
        user = await getAuth().getUserByEmail(request.data.email);
    }
    } catch (e){
        logger.log(e)
        return {result:{error:true, message:"User Not Found"}}; // result field for message, error field for error status
    }
    let role = null;
    try{
        role = user.customClaims.role;
    }catch (e){
        role = "none";
    }
    // remove unnecessary/possibly sensitive data
    let moduser = {
        error: false,
        role: role,
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
    // CHECK IF USER IS ADMIN
    if(request.auth.token.role != "admin") return {error:true, message:"Unauthorized"}
    // ---
    if(request.data.uid.length < 5) return {result:"Invalid UID"}
    logger.log(request.data.disabled)
    getAuth().updateUser(request.data.uid, {disabled: request.data.disabled});
    return {result:"User paused state updated successfully!"}
})

exports.deleteuser = onCall(async (request) => {
    // CHECK IF USER IS ADMIN
    if(request.auth.token.role != "admin") return {error:true, message:"Unauthorized"}
    // ---
    if(request.data.uid.length < 5) return {result:"Invalid UID"}
    const db = getFirestore();
    logger.log(request.data.disabled)
    try {
        getAuth().deleteUser(request.data.uid);
    } catch (e){
        logger.log(e)
        return {error:true, message:e}
    }

    try {
        let collection = db.collection("files");
        let q = collection.where("userID", "==", request.data.uid);
        deleteQueryBatch(db, q, 100, true);
    } catch (e){
        logger.log(e);
        return {error:true, message:e}
    }
    

    return {error:false, result:"User deleted successfully!"}
})

exports.deleteCategory = onCall(async (request)=> {
    // CHECK IF USER IS ADMIN
    if(request.auth.token.role != "admin") return {error:true, message:"Unauthorized"}
    // ---

    const db = getFirestore();
    try {
        const collectionRef = db.collection("categories").doc(request.data.id).collection("prints");
        await deleteCollection(db, collectionRef, 100);
        await db.collection("categories").doc(request.data.id).delete();
    } catch(e){
        return {error:true, message:e}
    } finally {
        return {result:"Category deleted successfully!", error:false}
    }
})

exports.deletePrinter = onCall(async (request)=> {
    // CHECK IF USER IS ADMIN
    if(request.auth.token.role != "admin") return {error:true, message:"Unauthorized"}
    // ---

    const db = getFirestore();
    try {
        const collectionRef = db.collection("printers").doc(request.data.id).collection("maintenance");
        await deleteCollection(db, collectionRef, 100);
        await db.collection("printers").doc(request.data.id).delete();
    } catch(e){
        return {error:true, message:e}
    } finally {
        return {result:"Printer deleted successfully!", error:false}
    }
})

exports.deletePrinterLogs = onCall(async (request)=> {
    // CHECK IF USER IS ADMIN
    if(request.auth.token.role != "admin") return {error:true, message:"Unauthorized"}
    // ---

    const db = getFirestore();
    try {
        const collectionRef = db.collection("printers").doc(request.data.id).collection("maintenance");
        await deleteCollection(db, collectionRef, 100);
    } catch(e){
        return {error:true, message:e}
    } finally {
        return {result:"Logs deleted successfully!", error:false}
    }
})

exports.checkadmin = onCall(async (request) => {
    return {result:request.auth.token.role == "admin"};
})

exports.checkclassroom = onCall(async (request) => {
    return {result:(request.auth.token.role == "admin" || request.auth.token.role == "classroom")};
})

exports.upgradeUser = onCall(async (request) => {
    //if(!request.auth.token.email.includes("@westmichiganaviation.org")) return {error:true, message:"Unauthorized"}
    getAuth().setCustomUserClaims(request.auth.token.uid, {role: "student"});
    return {error:false, message:"Success in setting role"}
})