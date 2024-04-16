import { Button, LinearProgress, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Navbar from "../../../components/navbar/nav";
import styles from "../../pagestyles.module.css"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {firebaseApp} from "../../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { getFirestore, collection, getDocs, query, limit, where } from "firebase/firestore";

function File(props){
  let date = new Date(props.date);

    return (
      <Link className={[styles.rows, styles.dimOnHover].join(" ")} style={{cursor:"pointer", color:"black"}} to={"/file/"+props.id+"?admin=true"}>
          <p className={styles.emP}>{props.username}: {props.name}</p>
          <p>
              <i>{date.toLocaleDateString()} {date.toLocaleTimeString()}</i>
          </p>
      </Link>
    )
}

export default function FileViewerPage(props){
    let [files, setFiles] = useState([]);
    let [searchQuery, setSearchQuery] = useState("");
    let [searchType, setSearchType] = useState("name");
    let [startDate, setStartDate] = useState(null);
    let [endDate, setEndDate] = useState(null);
    let [showingQueryResults, setShowingQueryResults] = useState(false);
    let navigate = useNavigate();
    useEffect(()=> {
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      const q = query(collection(db, "files"), limit(50));
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
        
      //Boot User if they aren't allowed
      async function checkAdmin(){
          let tokenResult = await auth.currentUser.getIdTokenResult().then((idTokenResult) => {
            if(idTokenResult.claims.role != "admin"){ 
              navigate("/403");
              }else{
                  console.log("User is either admin or classroom: " + idTokenResult.claims.role);
              }
          });
      }
      checkAdmin();
    }, [])

    function searchFiles(){
      const db = getFirestore(firebaseApp);
      if(searchType != "date"){
        var q = query(collection(db, "files"), where(searchType, "==", searchQuery),limit(50));
      } else {
        if(startDate && endDate){
          var q = query(collection(db, "files"), where("date", ">=", startDate.toISOString()), where("date", "<=", endDate.toISOString()),limit(50));
        } else if(startDate){
          var q = query(collection(db, "files"), where("date", ">=", startDate.toISOString()),limit(50));
        } else {
          var q = query(collection(db, "files"), where("date", "<=", endDate.toISOString()),limit(50));
        }
      }
      
      async function getSearchedFiles(){
        var querySnapshot = await getDocs(q);
        let docs = [];
        querySnapshot.forEach((doc)=> {
          let data = doc.data();
          console.log(data)
          docs.push(<File id={doc.id} name={data.name} date={data.date} key={doc.id} username={data.userName}/>);
        }) 
        setFiles(docs.reverse());
        setShowingQueryResults(true);
      }
      getSearchedFiles();
    }
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>{showingQueryResults?"File Search Results": "All Files"}</h1>
            <div className={styles.popout} style={{textAlign:"left"}}>
              {searchType=="date"?
              <>
              <DatePicker label="Start Date" value={startDate} onChange={(val)=>setStartDate(val)}/>
              <DatePicker label="End Date" value={endDate} onChange={(val)=>setEndDate(val)}/>
              </>
              :<TextField label="Search" variant="outlined" fullWidth value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
              }
              <Button variant="contained" color="primary" onClick={searchFiles}>Search</Button>

              <Select label="Search Query" variant="outlined" value={searchType} onChange={e=>setSearchType(e.target.value)}>
                <MenuItem value="name">File Name</MenuItem>
                <MenuItem value="userName">User Name</MenuItem>
                <MenuItem value="userID">User ID</MenuItem>
                <MenuItem value="date">Date Created</MenuItem>
              </Select>
              {files.length>0?files:<LinearProgress />}
            </div>
          </div>
        </>
      );
}