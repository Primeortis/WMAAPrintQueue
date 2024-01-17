import React from "react";
import styles from "./styles.module.css";

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
                <AccountCircleIcon sx={iconStyles}/>
                <HistoryIcon sx={iconStyles}/>
                <AttachFileIcon sx={iconStyles}/>
                <LibraryAddIcon sx={iconStyles}/>
                <NotificationsIcon sx={iconStyles}/>
                {this.props.admin?<SecurityIcon sx={iconStyles} />:null}
            </nav>
        );
    }
}

export default Navbar;