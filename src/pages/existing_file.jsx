import { Button, IconButton, LinearProgress, Select, TextField } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import { Link, Navigate, useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { getFirestore, getDoc, doc, deleteDoc } from "firebase/firestore";
import {getStorage, ref, getDownloadURL, deleteObject } from "firebase/storage"
import { StlViewer } from "react-stl-viewer";
import ConfirmModal from "../../components/confirmModal.jsx";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"

export default function ExistingFilePage(props){
    const iconButtonStyles = {width:"1.7em", height:"auto"}
    const db = getFirestore(firebaseApp);
    const storage = getStorage(firebaseApp);
    const functions = getFunctions(firebaseApp);
    const navigate = useNavigate();
    let [docData, setDocData] = useState(null);
    let [stlURL, setSTLURL] = useState();
    let [confirmModal, setConfirmModal] = useState(null);
    let [higherAccess, setAccess] = useState(false);

    // REMOVE BELOW IN PRODUCTION
    connectFunctionsEmulator(functions, "localhost", 5001);
    // --------

    useEffect(()=> {
      let pathsArr = window.location.pathname.split("/");
      var filename = pathsArr[pathsArr.length-1];
      if(filename.length < 1){filename=pathsArr[pathsArr.length-2]} //if empty file path, check second...
      async function getDocument(){
        let docReference = doc(db, "files", filename);
        let result = await getDoc(docReference);
        console.log(result)
        if(result.exists()){
          let docdata = result.data();
          let date = new Date(docdata.date);
          setDocData({...docdata, date: date.toLocaleDateString() + " " + date.toLocaleTimeString()});
          console.log("document")
        }

        getDownloadURL(ref(storage, result.data().filename)).then((url)=> {
          setSTLURL(url);
          console.log(url);
        }).catch((err)=> {
          alert("something went wrong")
        })
      }

      getDocument();

      async function checkAccess(){
        const auth = getAuth(firebaseApp);
        let tokenResult = await auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          console.log(idTokenResult.claims.role)
            setAccess(idTokenResult.claims.role == "admin")
        }).catch(err=> {navigate("/403")});
      }
      checkAccess();
    }, [])

    function deleteDocumentButton(){
      setConfirmModal(
        <ConfirmModal
          message="Are you sure you want to delete this file? This action is irreversible."
          onConfirm={()=> {
            deleteDocument();
          }}
          onClose={()=> {
            setConfirmModal(null);
          }}
        />
      )
    }

    function deleteDocument(){
      let pathsArr = window.location.pathname.split("/");
      var filename = pathsArr[pathsArr.length-1];
      if(filename.length < 1){filename=pathsArr[pathsArr.length-2]}
      deleteObject(ref(storage, filename)).then(async ()=> {
        await deleteDoc(doc(db, "files", filename));
        let params = new URLSearchParams(window.location.search);
        if(params.get("admin")=="true"){
          navigate("/admin/fileviewer");
        }else{
          navigate("/file");
        }
      }).catch((err)=> {
        alert("something went wrong")
      })
    }

    function printDocument(){
      let pathsArr = window.location.pathname.split("/");
      var filename = pathsArr[pathsArr.length-1];
      if(filename.length < 1){filename=pathsArr[pathsArr.length-2]}
      console.log(filename);
      let docReference = doc(db, "files", filename);
      navigate("/print?file=" + docReference.id+"&name="+encodeURIComponent(docData.name));
    }

    return (
        <>
          <Navbar/>
          {confirmModal}
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            {docData?<>
            <h1>{docData.name}</h1>
            <div className={styles.popout}>
                <div style={{textAlign:"left", display: "flex", flexDirection: "row", justifyContent:"center"}}>

                <div className={styles.leftHalfScreen}>
                    <p>{(higherAccess && (getAuth(firebaseApp).currentUser.displayName != docData.userName))?"User: " + docData.userName:""}</p>
                    <p>{docData.desc}</p>
                    <p>{"Uploaded On: " + docData.date}</p>
                    <div style={{display: "flex", flexDirection:"row", justifyContent:"space-evenly"}}>
                      <a href={stlURL} download={docData.name+".stl"}>
                      <IconButton>
                        <DownloadIcon sx={iconButtonStyles}/>
                      </IconButton>
                      </a>

                      <IconButton onClick={printDocument}>
                        <PrintIcon sx={iconButtonStyles}/>
                      </IconButton>
                      
                      {
                        docData.userID == getAuth(firebaseApp).currentUser.uid || higherAccess?
                        <>
                      <IconButton onClick={deleteDocumentButton}>
                        <DeleteIcon sx={iconButtonStyles}/>
                      </IconButton>
                      
                      <IconButton component={Link} to={"/file/"+(window.location.pathname.split("/").slice(-1))+"/edit"}>
                        <EditIcon sx={iconButtonStyles}/>
                      </IconButton>
                      </>
                      :null}
                    </div>

                </div>
                <div className={styles.rightHalfScreen} style={{backgroundColor: "#FAFAFA"}}>
                  {stlURL!= null?
                    <StlViewer orbitControls url={stlURL} style={{height: "30vh"}}/>
                    :null
                  }
                  <p><i>Pro Tip: Click and drag the model around to preview!</i></p>
                    
                </div>
                </div>
            
            </div>
            </>
            :
            <LinearProgress/>
          }
          </div>
        </>
      )
}