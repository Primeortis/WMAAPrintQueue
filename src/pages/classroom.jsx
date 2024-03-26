import {useState, useEffect} from 'react';
import styles from '../pagestyles.module.css';
import {getAuth} from 'firebase/auth';
import { getFirestore, collection, getDocs, doc } from 'firebase/firestore';
import { firebaseApp } from '../firebase-config';
import { Button, IconButton, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';


function QueueRow(props){
    let [expanded, setExpanded] = useState(false);
    let [stlURL, setSTLURL] = useState("");
    const storage = getStorage(firebaseApp);
    useEffect(()=> {
        getDownloadURL(ref(storage, props.data.fileID)).then((url)=> {
            setSTLURL(url);
        }).catch((err)=> {
            console.error(err);
        })
    }, [])
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
                <p>Status: {props.data.status}</p>
                <a href={stlURL} download={props.data.name+".stl"}><Button variant="contained">Download File</Button></a>
                <Button variant="contained">Advance Status</Button>
            </div>
            </>
        )
    }

}


const ClassroomPage = () => {
    let goto = encodeURIComponent(window.location.pathname);
    let [categories, setCategories] = useState([]);
    let [selectedCategory, setSelectedCategory] = useState("");
    let [selectedMenu, setSelectedMenu] = useState("queue");
    let [queueItems, setQueueItems] = useState([]);
    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!auth.currentUser) navigate("/auth?rd="+ goto);
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
            if(idTokenResult.claims.role == "admin"){let admin = true;}
          }).catch((err)=> {
            console.error(err)
          })
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

    function viewQueueButton(){
        
        async function viewQueue() {
            try {
                const db = getFirestore(firebaseApp);
                const docref = doc(db, "categories", selectedCategory);
                const queueRef = collection(docref, "prints");
                const querySnapshot = await getDocs(queueRef);
                const queueDocs = [];
                console.log(queueDocs)
                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    queueDocs.push({ id: doc.id, data: data });
                });
                // Render QueueRow components for each document in the queue
                let items = [];
                queueDocs.forEach((queueDoc) => {
                    items.push(<QueueRow key={queueDoc.id} data={queueDoc.data} />)
                })
                if(items.length == 0) items.push(<p>No items in queue</p>)
                setQueueItems(items);
            } catch (error) {
                console.error(error);
            }
        }
        viewQueue()
    }

    return (
        <>
        <div className={styles.body} style={{paddingTop:"5vh"}}>
            <h1>Classroom Dashboard</h1>
            <div className={styles.popout}>
                <div style={{display:"flex", justifyContent:"space-around", backgroundColor: "#bfbfbf"}}>
                    <Button variant={selectedMenu=="queue"?"outlined":"contained"} onClick={()=>{setSelectedMenu("queue")}}>Queue</Button>
                    <Button variant={selectedMenu=="printer"?"outlined":"contained"} onClick={()=>{setSelectedMenu("printer")}}>Printer Management</Button>
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
                
                </>
                }
            </div>
        </div>
        </>
    );
};

export default ClassroomPage;