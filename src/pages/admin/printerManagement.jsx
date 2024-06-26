import { Button, Modal, Box, TextField, LinearProgress, IconButton, Select, MenuItem, Alert } from "@mui/material";
import Navbar from "../../../components/navbar/nav.jsx";
import styles from "../../pagestyles.module.css";
import {firebaseApp} from "../../firebase-config.js"
import {getAuth} from "firebase/auth"
import { useNavigate } from "react-router-dom";
import {getFirestore, doc, getDocs, collection, setDoc} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Delete } from "@mui/icons-material";
import { httpsCallable, getFunctions } from "firebase/functions";
import ConfirmModal, {ExtraConfirmModal} from "../../../components/confirmModal.jsx";
import BuildIcon from '@mui/icons-material/Build';


export default function PrinterManagementPage(props){
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);
    const functions = getFunctions(firebaseApp);
    let [categories, setCategories] = useState(null);
    let [printers, setPrinters] = useState(null);
    let [modalOpen, setModalOpen] = useState(false);
    let [printerModalOpen, setPrinterModalOpen] = useState(false);
    let [newCategoryComputerName, setNewCategoryComputerName] = useState("");
    let [newCategoryName, setNewCategoryName] = useState("");
    let [newCategoryMinRole, setNewCategoryMinRole] = useState("student");

    let [newPrinterName, setNewPrinterName] = useState("");
    let [newPrinterCategory, setNewPrinterCategory] = useState("");
    let [newPrinterMaterial, setNewPrinterMaterial] = useState("");
    let [deleteModal, setDeleteModal] = useState(null);
    let [maintenanceModalOpen, setMaintenanceModalOpen] = useState("false");
    let [maintenanceLogs, setMaintenanceLogs] = useState([]);
    let [feedback, setFeedback] = useState(null)
    let userInformation = auth.currentUser;
    
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
            setNewPrinterCategory(docs[0].id)
            setCategories(docs);
        }
        getCategories();

        const printersRef = collection(db, "printers");
        async function getPrinters() {
            let querySnapshot = await getDocs(printersRef);
            let docs = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                docs.push({ id: doc.id, data: data });
            });
            setPrinters(docs);
        }
        getPrinters();
        
        //Boot User if they aren't allowed
        async function checkAdmin(){
            let tokenResult = await auth.currentUser.getIdTokenResult().then((idTokenResult) => {
                if(idTokenResult.claims.role != "admin"){ 
                    navigate("/403");
                }else{
                    console.log("User is either admin or classroom: " + idTokenResult.claims.role);
                }
            });
        }
        checkAdmin();
    }, [])

    function submitNewCategory(){
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "categories", newCategoryComputerName);
        async function addCategory(){
            let docRef = await setDoc(ref, {
                name: newCategoryName,
                minRole: newCategoryMinRole
            })
        }
        addCategory();
        setCategories(categories.concat({id:newCategoryComputerName, data:{name:newCategoryName, minRole:newCategoryMinRole}}))
        setNewCategoryMinRole("");
        setNewCategoryName("");
        setNewCategoryComputerName("")
        setModalOpen(false);
    }

    function submitNewPrinter(){
        const db = getFirestore(firebaseApp);
        const ref = doc(db, "printers", newPrinterName);
        async function addPrinter(){
            let docRef = await setDoc(ref, {
                category: newPrinterCategory,
                material: newPrinterMaterial,
                status: "good",
                currentPrint: null
            })
        }
        addPrinter();
        setPrinters(printers.concat({id:newPrinterName, data:{category:newPrinterCategory, material:newPrinterMaterial, status:"good", currentPrint:null}}))
        setNewPrinterName("");
        setNewPrinterCategory("");
        setNewPrinterMaterial("");
        setPrinterModalOpen(false);
    }

    function checkBeforeDeletingCategory(id){
        setDeleteModal(<ExtraConfirmModal confirmPhrase={id} onConfirm={()=>deleteCategory(id)} onCancel={()=>setDeleteModal(null)} message={"Are you sure you want to delete this collection? You should delete or change the category of all printers associated with this category. All queuing information within this category will be deleted. Are you sure?"}/>)
    }

    function deleteCategory(id){
        let deleteCategory = httpsCallable(functions, "deleteCategory");
        deleteCategory({id: id}).then((result)=>{
            if(result.data.error){
                console.error(result.data.message)
            } else {
                setCategories(categories.filter((category)=>category.id!=id))
            }
            setDeleteModal(null)
        }).catch((error)=>{
            console.error(error);
        })
    }

    function checkBeforeDeletingPrinter(id){
        setDeleteModal(<ExtraConfirmModal confirmPhrase={"Delete this printer"} onConfirm={()=>deletePrinter(id)} onCancel={()=>setDeleteModal(null)} message={"Are you sure you want to delete this printer? This will remove all maintenance logs associated with this printer. Are you sure?"}/>)
    }

    function deletePrinter(id){
        let deletePrinter = httpsCallable(functions, "deletePrinter");
        deletePrinter({id: id}).then((result)=>{
            if(result.data.error){
                console.error(result.data.message)
            } else {
                setPrinters(printers.filter((printer)=>printer.id!=id))
            }
            setDeleteModal(null)
        }).catch((error)=>{
            console.error(error);
        })
    }

    function openMaintenanceModal(printer){
        const db = getFirestore(firebaseApp);
        let q = doc(db, "printers", printer);
        q = collection(q, "maintenance");
        getDocs(q).then((querySnapshot)=>{
            let docs = [];
            querySnapshot.forEach((doc)=> {
                let data = doc.data();
                let date = new Date(data.date)
                docs.push({user: data.user, date: date, message: data.message});
            })
            if(docs.length ==0){
                docs.push({user: "none", date: new Date(), message: "No Maintenance Logs"});
            }
            setMaintenanceLogs(docs)
            setMaintenanceModalOpen(printer);
        }).catch((error)=>{
            console.error(error)
        })
    }

    function downloadMessages(){
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Maintenance Logs Exported " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "\r\n";
        csvContent += "User, Date, Message\r\n";
        maintenanceLogs.forEach((log)=>{
            let line = log.user + ", \"" + log.date.toLocaleDateString() + " " + log.date.toLocaleTimeString() + "\",\"" + log.message +"\"";
            csvContent += line + "\r\n";
        })
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "maintenanceLogs.csv");
        document.body.appendChild(link);
        link.click();
    }

    function deletePrinterLogs(){
        let deleteLogs = httpsCallable(functions, "deletePrinterLogs");
        deleteLogs({id: maintenanceModalOpen}).then((result)=>{
            if(result.data.error){
                console.error(result.data.message)
            } else {
                setMaintenanceModalOpen("false");
                setMaintenanceLogs([]);
                setFeedback(null);
            }
        }).catch((error)=>{
            setMaintenanceModalOpen("false")
            console.error(error);
            setFeedback(<Alert severity="error">Error deleting logs</Alert>);
        })
    }

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Manage Printers</h1>
                <div className={styles.popout}>
                    {deleteModal}
                    {feedback}
                    <h2>Printer Collections</h2>
                    {
                        categories ? categories.map((category) => {
                            return (
                                <><p><IconButton onClick={()=>checkBeforeDeletingCategory(category.id)}><Delete/></IconButton>{category.id}</p></>
                            )
                        }):<LinearProgress/>
                    }
                    <Button variant={"contained"} onClick={()=> {setModalOpen(true)}}>Add Category</Button>
                    <hr/>
                    <h2>Printers</h2>
                    {categories && printers ? categories.map((category) => {
                        const categoryPrinters = printers.filter((printer) => printer.data.category === category.id);
                        return (
                            <div key={category.id}>
                                <h3>{category.id}</h3>
                                {categoryPrinters.map((printer) => (
                                    <p key={printer.id}>
                                        <IconButton onClick={() => checkBeforeDeletingPrinter(printer.id)}>
                                            <Delete/>
                                        </IconButton>
                                        {printer.id}
                                        <IconButton onClick={() => openMaintenanceModal(printer.id)}>
                                            <BuildIcon/>
                                        </IconButton>
                                    </p>
                                ))}
                            </div>
                        );
                    }) : <LinearProgress/>}
                    <Button variant={"contained"} onClick={()=>setPrinterModalOpen(true)}>Add Printer</Button>
                    {modalOpen?
                        <Modal open={modalOpen} onClose={()=>{setModalOpen(false)}}>
                            <Box sx={{width: "80%", backgroundColor:"rgba(91,91,91,0.8)", margin:"auto", padding:"2px", marginTop:"5vh"}}>
                                <h1>Create A New Category</h1>
                                <TextField label="Category Name" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)}/>
                                <br/><br/>
                                <TextField label="Computer Name" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={newCategoryComputerName} onChange={(e)=>setNewCategoryComputerName(e.target.value)}/>
                                <br/><br/>
                                <Select label="Select Minimum Role" variant="outlined" style={{width: "25%", minWidth:"40px"}} value={newCategoryMinRole} onChange={(e)=>setNewCategoryMinRole(e.target.value)}>
                                    <MenuItem value={"student"}>Student</MenuItem>
                                    <MenuItem value={"apprentice"}>Apprentice</MenuItem>
                                    <MenuItem value={"journeyman"}>Journeyman</MenuItem>
                                    <MenuItem value={"master"}>Master</MenuItem>
                                    <MenuItem value={"admin"}>Admin</MenuItem>
                                </Select>
                                <br/><br/>
                                <Button variant="contained" onClick={submitNewCategory}>Create Category</Button>
                            </Box>
                        </Modal>
                    :null}

                    {/*New Printer Modal*/}
                    {printerModalOpen?
                        <Modal open={printerModalOpen} onClose={()=>{setPrinterModalOpen(false)}}>
                            <Box sx={{width: "80%", backgroundColor:"rgba(91,91,91,0.8)", margin:"auto", padding:"2px", marginTop:"5vh"}}>
                                <h1>Create A New Printer</h1>
                                <TextField label="Printer Name" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={newPrinterName} onChange={(e)=>setNewPrinterName(e.target.value)}/>
                                <br/><br/>
                                <Select value={newPrinterCategory} onChange={(e)=>setNewPrinterCategory(e.target.value)}>
                                    {
                                        categories ? categories.map((category) => {
                                            return (
                                                <MenuItem value={category.id}>{category.data.name}</MenuItem>
                                            )
                                        }):<MenuItem>Loading...</MenuItem>
                                    }
                                </Select>
                                <br/><br/>
                                <TextField label="Material" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={newPrinterMaterial} onChange={(e)=>setNewPrinterMaterial(e.target.value)}/>
                                <br/><br/>
                                <Button variant="contained" onClick={submitNewPrinter}>Create Printer</Button>
                            </Box>
                        </Modal>
                    :null}

                    {maintenanceModalOpen != "false"?
                        <Modal open={maintenanceModalOpen != "false"} onClose={()=>{setMaintenanceModalOpen("false")}}>
                            <Box sx={{width: "80%", backgroundColor:"rgba(219,219,219,0.8)", margin:"auto", padding:"2px", marginTop:"5vh", color:"black", maxHeight:"80vh", overflowY:"scroll"}}>
                                <h1>Maintenance Logs</h1>
                                {maintenanceLogs.length>0?maintenanceLogs.map((log)=>{
                                    return <p>{log.user} {log.date.toLocaleDateString() + " " + log.date.toLocaleTimeString()}: {log.message}</p>
                                }):<LinearProgress/>}
                                <Button variant="contained" onClick={()=> setFeedback(<ConfirmModal onConfirm={()=>deletePrinterLogs()} onCancel={()=>setFeedback(null)} message={"Are you sure you want to delete this printer's logs? This will remove all maintenance logs associated with this printer. Are you sure?"}/>)}>Delete All Messages</Button>
                                <Button variant="contained" onClick={downloadMessages}>Download Messages</Button>
                            </Box>
                        </Modal>
                    :null}
                </div>
            </div>
        </>
    )
}