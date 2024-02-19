import { Button, Select, TextField } from "@mui/material";
import Navbar from "../../components/navbar/nav";
import styles from "../pagestyles.module.css"
import { Link } from "react-router-dom";




export default function NewFilePage(props){
    const fieldStyles = {width:"30vw" , margin:"5px"};
    return (
        <>
          <Navbar admin={true}/>
          <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Create A File</h1>
            <div className={styles.popout}>
                <div style={{textAlign:"left", display: "flex", flexDirection: "row", justifyContent:"center"}}>

                
                <div className={styles.leftHalfScreen}>
                    <TextField label="File Name" variant="outlined" sx={fieldStyles}/>
                    <TextField label="File Description" variant="outlined" sx={fieldStyles} multiline/>
                    <Button>Clear All</Button>
                </div>
                <div className={styles.rightHalfScreen}>
                    <div style={{backgroundColor:"#DADADA", cursor:"pointer", height:"60%"}}>
                        <p>Select Your File</p>
                    </div>
                </div>
                </div>
                <Button variant="contained" component={Link} to={"/file"} sx={{marginRight:"10px"}}>Back</Button>
                <Button variant="contained">Upload</Button>
            </div>
          </div>
        </>
      )
}