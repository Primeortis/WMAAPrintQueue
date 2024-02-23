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
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Hello Bryson!</h1>
            <div className={styles.popout} style={{textAlign:"left"}}>
              <p>Email: email@email.com</p>
              <p>User ID: sldkfjwoeiurjsdjflwlskdjflsdfkj (Click to Copy)</p>
              <p>Status: Administrator</p>
              <Button variant="contained" onClick={signOutButton}>Sign Out</Button>
            </div>
          </div>
        </>
      )
}