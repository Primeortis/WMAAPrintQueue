import { Button } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth, signOut} from "firebase/auth"

export default function AdminPage(props){
    return (
        <>
            <Navbar admin={true}/>
            
        </>
    )
}