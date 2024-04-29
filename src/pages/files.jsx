import { Button, LinearProgress, Alert } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { getFirestore, collection, getDocs, where, query } from "firebase/firestore";
import File from "../../components/file";
import { useNavigate } from "react-router-dom"

export default function FilesPage(props){
  const auth = getAuth(firebaseApp);
  let navigate = useNavigate();
  let [files, setFiles] = useState([]);
  let [feedback, setFeedback] = useState(null);
    useEffect(()=> {
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      const q = query(collection(db, "files"), where("userID", "==", auth.currentUser.uid))
      async function getUserFiles(){
        try {
          var querySnapshot = await getDocs(q);
        } catch (e){
          console.error(e);
          setFiles([""])
          setFeedback(<Alert severity="error">An error occurred while trying to fetch your files. Please try again later.</Alert>)
          return;
        }
        
        console.log(querySnapshot);
        let docs = [];
        if(querySnapshot.docs.length == 0){navigate("/file/new");}
        querySnapshot.forEach((doc)=> {
          let data = doc.data();
          docs.push(<File id={doc.id} name={data.name} date={data.date} key={doc.id}/>);
        })
        if(docs.length==0) navigate("/file/new");
        setFiles(docs.reverse());
      }
      if(files.length==0) getUserFiles();
    }, [])
    let user = auth.currentUser;
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Hello {user?user.displayName:null}!</h1>
            <h2>Your Files</h2>
            <div className={styles.popout} style={{textAlign:"left"}}>
              {files.length>0?files:<LinearProgress />}
              <br/>
              <Button variant={"contained"} sx={{display:"block", margin:"auto", width: "fit-content"}} component={Link} to={"/file/new"}>Create New File</Button>
              <br/>
            </div>
          </div>
        </>
      )
}