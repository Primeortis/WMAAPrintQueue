import Navbar from "../../components/navbar/nav";
import { Box, Button, Modal, LinearProgress, TextField, Select, MenuItem } from "@mui/material";
import styles from "../pagestyles.module.css"
import File from "../../components/file.jsx";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase-config.js";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import {Link} from "react-router-dom";

const NewPrintPage = () => {
    let [files, setFiles] = useState(null);
    let [modalOpen, setModalOpen] = useState(false);
    let [selectedFile, setSelectedFile] = useState(null);
    let [selectedFileID, setSelectedFileID] = useState(null);
    let [printName, setPrintName] = useState(null);
    let [printDescription, setPrintDescription] = useState(null);
    let [userPrintPurpose, setUserPrintPurpose] = useState(null);;
    let [printPurpose, setPrintPurpose] = useState(null);
    let [classFor, setClassFor] = useState(null);
    let [teacherOfClass, setTeacherOfClass] = useState(null);
    let [printMaterial, setPrintMaterial] = useState(null);
    let [printLocation, setPrintLocation] = useState(null);
    let [categories, setCategories] = useState(null);

    useEffect(()=> {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "categories"))
      async function getCategories(){
          var querySnapshot = await getDocs(q);
          console.log(querySnapshot);
          let docs = [];
          querySnapshot.forEach((doc)=> {
          let data = doc.data();
          docs.push(<MenuItem value={doc.id}>{data.name}</MenuItem>);
          })
          setCategories(docs);
      }
      getCategories();
    }, [])

    function onOpenButtonClicked(){
        const db = getFirestore(firebaseApp);
        const auth = getAuth(firebaseApp);
        const q = query(collection(db, "files"), where("userID", "==", auth.currentUser.uid))
        async function getUserFiles(){
            var querySnapshot = await getDocs(q);
            console.log(querySnapshot);
            let docs = [];
            querySnapshot.forEach((doc)=> {
            let data = doc.data();
            docs.push(<File id={doc.id} name={data.name} date={data.date} key={doc.id} onClick={({id, name})=>{setSelectedFile(name);setSelectedFileID(id);setModalOpen(false);}}/>);
            })
            setFiles(docs.reverse());
        }
        getUserFiles();
        setModalOpen(true)
    }


    function onSubmitButtonClicked(){
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      let printData = {
        name: printName,
        description: printDescription,
        selectedFile: selectedFile,
        purpose: userPrintPurpose,
        printPurpose: printPurpose,
        classFor: classFor,
        teacherOfClass: teacherOfClass,
        material: printMaterial,
        location: printLocation,
        fileID: selectedFileID,
        userID: auth.currentUser.uid,
        userDisplayName: auth.currentUser.displayName,
      }
      if (
        printName &&
        printDescription &&
        userPrintPurpose &&
        printPurpose &&
        printMaterial &&
        printLocation &&
        selectedFileID &&
        auth.currentUser.uid &&
        auth.currentUser.displayName
      ) {
        submitPrintData();
        alert("Print submitted successfully!")
      } else {
        console.error("One or more values in printData are null");
        alert("You are missing a required value in the form. Please fill out all fields and try again.");
        return;
      }
      async function submitPrintData() {
        try {
          const db = getFirestore(firebaseApp);
          const ref = doc(db, "categories", printLocation)
          const docRef = await addDoc(collection(ref, 'prints'), {...printData, timestamp: serverTimestamp()});
          console.log("Print data submitted successfully with ID: ", docRef.id);
          // Add any additional logic or UI updates after successful submission
        } catch (error) {
          console.error("Error submitting print data: ", error);
          // Handle the error or display an error message to the user
        }
      }

    }

    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Submit a New Print</h1>
            <div className={styles.popout} style={{textAlign:"left", marginBottom:"10vh"}}>
              <Button variant="contained" color="primary" onClick={onOpenButtonClicked}>Select a File</Button>
              <p>{selectedFile} {selectedFile?"selected":""}</p>
              <TextField label="Print Name" variant="outlined" value={printName} onChange={(e)=>{setPrintName(e.target.value)}} style={{width: "50%", minWidth:"40px"}}/>
              <br/><br/>
              <TextField label="Print Description" variant="outlined" multiline style={{width: "50%", minWidth:"40px"}} value={printDescription} onChange={(e)=>{setPrintDescription(e.target.value)}}/>
              <br/><br/>
              <p>Why are you printing this?</p>
              <TextField label="Purpose" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={userPrintPurpose} onChange={(e)=>{setUserPrintPurpose(e.target.value)}}/>
              <p>This is for...</p>
              <Select label="Select One" variant="outlined" style={{width: "25%", minWidth:"40px"}} value={printPurpose} onChange={(e)=>{setPrintPurpose(e.target.value)}}>
                <MenuItem value="school">This is for a SCHOOL PROJECT</MenuItem>
                <MenuItem value="personal">This is for a PERSONAL PROJECT</MenuItem>
              </Select>
              {modalOpen?
                <Modal open={modalOpen} onClose={()=>{setModalOpen(false)}}>
                    <Box sx={{width: "80%", backgroundColor:"rgba(91,91,91,0.8)", margin:"auto", padding:"2px", marginTop:"5vh"}}>
                        <h1>Select Your File</h1>
                        {files?files:<LinearProgress />}
                        <Button variant="contained" component={Link} to="/file/new">Add a new file</Button>
                    </Box>
                </Modal>
              :null}

              {printPurpose=="school"?
              <>
              <p>What class is this for?</p>
              <TextField label="Class" variant="outlined" style={{width: "25%", minWidth:"40px"}} value={classFor} onChange={(e)=> {setClassFor(e.target.value)}}/>
              <p>What teacher teaches your class?</p>
              <TextField label="Teacher" variant="outlined" style={{width: "25%", minWidth:"40px"}} value={teacherOfClass} onChange={(e)=> {setTeacherOfClass(e.target.value)}}/>
              </>
              :null}

              <br/><br/>
              <p>Print Material:</p>
              <Select label="Select Material" variant="outlined" style={{width: "25%", minWidth:"40px"}} value={printMaterial} onChange={(e)=>{setPrintMaterial(e.target.value)}}>
                <MenuItem value="pla">PLA</MenuItem>
                <MenuItem value="tpu">TPU</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <br/><br/>
              <p>Select Printer Category:</p>
              <Select label="Select Printer Category" variant="outlined" style={{width: "25%", minWidth:"40px"}} value={printLocation} onChange={(e)=>{setPrintLocation(e.target.value)}}>
                {categories?categories:<MenuItem value="loading">Loading...</MenuItem>}
              </Select>
              <Button sx={{textTransform:"capitalize"}}>What does this mean? <NorthEastIcon/></Button>
              <br/><br/>
              <Button variant="contained" color="primary" onClick={onSubmitButtonClicked}>Submit</Button>
            </div>
          </div>
        </>
      )
};

export default NewPrintPage;