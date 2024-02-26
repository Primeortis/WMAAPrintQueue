import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, signOut} from "firebase/auth"


export default function ProfilePage(props){
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);
    function signOutButton(){
        signOut(auth).then(()=> {
          navigate("/auth");
        }).catch((error) => {
          alert("There was an error signing you out. Try again.")
        })
    }

    let userInformation = auth.currentUser;
    console.log(userInformation);
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Hello {userInformation.displayName}!</h1>
            <div className={styles.popout} style={{textAlign:"left"}}>
              <p>Email: {userInformation.email}</p>
              <p>User ID: {userInformation.uid} (Click to Copy)</p>
              <p>Status: tbd</p>
              <Button variant="contained" onClick={signOutButton}>Sign Out</Button>
            </div>
          </div>
        </>
      )
}