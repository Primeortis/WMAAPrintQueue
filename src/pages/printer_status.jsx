import Navbar from "../../components/navbar/nav"
import styles from "../pagestyles.module.css"
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { useState, useEffect } from "react";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";

// TODO: make printer gear spin at some point?
function StatusIcon(props){
    if(props.status == "printing"){
        return <SettingsIcon sx={{verticalAlign:"middle", marginRight:"5px", color: "#D90404"}}/>
    } else if(props.status == "wait"){
        return <PriorityHighIcon sx={{verticalAlign:"middle", marginRight:"5px", color: "#D90404"}}/>
    } else if(props.status == "good"){
        return <CheckIcon sx={{verticalAlign:"middle", marginRight:"5px", color: "#068701"}}/>
    } else if(props.status == "no service"){
        return <DoNotDisturbIcon sx={{verticalAlign:"middle", marginRight:"5px", color: "#D90404"}}/>
    }
}


function PrinterRow(props){
    let msg = "";
    if(props.statusCode == "printing"){
        msg = "Currently Printing"
    } else if(props.statusCode == "wait"){
        msg = "Awaiting Print Removal Confirmation"
    } else if(props.statusCode == "good"){
        msg = "Ready to Print"
    } else if(props.statusCode == "no service"){
        msg = "Out of Service"
    }
    return (
        <div className={styles.rows}>
            <p className={styles.emP}>{props.printer}</p>
            <p>
                <StatusIcon status={props.statusCode}/>
                <i>{msg}</i>
            </p>
        </div>
    )
}

export default function PrinterStatus(props){
    let [printers, setPrinters] = useState([]);

    useEffect(()=> {
        const db = getFirestore(firebaseApp);
        async function getPrinterStatuses(){
            const q = collection(db, "printers");
            let querySnapshot = await getDocs(q);
            let docs = [];
            querySnapshot.forEach((doc)=> {
                let data = doc.data();
                docs.push(<PrinterRow printer={doc.id} statusCode={data.status}/>)
            })
            setPrinters(docs);
        }
        if(printers.length==0) getPrinterStatuses();
    })
    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Hey Bryson! Good to see you.</h1>
            <div className={styles.popout} style={{textAlign:"left"}}>
                {printers}
            </div>
          </div>
        </>
    )
}