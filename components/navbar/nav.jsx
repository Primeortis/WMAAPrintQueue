import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { IconButton, Tooltip } from "@mui/material";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import { Link, useNavigate } from "react-router-dom";

import {firebaseApp} from "../../src/firebase-config.js"
import {getAuth} from "firebase/auth"

function Navbar(props){
    let goto = encodeURIComponent(window.location.pathname);
    let auth = getAuth(firebaseApp);
    let navigate = useNavigate();
    let iconStyles = {width:"65%", height:"auto", marginTop: "10px", marginBottom:"10px"};
    useEffect(()=> {
        console.log(goto);
        if(!auth.currentUser) navigate("/auth?rd="+ goto)
    }, [])
    
    return (
        <nav className={styles.container}>
            <img style={iconStyles} src="/wmaa.png"/>
            <Tooltip title="Profile" placement="right">
                <IconButton component={Link} to={"/profile"}>
                <AccountCircleIcon sx={iconStyles}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Printer Status" placement="right">
            <IconButton component={Link} to={"/status"}>
                <HistoryIcon sx={iconStyles}/>
            </IconButton>
            </Tooltip>
            <Tooltip title="Files" placement="right">
                <IconButton component={Link} to={"/file"}>
                <AttachFileIcon sx={iconStyles}/>
                </IconButton>
            </Tooltip>
            <Tooltip title="New Print" placement="right">
            <LibraryAddIcon sx={iconStyles}/>    
            </Tooltip>
            <Tooltip title="Messages" placement="right">
            <NotificationsIcon sx={iconStyles}/>    
            </Tooltip>
            
            {props.admin?
            <>
            <Tooltip title="Admin" placement="right">
                <IconButton component={Link} to={"/admin"}>
                <SecurityIcon sx={iconStyles} />
                </IconButton>
            </Tooltip>
            </>
            :null}
        </nav>
        );
}

export default Navbar;