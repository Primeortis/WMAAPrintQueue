import { Button } from "@mui/material";
import Navbar from "../../../components/navbar/nav.jsx";
import styles from "../../pagestyles.module.css";
import {firebaseApp} from "../../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { useNavigate } from "react-router-dom";
import {getFirestore, doc, setDoc} from "firebase/firestore";


export default function FileViewerPage(props){
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    let userInformation = auth.currentUser;

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Manage User</h1>
                <div className={styles.popout}>
                    <p>Input user to edit permissions</p>
                    
                </div>
            </div>
        </>
    )
}