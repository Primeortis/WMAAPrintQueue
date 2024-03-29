import { Button, Modal, Box, TextField, LinearProgress, IconButton, Select, MenuItem } from "@mui/material";
import Navbar from "../../../components/navbar/nav.jsx";
import styles from "../../pagestyles.module.css";
import {firebaseApp} from "../../firebase-config.js"
import {getAuth} from "firebase/auth"
import { useNavigate } from "react-router-dom";
import {getFirestore, doc, getDocs, collection, setDoc} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Delete } from "@mui/icons-material";


export default function PrinterManagementPage(props){
    let navigate = useNavigate();
    const auth = getAuth(firebaseApp);
    let [categories, setCategories] = useState(null);
    let [printers, setPrinters] = useState(null);
    let [modalOpen, setModalOpen] = useState(false);
    let [printerModalOpen, setPrinterModalOpen] = useState(false);
    let [newCategoryComputerName, setNewCategoryComputerName] = useState("");
    let [newCategoryName, setNewCategoryName] = useState("");
    let [newCategoryMinRole, setNewCategoryMinRole] = useState("");

    let [newPrinterName, setNewPrinterName] = useState("");
    let [newPrinterCategory, setNewPrinterCategory] = useState("");
    let [newPrinterMaterial, setNewPrinterMaterial] = useState("");
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

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Manage Printers</h1>
                <div className={styles.popout}>
                    <h2>Printer Collections</h2>
                    {
                        categories ? categories.map((category) => {
                            return (
                                <><p><IconButton><Delete/></IconButton>{category.id}</p></>
                            )
                        }):<LinearProgress/>
                    }
                    <Button variant={"contained"} onClick={()=> {setModalOpen(true)}}>Add Category</Button>
                    <hr/>
                    <h2>Printers</h2>
                    {
                        printers ? printers.map((printer) => {
                            return (
                                <p>{printer.id}</p>
                            )
                        }):<LinearProgress/>
                    }
                    <Button variant={"contained"} onClick={()=>setPrinterModalOpen(true)}>Add Printer</Button>

                    {/*New Category Modal*/}
                    {modalOpen?
                        <Modal open={modalOpen} onClose={()=>{setModalOpen(false)}}>
                            <Box sx={{width: "80%", backgroundColor:"rgba(91,91,91,0.8)", margin:"auto", padding:"2px", marginTop:"5vh"}}>
                                <h1>Create A New Category</h1>
                                <TextField label="Category Name" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)}/>
                                <br/><br/>
                                <TextField label="Computer Name" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={newCategoryComputerName} onChange={(e)=>setNewCategoryComputerName(e.target.value)}/>
                                <br/><br/>
                                <TextField label="Minimum Role" variant="outlined" style={{width: "50%", minWidth:"40px"}} value={newCategoryMinRole} onChange={(e)=>setNewCategoryMinRole(e.target.value)}/>
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
                </div>
            </div>
        </>
    )
}