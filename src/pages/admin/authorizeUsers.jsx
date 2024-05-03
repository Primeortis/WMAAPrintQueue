import { Button, LinearProgress, TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from "../../../components/navbar/nav.jsx";
import styles from "../../pagestyles.module.css";
import {firebaseApp} from "../../../src/firebase-config.js"
import {getAuth} from "firebase/auth"
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Alert from '@mui/material/Alert';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function AuthorizeUsersPage(props){
    const auth = getAuth(firebaseApp);
    let [userIDOrEmail, setUserIDOrEmail] = useState("");
    let [loadingInformation, setLoadingInformation] = useState(false);
    let [error, setError] = useState(null);
    let [alreadyAuthorized, setAlreadyAuthorized] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
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
        
        const db = getFirestore(firebaseApp);
        let usersRef = doc(db, "admin", "authorized");
        getDoc(usersRef).then((docSnap)=> {
            if(docSnap.exists()){
                let data = docSnap.data();
                setAlreadyAuthorized(data.emails);
            }
        }).catch((e)=> {
            console.error(e);
            setError(e.msg);
        })
        
    }, []);

    let emailRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");

    function handleSubmit(){
        if(emailRegex.test(userIDOrEmail)){
            setLoadingInformation(true);
            setDoc(doc(getFirestore(firebaseApp), "admin", "authorized"), {emails: [...alreadyAuthorized, userIDOrEmail]}).then(()=> {
                setAlreadyAuthorized([...alreadyAuthorized, userIDOrEmail]);
                setLoadingInformation(false);
                setUserIDOrEmail("");
            }).catch((e)=> {
                console.error(e);
                setError(e.msg);
                setTimeout(()=> {
                    setError(null);
                }, 10000);
            })
        } else {
            setError("Invalid Email");
            setTimeout(()=> {
                setError(null);
            }, 10000);
        }
    }

    function removeUser(user){
        let newUsers = alreadyAuthorized.filter((email)=> email!=user);
        setDoc(doc(getFirestore(firebaseApp), "admin", "authorized"), {emails: newUsers}).then(()=> {
            setAlreadyAuthorized(newUsers);
        }).catch((e)=> {
            console.error(e);
            setError(e.msg);
            setTimeout(()=> {
                setError(null);
            }, 10000);
        })
    }

    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"5vh"}}>
                <h1>Authorize Users</h1>
                <div className={styles.popout}>
                    <p>Users with the @westmichiganaviation.org email are automatically authorized, here you can specify other 3rd party emails to be authorized to use this system. </p>
                    <TextField label="User Email" variant="outlined" fullWidth value={userIDOrEmail} onChange={(e)=>setUserIDOrEmail(e.target.value)}/>
                    <br/>
                    <Button variant="contained" onClick={handleSubmit}>Authorize</Button>
                    {loadingInformation?<LinearProgress/>:null}
                    {error!=null?<Alert severity="error">{error}</Alert>:null}
                    <br/>
                    {
                        alreadyAuthorized.length>0?
                        <>
                            <h2>Already Authorized Users</h2>
                                {alreadyAuthorized.map((user, index)=> {
                                    return <><p key={index}>{user} <IconButton onClick={()=>removeUser(user)}><DeleteIcon/></IconButton></p></>
                                })}
                        </>:<p>Nothing to show.</p>
                    }
                    <i>This system WILL NOT stop 3rd party emails who are already registered in the system. Rather, this will allow certain users with 3rd party emails to register with the system. Use the <Link to={"/admin/usermanagement"}>User Management page</Link> for that.</i>
                </div>
            </div>
        </>
    )
}