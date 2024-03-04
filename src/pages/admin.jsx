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
            
        </>
    )
}