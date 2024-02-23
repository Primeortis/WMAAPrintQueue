const {Firestore} = require('@google-cloud/firestore');

//Create a client
const firestore = new Firestore();

//Create a new file within the firestore
async function createDocument(documentPath, printName, userID, timestamp, STLFilePath, printer, priority){
    //Reference the document to be made
    const document = firestore.doc(documentPath);

    //Set data to create object
    await document.set({
        PrintName: printName,
        UID: userID,
        TimeStamp: timestamp,
        STLFile: STLFilePath,
        Printer: printer,
        Priority: priority,
    });
}

//Takes in a string with the path within our firestore to edit that document
async function getDocumentField(documentPath, field){
    //Obtain a reference document
    const document = firestore.doc(documentPath);

    //Get Data from document as a String array
    const docSnap = await document.get();

    //Return data from given field
    return await docSnap.get(field);
}