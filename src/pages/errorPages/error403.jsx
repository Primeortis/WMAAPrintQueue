import Navbar from "../../../components/navbar/nav";
import styles from "../../pagestyles.module.css"
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Error403Page(){
    return(
    <>
        <Navbar/>
        <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>OOPS</h1>
            <div className={styles.popout} style={{textAlign:'auto'}}>
                <p>You're not supposed to be there!</p>
                <Button variant="contained" component={Link} to="/profile" style={{margin:".5em"}}>Go to Profile</Button>
                <Button variant="contained" component={Link} to="/file" style={{margin:".5em"}}>Go to Files</Button>
            </div>
        </div>
    </>
    )
}