import { Button, Alert } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import Parent from "../../components/basic/parent";
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence} from "firebase/auth"
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

export default function AuthPage(props){
    const navigate = useNavigate();
    let [error, setError] = useState(false);
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    const functions = getFunctions(firebaseApp);

    // REMOVE BELOW IN PRODUCTION
    connectFunctionsEmulator(functions, "localhost", 5001);
    // --------

    function onButtonClicked(){
        setPersistence(auth, browserLocalPersistence).then(()=> {
            return signInWithPopup(auth, provider).then((result)=> {
                let user = result.user; // TODO: add error handling for those not in WMAA email
                let params = new URLSearchParams(window.location.search);
                let customClaims = user.getIdTokenResult().then((idTokenResult)=> {
                    if(idTokenResult.claims.role){ 
                        if(params.get("rd")&&params.get("rd")!="/auth"){navigate(params.get("rd"))}else{navigate("/file")}
                    } else {
                        navigate("/newuserlanding");
                    }
                })
                
            }).catch((error)=> {
                if(error.code == "auth/user-disabled"){
                    navigate("/paused");
                    return;
                }
                let errorMessage = error.message;
                setError(errorMessage + error.code);
                setTimeout(()=> {
                    setError(false);
                },10000);
            })
        }).catch((error)=> {
            alert("something went wrong")
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