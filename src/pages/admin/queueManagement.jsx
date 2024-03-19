import { Button, Select, MenuItem, IconButton, Modal, Box } from "@mui/material";
import Navbar from "../../../components/navbar/nav.jsx";
import styles from "../../pagestyles.module.css";
import {firebaseApp} from "../../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { useNavigate } from "react-router-dom";
import {getFirestore, doc, getDocs, collection} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import AttachmentIcon from '@mui/icons-material/Attachment';

function Row(props){
    let [modalOpen, setModalOpen] = useState(false)
    return (
        <>
        <div className={[styles.rows, styles.dimOnHover].join(" ")} style={{cursor:"pointer", color:"black"}} onClick={()=> {setModalOpen(true)}}>
            <IconButton><Delete/></IconButton>
            <IconButton><AttachmentIcon/></IconButton>
            <p className={styles.emP}>{props.data.userDisplayName}: {props.data.name}</p>
            <p>
                <i>{props.data.classFor?props.data.classFor:"Personal Project"}</i>
            </p>
        </div>
        {modalOpen?
            <Modal open={modalOpen} onClose={()=>{setModalOpen(false)}}>
                <Box sx={{width: "80%", backgroundColor:"rgba(91,91,91,0.8)", margin:"auto", padding:"2px", marginTop:"5vh"}}>
                <h1>More Information about this request</h1>
                <p>Student Name: {props.data.userDisplayName}</p>
                <p>Print Name: {props.data.name}</p>
                <p>Print Description: {props.data.description}</p>
                <p>Print Purpose: {props.data.printPurpose}</p>
                {props.data.printPurpose=="school"?
                <>
                <p>Class For: {props.data.classFor}</p>
                <p>Teacher of Class: {props.data.teacherOfClass}</p>
                </>:null
                }
                <p>Print Material: {props.data.material}</p>
                <p>Print Category: {props.data.location}</p>
                </Box>
            </Modal>
        :null}
        </>
    )
}



export default function QueueManagementPage(props){
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    let userInformation = auth.currentUser;

    let [categories, setCategories] = useState(null)
    let [selectedCategory, setSelectedCategory] = useState(null);
    let [queue, setQueue] = useState(null);
    
    useEffect(()=> {
        const db = getFirestore(firebaseApp);
        const ref = collection(db, "categories")
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
    }, [])

    function getQueueItems(){
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "categories", selectedCategory)
        const queueRef = collection(ref, "prints");
        async function getQueue(){
            let querySnapshot = await getDocs(queueRef);
            let docs = [];
            querySnapshot.forEach((doc)=> {
                let data = doc.data();
                docs.push(<Row data={data}/>);
            })
            setQueue(docs);
        }
        getQueue();
    }

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Manage Queue Order</h1>
                <div className={styles.popout}>
                    <p>Select Category to view queue</p>
                    <Select onChange={(e)=> setSelectedCategory(e.target.value)} value={selectedCategory}>
                        {categories?
                            categories.map((category)=> {
                                return <MenuItem value={category.id}>{category.data.name}</MenuItem>
                            })
                        :<MenuItem>Loading</MenuItem>
                        }
                    </Select>
                    <Button variant="contained" onClick={getQueueItems}>View Queue</Button>
                    {queue?queue:<p><i>Nothing to show...</i></p>}
                </div>
            </div>
        </>
    )
}