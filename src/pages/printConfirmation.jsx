import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css";
import {firebaseApp} from "../../src/firebase-config.js";
import {getAuth, signOut} from "firebase/auth";
import { useEffect, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';


export default function PrintConfirmed(props){
    let [userRole, setUserRole] = useState("");
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);
   
    

    useEffect(()=> {
      if(!auth.currentUser) navigate("/auth");
      auth.currentUser.getIdTokenResult().then((idTokenResult) => {
        setUserRole(idTokenResult.claims.role);
      }).catch((err)=> {
        console.error(err)
      })

      
    }, [])

    let userInformation = auth.currentUser;
    
    
    

    return (
        <>
            <Navbar admin={true} />
            <div className={styles.body} style={{ paddingTop: "10vh" }}>
                <h1>Success!</h1>
                <div className={styles.popout} style={{ textAlign: "left", width: "80%", margin: "auto" }}>
                    <div style={{ margin: "auto", width: "fit-content" }}>
                        <CheckIcon style={{width:"5vw", height:"5vw", color:"green"}}/>
                    </div>
                    <div style={{textAlign:"center"}}>
                        <p>Your print has been successfully submitted.</p>
                        
                    </div>
                    
                </div>
            </div>
        </>
    );
}