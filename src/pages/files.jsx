import { Button } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"


function File(props){
  return (
    <div className={[styles.rows, styles.dimOnHover].join(" ")} style={{cursor:"pointer"}}>
        <p className={styles.emP}>{props.name}</p>
        <p>
            <i>{props.date}</i>
        </p>
    </div>
  )
}

export default function FilesPage(props){
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Your Files</h1>
            <div className={styles.popout} style={{textAlign:"left"}}>
              <h2 align="center">Your Files</h2>
              <File name={"first print"} date={"Sat 11/4/2023 11:37PM"}/>
              <br/>
              <Button variant={"contained"} sx={{display:"block", margin:"auto"}}>Create New File</Button>
              <br/>
            </div>
          </div>
        </>
      )
}