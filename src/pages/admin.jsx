import { Button } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, signOut} from "firebase/auth"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminPage(props){
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(()=> {
        //Boot User if they aren't allowed
        async function checkAdmin(){
            let tokenResult = await auth.currentUser.getIdTokenResult().then((idTokenResult) => {
                if(idTokenResult.claims.role != "admin"){ 
                    navigate("/403");
                }
            });
        }
        checkAdmin();
    }, []);

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
                    <Button variant="contained" component={Link} to="/classroom" style={{margin:".5em"}}>Go to Classroom Page</Button>
                    <Button variant="contained" component={Link} to="/admin/authorize" style={{margin:".5em"}}>Authorize Additional Users</Button>
                </div>
            </div>
        </>
    )
}