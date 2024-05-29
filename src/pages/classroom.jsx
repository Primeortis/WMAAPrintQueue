import {useState, useEffect} from 'react';
import styles from '../pagestyles.module.css';
import {getAuth} from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, query, orderBy, where, deleteDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase-config';
import { Button, IconButton, MenuItem, Select,Modal, Box, TextField, Alert } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ReplayIcon from '@mui/icons-material/Replay'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import BuildIcon from '@mui/icons-material/Build';


function QueueRow(props){
    let [expanded, setExpanded] = useState(false);
    let [stlURL, setSTLURL] = useState("");
    let [feedback, setFeedback] = useState(null);
    let [status, setStatus] = useState(props.data.status);
    let [advanceModalOpen, setAdvanceModalOpen] = useState(false);
    let [newPrinterState, setNewPrinterState] = useState("");
    let [pendingPrinterTimeField, setTimeField] = useState("00:00");
    const storage = getStorage(firebaseApp);
    const auth = getAuth(firebaseApp);
    useEffect(()=> {
        console.log("Use Effect Run");
        getDownloadURL(ref(storage, props.data.fileID)).then((url)=> {
            setSTLURL(url);
        }).catch((err)=> {
            setSTLURL("error")
            if(err.code == "storage/object-not-found"){
                setFeedback(<Alert severity="error">The file associated with this entry could not be found. The file may have been deleted by the author.</Alert>)
            } else {
                console.error(err)
                setFeedback(<Alert severity="error">An error occurred while trying to fetch the file. The file may have been deleted by the author.</Alert>)
            }
        })
    }, [])

    function advanceStatus(){
        if(status == "pending"){
            setAdvanceModalOpen(true)
        } else {
            let statuses = ["pending", "printing", "printed"];
            let currentStatus = statuses.indexOf(status);
            const db = getFirestore(firebaseApp);
            const ref = doc(db, "categories", props.category);
            const q = collection(ref, "prints");
            async function updateStatus(){ //update queue item
                await setDoc(doc(q, props.id), {status: statuses[currentStatus+1], currentPrint: null}, {merge: true});
            }
            updateStatus();
            setStatus(statuses[currentStatus+1])
        }
    }

    function submitPrintingStatus(){
        let statuses = ["pending", "printing", "printed"];
        let currentStatus = statuses.indexOf(status);
        console.log(currentStatus)
        let regex = new RegExp("^\\d{2}:\\d{2}$");
        if(!regex.test(pendingPrinterTimeField)){
            alert("Please enter a valid timestamp in the format hh:mm");
            return;
        }

        let time = pendingPrinterTimeField.split(":");
        let hours = parseInt(time[0]);
        let minutes = parseInt(time[1]);
        if(minutes <=0 || minutes >=60){
            alert("Invalid time format");
            return;
        }
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "categories", props.category);
        const q = collection(ref, "prints");
        async function updateStatus(){ //update queue item
            await setDoc(doc(q, props.id), {status: statuses[currentStatus+1]}, {merge: true});
            let currentTime = new Date();
            currentTime.setHours(currentTime.getHours() + hours);
            currentTime.setMinutes(currentTime.getMinutes() + minutes);
            console.log(newPrinterState)
            await setDoc(doc(collection(db, "printers"), newPrinterState), {status: "printing", timeToDone: currentTime.toISOString(), currentPrint: props.data.fileID}, {merge: true})
        }
        updateStatus();
        setStatus(statuses[currentStatus+1]);
        setAdvanceModalOpen(false);
    }


    function deleteEntry(){
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "categories", props.category);
        const q = collection(ref, "prints");
        async function deleteDocument(){
            await deleteDoc(doc(q, props.id));
        }
        deleteDocument();
        setFeedback(<Alert severity="success">The entry has been deleted. Click the view button above to refresh this feed.</Alert>)
    }

    if(props.data){
        let date = props.data.timestamp.toDate();
        let dateString = date.toDateString();
        let timeString = date.toLocaleTimeString();
        
        return (
            <>
            <div className={styles.rows}>
                <p className={styles.emP}>{props.data.userDisplayName}: {props.data.name}</p>
                <p>
                    <i>{props.data.purpose}</i>
                </p>
                <p>{props.data.printPurpose=="school"?<SchoolIcon/>:<PersonIcon/>}</p>
                <IconButton onClick={()=>setExpanded(!expanded)}>{expanded?<ExpandLessIcon/>:<ExpandMoreIcon/>}</IconButton>
            </div>
            <div style={{display: expanded?"inline":"none"}}>
                {feedback}
                <p>Print Name: {props.data.name}</p>
                <p>Material: {props.data.material}</p>
                <p>Description: {props.data.description}</p>
                <p>User: {props.data.userDisplayName} <i>{props.data.email}</i></p>
                <p>Purpose: {props.data.printPurpose}</p>
                {
                    props.data.printPurpose=="school"?
                    <>
                    <p>Class: {props.data.classFor}</p>
                    <p>Teacher: {props.data.teacherOfClass}</p>
                    </>
                    :null
                }
                <p>Timestamp: {dateString} {timeString}</p>
                <p>Elevated: {props.data.elevated?"✅":"❌"}</p>
                <p>Status: {status}</p>
                {status=="printed"?<p><i>It looks like this item has been printed successfully. If you click the view button above to refresh this feed, this entry will disappear.</i></p>:null}
                <a style={{cursor: stlURL!="error"?"pointer":"default"}} href={stlURL!="error"?stlURL:"javascript:function() { return false; }"} download={props.data.name+".stl"}><Button variant="contained" style={{cursor:stlURL!="error"?"pointer":"default"}} disabled={stlURL=="error"}>Download File</Button></a>
                <Button variant="contained" onClick={advanceStatus}>Advance Status</Button>
                {stlURL=="error"?<Button variant="contained" onClick={deleteEntry}>Delete Entry</Button>:null}

                {advanceModalOpen?
                <Modal open={advanceModalOpen} onClose={()=>{setAdvanceModalOpen(false)}}>
                <Box sx={{width: "80%", backgroundColor:"rgba(91,91,91,0.8)", margin:"auto", padding:"2px", marginTop:"5vh"}}>
                    <h1>Advance Print</h1>
                    <p>Select the printer this print will be sent to:</p>
                    <Select value={newPrinterState} onChange={(e)=>setNewPrinterState(e.target.value)}>
                        {props.printers.map((printer, index)=>{
                            if(printer.data.category == props.category){
                                return <MenuItem key={index} value={printer.id}>{printer.id}</MenuItem>
                            }
                        })}
                    </Select>
                    <p>Input time required for this print:</p>
                    <TextField label="Time to Print (hh:mm)" value={pendingPrinterTimeField} onChange={(e)=>setTimeField(e.target.value)}/>
                    <br/>
                    <Button variant="contained" onClick={submitPrintingStatus}>Save</Button>
                </Box>
                </Modal>
                :null}
            </div>
            </>
        )
    }
}


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
    let [statusCode, setStatusCode] = useState(props.statusCode);
    let [newPrinterStateModalOpen, setNewPrinterStateModalOpen] = useState(false);
    let [pendingPrinterTime, setPendingPrinterTime] = useState("00:00");
    let [pendingPrinterTimeMsg, setPendingPrinterTimeMsg] = useState("");
    let [newPrinterState, setNewPrinterState] = useState(props.statusCode);
    let [timeToDone, setTimeToDone] = useState(props.timeToDone);

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
            let timeString = getTimeDifference(timeToDone);
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
            let timeString = getTimeDifference(timeToDone);
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
    }, [msg, statusCode, timeToDone])

    function setTimeField(input){
        let regex = new RegExp("^\\d{2}:\\d{2}$");
        if(regex.test(input)==false){
            setPendingPrinterTimeMsg("Invalid Time Format - Follow the format hh:mm");
        } else if(!input.includes(":")){
            setPendingPrinterTimeMsg("Invalid Time Format - Include a colon between hours and minutes, even if hours is zero");
        } else {
            setPendingPrinterTimeMsg("");
        }
        setPendingPrinterTime(input);
    }

    function updatePrinterState(){
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "printers", props.printer);
        async function updateStateOnFirestore(){
            let regex = new RegExp("^\\d{2}:\\d{2}$");
            if(newPrinterState == "printing" && !regex.test(pendingPrinterTime)){
                console.log("stop")
                return;
            }
            try {
                if(newPrinterState == "printing"){
                    console.log(pendingPrinterTime)
                    let time = pendingPrinterTime.split(":");
                    let hours = parseInt(time[0]);
                    let minutes = parseInt(time[1]);
                    let currentTime = new Date();
                    currentTime.setHours(currentTime.getHours() + hours);
                    currentTime.setMinutes(currentTime.getMinutes() + minutes);
                    await setDoc(ref, {status: newPrinterState, timeToDone: currentTime.toISOString()}, {merge: true});
                    setTimeToDone(currentTime.toISOString());
                } else {
                    await setDoc(ref, {status: newPrinterState, timeToDone: "none"}, {merge: true});
                }
            } catch (e){
                console.error(e);
            }
        }
        updateStateOnFirestore();
        setStatusCode(newPrinterState);
        setNewPrinterStateModalOpen(false);
        
    }
    
    return (
        <>
        <div className={styles.rows}>
            <p className={styles.emP}>{props.printer}</p>
            <p onClick={()=>{setNewPrinterStateModalOpen(true)}} style={{cursor: "pointer"}}>
                <StatusIcon status={statusCode}/>
                <i>{msg}</i>
            </p>
            <IconButton onClick={()=> {props.onButtonClick(props.printer)}}>
                <BuildIcon/>
            </IconButton>
        </div>


        <Modal open={newPrinterStateModalOpen} onClose={()=>{setNewPrinterStateModalOpen(false)}}>
            <Box sx={{width: "80%", backgroundColor:"rgba(219,219,219,0.8)", margin:"auto", padding:"2px", marginTop:"5vh", color:"black"}}>
                <h1>Set New Printer State</h1>
                <p>{props.printer}</p>
                <Select value={newPrinterState} onChange={(e)=>setNewPrinterState(e.target.value)}>
                    <MenuItem value="printing">Printing</MenuItem>
                    <MenuItem value="wait">Awaiting Print Removal</MenuItem>
                    <MenuItem value="good">Ready to Print</MenuItem>
                    <MenuItem value="no service">Out of Service</MenuItem>
                </Select>
                {newPrinterState=="printing"?
                <>
                <br/>
                <br/>
                <TextField label="Time to Print (hh:mm)" value={pendingPrinterTime} onChange={(e)=>setTimeField(e.target.value)}/>
                {pendingPrinterTimeMsg}
                </>
                :
                null
                }
                <br/>
                <Button variant="contained" onClick={updatePrinterState}>Submit</Button>
            </Box>
        </Modal>
        </>
    )
}


const ClassroomPage = () => {
    let goto = encodeURIComponent(window.location.pathname);
    let [categories, setCategories] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState(""); 
    let [selectedMenu, setSelectedMenu] = useState("queue");
    let [queueItems, setQueueItems] = useState([]);
    let [printers, setPrinters] = useState([]);
    let [printerLastCheckedTime, setLastCheckedTime] = useState(new Date());
    let [maintenanceModalOpen, setMaintenanceModalOpen] = useState("false");
    let [maintenanceLogs, setMaintenanceLogs] = useState([]);
    let [newMaintenanceMsg, setNewMaintenanceMsg] = useState("");
    let [newPrinterStateModalOpen, setNewPrinterStateModalOpen] = useState(false);
    let [newPrinterState, setNewPrinterState] = useState("");
    let [pendingPrinterTime, setPendingPrinterTime] = useState("00:00");
    let [pendingPrinterTimeMsg, setPendingPrinterTimeMsg] = useState("");
    let [printerBeingEdited, setPrinterBeingEdited] = useState("");

    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    const db = getFirestore(firebaseApp);
    const ref = collection(db, "categories")

    async function getPrinterStatuses(){
        console.log("getting printers")
        const q = collection(db, "printers");
        let querySnapshot = await getDocs(q);
        let docs = [];
        querySnapshot.forEach((doc)=> {
            let data = doc.data();
            docs.push({id:doc.id, data:data});
            //docs.push(<PrinterRow printer={doc.id} statusCode={data.status} timeToDone={data.timeToDone} key={doc.id} onStatusUpdate={(state)=>{setPrinterBeingEdited(state.name);setNewPrinterState(state.statusCode);setNewPrinterStateModalOpen(true);}} onButtonClick={getMaintenanceLogs}/>)
        })
        setPrinters(docs);
    }

    useEffect(()=>{
        // checking authentication status
        if(!auth.currentUser) navigate("/auth?rd="+ goto);
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
            if(idTokenResult.claims.role == "admin"){let admin = true;}
          }).catch((err)=> {
            console.error(err)
          })
        
        

        // retrieving categories
        async function getCategories(){
            let querySnapshot = await getDocs(ref);
            let docs = [];
            querySnapshot.forEach((doc)=> {
                let data = doc.data();
                docs.push({id:doc.id, data:data});
            })
            setCategories(docs);
        }
        getCategories();

        // getting printer statuses
        
        if(printers.length==0) getPrinterStatuses();
        
        //Boot User if they aren't allowed
        async function checkAdmin(){
            let tokenResult = await auth.currentUser.getIdTokenResult().then((idTokenResult) => {
                if(!(idTokenResult.claims.role == "admin" || idTokenResult.claims.role == "classroom")){ 
                    navigate("/403");
                }else{
                    console.log("User is either admin or classroom: " + idTokenResult.claims.role);
                }
            });
        }
        checkAdmin();
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


    function viewQueueButton(){
        async function viewQueue() {
            try {
                const db = getFirestore(firebaseApp);
                const docref = doc(db, "categories", selectedCategory);
                const queueRef = collection(docref, "prints");
                const q = query(queueRef,where("status", "!=", "printed"), orderBy("timestamp", "asc"));
                const querySnapshot = await getDocs(q);
                const queueDocs = [];
                let elevatedDocs = [];
                console.log(queueDocs)
                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    if(data.elevated){
                        elevatedDocs.push({ id: doc.id, data: data });
                    } else {
                        queueDocs.push({ id: doc.id, data: data });
                    }
                });
                let final = [];
                for(let i=0; i<elevatedDocs.length; i++){
                    final.push(elevatedDocs[i]);
                }
                for(let i=0; i<queueDocs.length; i++){
                    final.push(queueDocs[i]);
                }
                // Render QueueRow components for each document in the queue
                let items = [];
                final.forEach((queueDoc) => {
                    items.push(<QueueRow key={queueDoc.id} category={selectedCategory} id={queueDoc.id} data={queueDoc.data} printers={printers}/>)
                })
                if(items.length == 0) items.push(<p>No items in queue</p>)
                setQueueItems(items);
            } catch (error) {
                console.error(error);
            }
        }
        viewQueue()
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

    function reloadPrinterStatuses(){
        const db = getFirestore(firebaseApp);
        setPrinters([]);
        async function getPrinterStatuses(){
            const q = collection(db, "printers");
            let querySnapshot = await getDocs(q);
            let docs = [];
            querySnapshot.forEach((doc)=> {
                let data = doc.data();
                docs.push({id:doc.id, data:data})
            })
            setPrinters(docs);
            setLastCheckedTime(new Date());
        }
        getPrinterStatuses();
    }

    
    let tabbuttonstyle = {width: "49%", backgroundColor: "#bfbfbf", border: "2px black solid",padding: "10px", cursor: "pointer", color:"black"}
    let toggledtabstyle = {borderBottom:"0px", backgroundColor:"#d9d9d9", borderBottomLeftRadius:"0px", borderBottomRightRadius:"0px"}
    return (
        <>
        <div className={styles.body} style={{paddingTop:"5vh"}}>
            <h1>Classroom Dashboard</h1>
            <div className={styles.popout}>
                <div style={{display:"flex", justifyContent:"space-around", backgroundColor: "#bfbfbf"}}>
                    <button onClick={()=>{setSelectedMenu("queue")}} style={{...tabbuttonstyle, ...(selectedMenu=="queue"?toggledtabstyle:{})}}>Queue</button>
                    <button onClick={()=>{setSelectedMenu("printer")}} style={{...tabbuttonstyle, ...(selectedMenu=="printer"?toggledtabstyle:{})}}>Printer Management</button>
                </div>
                <br/>
                {selectedMenu=="queue"?
                <>
                <Select value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}>
                    {categories.map((category, index)=>{
                        return <MenuItem key={index} value={category.id}>{category.data.name}</MenuItem>
                    })}
                </Select>
                <Button variant="contained" onClick={viewQueueButton}>View</Button>
                
                {queueItems}
                </>:

                <>
                {
                printers.map((printer, index)=>{
                    return <PrinterRow printer={printer.id} statusCode={printer.data.status} timeToDone={printer.data.timeToDone} key={doc.id} onButtonClick={getMaintenanceLogs}/>
                })
                }
                <p>Printer Status Last Checked at {printerLastCheckedTime.getHours()}:{printerLastCheckedTime.getMinutes()} <IconButton onClick={reloadPrinterStatuses}><ReplayIcon/></IconButton></p>
                </>
                }


                    <Modal open={maintenanceModalOpen!="false"} onClose={()=>{setMaintenanceModalOpen("false")}}>
                        <Box sx={{width: "80%", backgroundColor:"rgba(219,219,219,0.8)", margin:"auto", padding:"2px", marginTop:"5vh", color:"black"}}>
                            <h1>Maintenance Logs</h1>
                            {maintenanceLogs}
                            <TextField label="Add Maintenance Log Message" sx={{width: "90%"}} value={newMaintenanceMsg} onChange={(e)=>setNewMaintenanceMsg(e.target.value)}/>
                            <Button onClick={submitNewMaintenanceMessage}>Submit</Button>
                        </Box>
                    </Modal>

            </div>
        </div>
        </>
    );
};

export default ClassroomPage;