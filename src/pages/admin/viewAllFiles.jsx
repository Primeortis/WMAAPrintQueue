import { Button, LinearProgress } from "@mui/material";
import Navbar from "../../../components/navbar/nav";
import styles from "../../pagestyles.module.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {firebaseApp} from "../../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

function File(props){
  let date = new Date(props.date);

    return (
      <Link className={[styles.rows, styles.dimOnHover].join(" ")} style={{cursor:"pointer", color:"black"}} to={"/file/"+props.id}>
          <p className={styles.emP}>{props.username}: {props.name}</p>
          <p>
              <i>{date.toLocaleDateString()} {date.toLocaleTimeString()}</i>
          </p>
      </Link>
    )
}

export default function FileViewerPage(props){
    let [files, setFiles] = useState([]);
    useEffect(()=> {
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      const q = query(collection(db, "files"));
      async function getUserFiles(){
        var querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        let docs = [];
        querySnapshot.forEach((doc)=> {
          let data = doc.data();
          console.log(data)
          docs.push(<File id={doc.id} name={data.name} date={data.date} key={doc.id} username={data.userName}/>);
        })

        setFiles(docs.reverse());
      }
      if(files.length==0) getUserFiles();
    }, [])
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>All Files</h1>
            <div className={styles.popout} style={{textAlign:"left"}}>
              {files.length>0?files:<LinearProgress />}
            </div>
          </div>
        </>
      );
}