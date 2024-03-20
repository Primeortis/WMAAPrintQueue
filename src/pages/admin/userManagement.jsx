import { Button, LinearProgress, TextField } from "@mui/material";
import Navbar from "../../../components/navbar/nav.jsx";
import styles from "../../pagestyles.module.css";
import {firebaseApp} from "../../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { useState } from "react";

export default function UserManagementPage(props){
    let [userInformation, setUserInformation] = useState({});
    let [userIDOrEmail, setUserIDOrEmail] = useState("");
    let [loadingInformation, setLoadingInformation] = useState(false);
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);
    const functions = getFunctions(firebaseApp);

    // REMOVE BELOW IN PRODUCTION
    connectFunctionsEmulator(functions, "localhost", 5001);
    // --------

    let emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");

    function getUserInformation(){
        setLoadingInformation(true)
        setUserIDOrEmail(userIDOrEmail.trim());
        if(emailRegex.test(userIDOrEmail)){
            let getUser = httpsCallable(functions, "getuserinformation");
            getUser({email: userIDOrEmail}).then((result)=>{
                setUserInformation(result.data.result);
                console.log(result.data.result)
                setLoadingInformation(false)
            }).catch((error)=>{
                console.error(error);
            })
        } else {
            let getUser = httpsCallable(functions, "getuserinformation");
            getUser({uid: userIDOrEmail}).then((result)=>{
                setUserInformation(result.data.result);
                console.log(result.data.result)
                setLoadingInformation(false)
            }).catch((error)=>{
                console.error(error);
            })
        }
        
    }
    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Manage User</h1>
                <div className={styles.popout}>
                    <p>Input user to edit permissions</p>
                    <TextField label="User UID or Email" variant="outlined" fullWidth value={userIDOrEmail} onChange={(e)=>setUserIDOrEmail(e.target.value)}/>
                    <Button variant="contained" onClick={getUserInformation}>Get User Information</Button>
                    {loadingInformation?<LinearProgress/>:null}
                    <br/>
                    {userInformation.displayName?
                        <>
                        <p>Display Name: {userInformation.displayName}</p>
                        <p>Paused? {userInformation.disabled.toString()}</p>
                        <p>Email: {userInformation.email}</p>
                        <p>Role: {userInformation.role}</p>
                        <p>Last Signed In At: {userInformation.lastSignIn}</p>
                        </>
                    :<p>Enter a search query above...</p>}
                </div>
            </div>
        </>
    )
}