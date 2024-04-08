import Navbar from "../../components/navbar/nav"
import styles from "../pagestyles.module.css"
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { useState, useEffect } from "react";
import { getFirestore, getDocs, collection, doc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase-config";
import BuildIcon from '@mui/icons-material/Build';
import { IconButton,Modal,Box, TextField, Button } from "@mui/material";

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
    let [msg, setMsg] = useState("")
    let [statusCode, setStatusCode] = useState(props.statusCode)

    function getTimeDifference(futureTimestamp) {
        const currentTime = new Date();
        const futureTime = new Date(futureTimestamp);
    
        const differenceInMilliseconds = futureTime - currentTime;
        if (differenceInMilliseconds < 0) {
            return "The future timestamp is in the past";
        }
    
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        //const differenceInDays = Math.floor(differenceInHours / 24); // Shouldn't be used? evaluate parameters of project... probably just use 24+ hours
    
        return `${differenceInHours % 24} hours, ${differenceInMinutes % 60} minutes, and ${differenceInSeconds % 60} seconds remaining`;
    }

    setInterval(()=> {
        if(statusCode == "printing"){
            let timeString = getTimeDifference(props.timeToDone);
            if(timeString == "The future timestamp is in the past"){
                setStatusCode("wait");
                return;
            } else {
                setMsg("Currently Printing\n"+timeString);
            }
        }
    
    }, 1000)

    
    useEffect(()=> {
        if(props.statusCode == "printing"){
            let timeString = getTimeDifference(props.timeToDone);
            if(timeString == "The future timestamp is in the past"){
                statusCode = "wait";
            } else {
                statusCode = "printing";
                setMsg("Currently Printing\n"+timeString);
            }
        }
        if(statusCode == "wait"){
            setMsg("Awaiting Print Removal Confirmation")
        } else if(statusCode == "good"){
            setMsg("Ready to Print");
        } else if(statusCode == "no service"){
            setMsg("Out of Service")
        }
    }, [msg, statusCode])
        
    
    return (
        <div className={styles.rows}>
            <p className={styles.emP}>{props.printer}</p>
            <p>
                <StatusIcon status={statusCode}/>
                <i>{msg}</i>
            </p>
            <IconButton onClick={()=> {props.onButtonClick(props.printer)}}>
                <BuildIcon/>
            </IconButton>
        </div>
    )
}

export default function PrinterStatus(props){
    let [printers, setPrinters] = useState([]);
    let [maintenanceModalOpen, setMaintenanceModalOpen] = useState("false");
    let [maintenanceLogs, setMaintenanceLogs] = useState([]);
    let [newMaintenanceMsg, setNewMaintenanceMsg] = useState("");
    
    useEffect(()=> {
        const db = getFirestore(firebaseApp);
        async function getPrinterStatuses(){
            const q = collection(db, "printers");
            let querySnapshot = await getDocs(q);
            let docs = [];
            querySnapshot.forEach((doc)=> {
                let data = doc.data();
                docs.push(<PrinterRow printer={doc.id} statusCode={data.status} key={doc.id} timeToDone={data.timeToDone} onButtonClick={getMaintenanceLogs}/>)
            })
            setPrinters(docs);
        }
        if(printers.length==0) getPrinterStatuses();
    }, [])

    function getMaintenanceLogs(printer){
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "printers", printer);
        const q = collection(ref, "maintenance");
        async function getDocuments(){
            let querySnapshot = await getDocs(q);
            let docs = [];
            querySnapshot.forEach((doc)=> {
                let data = doc.data();
                let date = new Date(data.date)
                docs.push(<p key={data.date}>{data.user} {date.toLocaleDateString() + " " + date.toLocaleTimeString()}: {data.message}</p>)
            })
            console.log(docs)
            if(docs.length ==0){
                docs.push(<p key="none">No Maintenance Logs</p>)
            }
            setMaintenanceLogs(docs)
            setMaintenanceModalOpen(printer);
        }
        getDocuments();
    }

    function submitNewMaintenanceMessage(){
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "printers", maintenanceModalOpen);
        const q = collection(ref, "maintenance");
        let currentUser = getAuth().currentUser.email;
        currentUser = currentUser.split("@")[0];
        async function addDocument(user){
            await addDoc(q, {
                user: user,
                date: new Date().toISOString(),
                message: newMaintenanceMsg
            })
        }
        addDocument(currentUser);
        setMaintenanceLogs([...maintenanceLogs, <p key={new Date().toISOString()}>{currentUser} {new Date()}: {newMaintenanceMsg}</p>])
        setNewMaintenanceMsg("");
        setMaintenanceModalOpen(false);
    }

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"10vh"}}>
                <h1>Printer Status</h1>
                <div className={styles.popout} style={{textAlign:"left"}}>
                    {printers}
                </div>
            </div>
            {/*New Printer Modal*/}
            {maintenanceModalOpen?
                        <Modal open={maintenanceModalOpen!="false"} onClose={()=>{setMaintenanceModalOpen("false")}}>
                            <Box sx={{width: "80%", backgroundColor:"rgba(219,219,219,0.8)", margin:"auto", padding:"2px", marginTop:"5vh", color:"black"}}>
                                <h1>Maintenance Logs</h1>
                                {maintenanceLogs}
                                <TextField label="Add Maintenance Log Message" sx={{width: "90%"}} value={newMaintenanceMsg} onChange={(e)=>setNewMaintenanceMsg(e.target.value)}/>
                                <Button onClick={submitNewMaintenanceMessage}>Submit</Button>
                            </Box>
                        </Modal>
                    :null}
        </>
    )
}