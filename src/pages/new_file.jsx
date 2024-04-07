import { Alert, Button, Select, TextField } from "@mui/material";
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
    let [name, setDocName] = useState("");
    let [desc, setDocDesc] = useState("");
    let [info, setInfo] = useState(null);
    
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
      setInfo(null);
      let urlpaths = window.location.pathname.split("/");
      if(!files){
        setInfo(<Alert severity="error">Please select a file to upload</Alert>)
        return;
      }
      if(name.length < 5){
        setInfo(<Alert severity="error">Please add a longer file name</Alert>)
        return;
      }
      if(desc.length < 5){
        setInfo(<Alert severity="error">Please add a longer file description</Alert>)
        return;
      }
      if(files.size > 10 * 1024 * 1024){
        setInfo(<Alert severity="error">Your file is too large. Please pick a file under 10mb</Alert>)
        return;
      }
      if(files.name.slice(-4) !== ".stl"){
        setInfo(<Alert severity="error">Invalid File Type. Only STL files are accepted.</Alert>)
        return;
      }
      await updateDoc(doc(db, "files", urlpaths[urlpaths.length-2]), {
        name: name,
        desc: desc,
      })
      setInfo(<Alert severity="success">File Updated Successfully!</Alert>)
      navigate("/file/"+urlpaths[urlpaths.length-2])
    }

    function uploadFile(){
      if(!files){
        setInfo(<Alert severity="error">Please select a file to upload</Alert>)
        return;
      }
      if(name.length < 5){
        setInfo(<Alert severity="error">Please add a longer file name</Alert>)
        return;
      }
      if(desc.length < 5){
        setInfo(<Alert severity="error">Please add a longer file description</Alert>)
        return;
      }
      if(files.size > 10 * 1024 * 1024){
        setInfo(<Alert severity="error">Your file is too large. Please pick a file under 10mb</Alert>)
        return;
      }
      if(files.name.slice(-4) !== ".stl"){
        setInfo(<Alert severity="error">Invalid File Type. Only STL files are accepted.</Alert>)
        return;
      }
      let date = new Date();
      let filename = date.toISOString() + "!!" + auth.currentUser.uid + ".stl";
      setInfo(<Alert severity="info">Uploading File...</Alert>)
      if(!navigator.onLine){
        setInfo(<Alert severity="error">You are not connected to the internet. Please try again later.</Alert>)
        return;
      }
      uploadBytes(ref(storage, filename), files).then(async (snapshot)=> {
        console.log("complete");
        console.log(snapshot)
        setInfo(<Alert severity="success">File Upload Complete! One more moment and you'll be printing...</Alert>)
        await setDoc(doc(db, "files", filename), {
          name: name,
          desc: desc,
          date: date.toISOString(),
          filename: filename,
          userID: auth.currentUser.uid,
          userName: auth.currentUser.displayName
        })
        setInfo(<Alert severity="success">File Upload Complete!</Alert>)
        navigate("/file/"+filename);
      }).catch((e)=> {
        setInfo(<Alert severity="error">An error occured while uploading your file. Please try again later.</Alert>)
        console.error(e);
        return;
      })
    }

    function handleChange(event){
      if(event.target.files.length > 1) return;
      if (event.target.files[0].size > 10 * 1024 * 1024) { // check 10 megabytes
        alert("File size exceeds the limit of 10 megabytes.");
        setFiles("")
        return;
      }
      if (event.target.files[0].name.slice(-4) !== ".stl") { // Updated file type check to accept ".stl" files
        alert("Only STL files are accepted.");
        setFiles("");
        return;
      }
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
                        <p onClick={uploadFile}>Click to select your file. Only STL files are accepted up to 10 megabytes</p>
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
                {info}
            </div>
          </div>
        </>
      )
}