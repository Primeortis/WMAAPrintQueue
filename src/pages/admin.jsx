import { Button } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, signOut} from "firebase/auth"
import { useNavigate } from "react-router-dom";

export default function AdminPage(props){
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    let userInformation = auth.currentUser;

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Admin Control Panel</h1>
                <div className={styles.popout}>
                    <p>Choose your adventure</p>
                    <Button variant="contained" onClick="Control Users" style={{margin:".5em"}}>Edit Users</Button>
                    <Button variant="contained" onClick="Edit Queue" style={{margin:".5em"}}>Rearrange Queue</Button>
                    <Button variant="contained" onClick="View All Files" style={{margin:".5em"}}>View All Files</Button>
                    <Button variant="contained" onClick="" style={{margin:".5em"}}>View all prints</Button>
                </div>
            </div>
        </>
    )
}