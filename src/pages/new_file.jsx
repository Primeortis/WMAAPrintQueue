import { Button, Select, TextField } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import { Link } from "react-router-dom";
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, updateProfile} from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StlViewer } from "react-stl-viewer";


export default function NewFilePage(props){
    const navigate = useNavigate();
    var [isEditingFile, setEditingFile] = useState("new");
    var [documentStlUrl, setDocStlUrl] = useState(null);
    var [files, setFiles] = useState(null);
    let [uploadStatus, setUploadStatus] = useState("");
    let [name, setDocName] = useState("");
    let [desc, setDocDesc] = useState("");
    
    const storage = getStorage(firebaseApp);
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const fieldStyles = {width:"30vw" , margin:"5px"};

    useEffect(()=> {
      let urlpaths = window.location.pathname.split("/");
      if(urlpaths[urlpaths.length-1] == "edit"){
        async function getDocument(){
          setEditingFile("loading");
          let document = await getDoc(doc(db, "files", urlpaths[urlpaths.length-2]));
          if(document.exists()){
            let data = document.data();
            setDocName(data.name);
            setDocDesc(data.desc);
            
            getDownloadURL(ref(storage, data.filename)).then((url)=> {
              setDocStlUrl(url);
            })
          }
        }
        getDocument();
        setEditingFile("edit");
      }
    }, [])
    function uploadFileButton(){
      if(isEditingFile == "new"){
        uploadFile();
      } else {
        updateFile();
      }
    }

    async function updateFile(){
      let urlpaths = window.location.pathname.split("/");

      await updateDoc(doc(db, "files", urlpaths[urlpaths.length-2]), {
        name: name,
        desc: desc,
      })
      setUploadStatus("Successfully Edited...redirecting");
      navigate("/file/"+urlpaths[urlpaths.length-2])
    }

    function uploadFile(){
      let date = new Date();
      let filename = date.toISOString() + "!!" + auth.currentUser.uid + ".stl";
      setUploadStatus("Starting File Upload...")
      uploadBytes(ref(storage, filename), files).then(async (snapshot)=> {
        console.log("complete");
        console.log(snapshot)
        setUploadStatus("File Upload Complete...Adding Metadata")
        await setDoc(doc(db, "files", filename), {
          name: name,
          desc: desc,
          date: date.toISOString(),
          filename: filename,
          userID: auth.currentUser.uid,
          userName: auth.currentUser.displayName
        })
        setUploadStatus("Successfully Uploaded!")
        navigate("/file/"+filename);
      })
    }

    function handleChange(event){
      setFiles(event.target.files[0]);
      console.log(event.target.files[0]);
    }


    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>{isEditingFile=="new"?"Create A File":"Currently Editing " + name}</h1>
            <div className={styles.popout}>
                <div style={{textAlign:"left", display: "flex", flexDirection: "row", justifyContent:"center"}}>

                
                <div className={styles.leftHalfScreen}>
                    <TextField label="File Name" variant="outlined" sx={fieldStyles} onChange={(e)=>{setDocName(e.target.value)}} value={name}/>
                    <TextField label="File Description" variant="outlined" sx={fieldStyles} multiline onChange={(e)=>{setDocDesc(e.target.value)}} value={desc}/>
                    <Button>Clear All</Button>
                </div>
                <div className={styles.rightHalfScreen}>
                    {!documentStlUrl?
                    <div style={{backgroundColor:"#DADADA", cursor:"pointer", height:"60%"}}>
                        <p onClick={uploadFile}>Click to select your file, or drag it into this rectangle</p>
                        <input type="file" onChange={handleChange} accept=".stl"></input>
                    </div>
                    :
                    <>
                    <StlViewer orbitControls url={documentStlUrl} style={{height: "30vh"}}/>
                    </>
                    }
                </div>
                </div>
                <Button variant="contained" component={Link} to={"/file"} sx={{marginRight:"10px"}}>Back</Button>
                <Button variant="contained" onClick={uploadFileButton}>{isEditingFile=="new"? "Upload": "Update"}</Button>
                <p>{uploadStatus}</p>
            </div>
          </div>
        </>
      )
}