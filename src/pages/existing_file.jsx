import { Button, IconButton, LinearProgress, Select, TextField } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import { Link } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { getFirestore, getDoc, doc } from "firebase/firestore";
import {getStorage, ref, getDownloadURL } from "firebase/storage"
import { StlViewer } from "react-stl-viewer";

export default function ExistingFilePage(props){
    const iconButtonStyles = {width:"1.7em", height:"auto"}
    const db = getFirestore(firebaseApp);
    const storage = getStorage(firebaseApp);
    let [docData, setDocData] = useState(null);
    let [stlURL, setSTLURL] = useState();
    useEffect(()=> {
      let pathsArr = window.location.pathname.split("/");
      var filename = pathsArr[pathsArr.length-1];
      async function getDocument(){
        let docReference = doc(db, "files", filename);
        let result = await getDoc(docReference);
        console.log(result)
        if(result.exists()){
          setDocData(result.data());
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

    }, [])
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            {docData?<>
            <h1>{docData.name}</h1>
            <div className={styles.popout}>
                <div style={{textAlign:"left", display: "flex", flexDirection: "row", justifyContent:"center"}}>

                <div className={styles.leftHalfScreen}>
                    <p>{docData.desc}</p>
                    <p>Class: Robotics, Automation, and Manufacturing</p>
                    <p>{docData.date}</p>
                    <div style={{display: "flex", flexDirection:"row", justifyContent:"space-evenly"}}>
                      <a href={stlURL} download={docData.name+".stl"}>
                      <IconButton>
                        <DownloadIcon sx={iconButtonStyles}/>
                      </IconButton>
                      </a>

                      <IconButton>
                        <PrintIcon sx={iconButtonStyles}/>
                      </IconButton>

                      <IconButton>
                        <DeleteIcon sx={iconButtonStyles}/>
                      </IconButton>

                      <IconButton component={Link} to={"/file/"+(window.location.pathname.split("/").slice(-1))+"/edit"}>
                        <EditIcon sx={iconButtonStyles}/>
                      </IconButton>
                    </div>

                </div>
                <div className={styles.rightHalfScreen} style={{backgroundColor: "#FAFAFA"}}>
                  {stlURL!= null?
                    <StlViewer orbitControls url={stlURL}/>
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