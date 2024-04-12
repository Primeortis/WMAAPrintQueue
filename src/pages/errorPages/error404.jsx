import Navbar from "../../../components/navbar/nav";
import styles from "../../pagestyles.module.css"
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Error404Page(){
    return(
    <>
        <Navbar/>
        <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>404: OOPS</h1>
            <div className={styles.popout} style={{textAlign:'auto'}}>
                <p>That doesn't exist</p>
                <p>Why did you do that?</p>
                <p>Definitely can't be a bug from amateur programmers!</p>
                <Button variant="contained" component={Link} to="/profile" style={{margin:".5em"}}>Go to Profile</Button>
                <Button variant="contained" component={Link} to="/file" style={{margin:".5em"}}>Go to Files</Button>
            </div>
        </div>
    </>
    )
}