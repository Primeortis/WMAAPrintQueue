import React from "react";
import styles from "./styles.module.css";
import { Tooltip } from "@mui/material";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';

class Navbar extends React.Component {
    constructor(props){
        super();
        this.state = {};
    }

    render(){
        let iconStyles = {width:"65%", height:"auto", marginTop: "10px", marginBottom:"10px"};
        return (
            <nav className={styles.container}>
                <img style={iconStyles} src="/wmaa.png"/>
                <Tooltip title="Profile" placement="right">
                <AccountCircleIcon sx={iconStyles}/>
                </Tooltip>
                <Tooltip title="Printer Status" placement="right">
                <HistoryIcon sx={iconStyles}/>
                </Tooltip>
                <Tooltip title="Files" placement="right">
                <AttachFileIcon sx={iconStyles}/>
                </Tooltip>
                <Tooltip title="New Print" placement="right">
                <LibraryAddIcon sx={iconStyles}/>    
                </Tooltip>
                <Tooltip title="Messages" placement="right">
                <NotificationsIcon sx={iconStyles}/>    
                </Tooltip>
                
                {this.props.admin?
                <>
                <Tooltip title="Admin" placement="right">
                <SecurityIcon sx={iconStyles} />
                </Tooltip>
                </>
                :null}
            </nav>
        );
    }
}

export default Navbar;