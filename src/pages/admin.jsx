import { Button } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, signOut} from "firebase/auth"
import { Link } from "react-router-dom";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

export default function AdminPage(props){
    const functions = getFunctions(firebaseApp);
    const auth = getAuth(firebaseApp);

    // REMOVE BELOW IN PRODUCTION
    connectFunctionsEmulator(functions, "localhost", 5001);
    // --------

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Admin Control Panel</h1>
                <div className={styles.popout}>
                    <p>Choose your adventure</p>
                    <Button variant="contained" component={Link} to="/admin/usermanagement" style={{margin:".5em"}}>Edit Users</Button>
                    <Button variant="contained" component={Link} to="/admin/queuemanagement" style={{margin:".5em"}}>Rearrange Queue</Button>
                    <Button variant="contained" component={Link} to="/admin/fileviewer" style={{margin:".5em"}}>View All Files</Button>
                    <Button variant="contained" component={Link} to="/admin/printermanagement" style={{margin:".5em"}}>Manage Printers</Button>
                </div>
            </div>
        </>
    )
}