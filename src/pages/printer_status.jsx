import Navbar from "../../components/navbar/nav"
import styles from "../pagestyles.module.css"
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

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
    return (
        <div className={styles.rows}>
            <p className={styles.emP}>{props.printer}</p>
            <p>
                <StatusIcon status={props.statusCode}/>
                <i>{props.statusMsg}</i>
            </p>
        </div>
    )
}

export default function PrinterStatus(props){
    return (
        <>
            <Navbar admin={true}/>
            <div className={styles.body} style={{paddingTop:"10vh"}}>
            <h1>Hey Bryson! Good to see you.</h1>
            <div className={styles.popout} style={{textAlign:"left"}}>
                <PrinterRow statusCode={"good"} statusMsg={"Ready to Print"} printer={"Ender Neo"} />
                <PrinterRow statusCode={"wait"} statusMsg={"Waiting for Print Removal Confirmation"} printer={"Ender Neo"} />
                <PrinterRow statusCode={"good"} statusMsg={"Ready to Print"} printer={"Ender Neo"} />
                <PrinterRow statusCode={"good"} statusMsg={"Ready to Print"} printer={"Ender Neo"} />
            </div>
          </div>
        </>
    )
}