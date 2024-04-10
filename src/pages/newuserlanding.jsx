import Parent from "../../components/basic/parent";
import {Button, LinearProgress} from "@mui/material"
import {firebaseApp} from "../firebase-config.js"
import {getAuth, signOut} from "firebase/auth"
import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"

export default function NewUserLandingPage(props){
    let [unauthorized, setUnauthorized] = useState(false);
    let [username, setUsername] = useState("");
    let [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    useEffect(()=> {
        const auth = getAuth(firebaseApp);
        const functions = getFunctions(firebaseApp);
        
        let role = null;
        try {
            auth.currentUser.getIdTokenResult().then((idTokenResult) => {
                if(!idTokenResult.claims.role) role=idTokenResult.claims.role;
              }).catch((err)=> {
                console.error(err)
              })
              setUsername(auth.currentUser.displayName)
        } catch (e){
            navigate("/auth")
            console.log(e);
        }
          if(role){
              navigate("/profile");
          }
    }, [])

    function setRoleButton(){
        setLoading(true)
        const auth = getAuth(firebaseApp);
        const functions = getFunctions(firebaseApp);
        const setRole = httpsCallable(functions, "upgradeUser");
        setRole().then((result)=> {
            if(!result.error){
                navigate("/profile?new=1");
            } else {
                if(result.message == "Unauthorized"){
                    setUnauthorized(true);
                    signOut(auth).then(()=> {
                        setLoading(false);
                        setTimeout(()=>navigate("/auth"), 10000);
                    }).catch((e)=> {
                        console.error(e);
                        setLoading(false);
                    })
                }
            }
            
        }).catch((e)=> {
            console.error(e)
        })
    }

    return (
        <Parent>
            <h1 style={{color:"black"}}>Welcome!</h1>
            <div style={{backgroundColor:"#FAFAFA", width:"40%", margin:"auto", borderRadius:"10px", paddingBottom:"10px"}}>
                <br/>
                <p style={{color:"black", fontSize:"1em"}}>Hey {username}! Thanks for trying us out! Here's a bit of information to get you started.</p>
                <h1>HYPE TUTORIAL HERE</h1>
                <Button variant="contained" color="primary" style={{margin:"10px"}} onClick={setRoleButton}>Get Started</Button>
                {loading?<LinearProgress/>:null}
                <p style={{color:"black"}}><i>Questions? Contact your system administrator</i></p>
                {unauthorized?<>
                <p><em>Something went wrong activating your account, please ensure you are using a WMAA email address and are authorized to use this system.</em></p>
                </>:null}
            </div>
        </Parent>
    )
}