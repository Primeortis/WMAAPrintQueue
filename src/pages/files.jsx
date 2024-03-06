import { Button, LinearProgress } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { getFirestore, collection, getDocs, where, query } from "firebase/firestore";

function File(props){
  let date = new Date(props.date);

    return (
      <Link className={[styles.rows, styles.dimOnHover].join(" ")} style={{cursor:"pointer", color:"black"}} to={"/file/"+props.id}>
          <p className={styles.emP}>{props.name}</p>
          <p>
              <i>{date.toLocaleDateString()} {date.toLocaleTimeString()}</i>
          </p>
      </Link>
    )
}

export default function FilesPage(props){
  let [files, setFiles] = useState([]);
    useEffect(()=> {
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      const q = query(collection(db, "files"), where("userID", "==", auth.currentUser.uid))
      async function getUserFiles(){
        var querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        let docs = [];
        querySnapshot.forEach((doc)=> {
          let data = doc.data();
          docs.push(<File id={doc.id} name={data.name} date={data.date} key={doc.id}/>);
        })
        setFiles(docs);
      }
      if(files.length==0) getUserFiles();
    }, [])
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Your Files</h1>
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