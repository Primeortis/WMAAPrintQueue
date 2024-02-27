import { Button, Alert } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import Parent from "../../components/basic/parent";
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"

export default function AuthPage(props){
    const navigate = useNavigate();
    let [error, setError] = useState(false);
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    function onButtonClicked(){
        signInWithPopup(auth, provider).then((result)=> {
            let user = result.user;
            navigate("/")
        }).catch((error)=> {
            let errorMessage = error.message;
            setError(errorMessage);
            setTimeout(()=> {
                setError(false);
            },10000);
        })
    }
    return (
        <Parent>
            <h1 style={{color:"black"}}>Welcome</h1>
            <div style={{backgroundColor:"#FAFAFA", width:"40%", margin:"auto", borderRadius:"10px", paddingBottom:"10px"}}>
                <br/>
                {error?<Alert severity="error" sx={{width:"60%", margin:"auto"}}>Something went wrong during authentication, please try again. {error}</Alert>:null}
                <img src="/wmaa.png"/><br/>
                <Button onClick={onButtonClicked} sx={{backgroundColor:"#f0f0f0", borderRadius:"60px"}}><img style={{width:"2.5em", paddingRight:"2em"}} src="/google.png"/><span style={{paddingRight:"2em"}}>Sign In</span></Button>
                <p style={{color:"black", fontSize:"1em"}}><i>Be sure to use your WMAA email for authentication</i></p>
            </div>
        </Parent>
    )
}