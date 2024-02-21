import { Button, IconButton, Select, TextField } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import { Link } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';

export default function ExistingFilePage(props){
    const iconButtonStyles = {width:"1.7em", height:"auto"}

    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>first print</h1>
            <div className={styles.popout}>
                <div style={{textAlign:"left", display: "flex", flexDirection: "row", justifyContent:"center"}}>

                <div className={styles.leftHalfScreen}>
                    <p>Top Project</p>
                    <p>Class: Robotics, Automation, and Manufacturing</p>
                    <p>Uploaded 1/2/2024 2:45pm</p>
                    <div style={{display: "flex", flexDirection:"row", justifyContent:"space-evenly"}}>
                      <IconButton >
                        <DownloadIcon sx={iconButtonStyles}/>
                      </IconButton>

                      <IconButton>
                        <PrintIcon sx={iconButtonStyles}/>
                      </IconButton>

                      <IconButton>
                        <DeleteIcon sx={iconButtonStyles}/>
                      </IconButton>

                      <IconButton>
                        <EditIcon sx={iconButtonStyles}/>
                      </IconButton>
                    </div>

                </div>
                <div className={styles.rightHalfScreen} style={{backgroundColor: "gray"}}>
                    <p>STL preview here</p>
                </div>
                </div>
                
            </div>
          </div>
        </>
      )
}