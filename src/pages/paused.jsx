import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import Parent from "../../components/basic/parent";

export default function PausedPage(props){
    return (
        <Parent>
            <h1 style={{color:"black"}}>Paused</h1>
            <div style={{backgroundColor:"#FAFAFA", width:"40%", margin:"auto", borderRadius:"10px", paddingBottom:"10px"}}>
                <br/>
                <img src="/wmaa.png"/><br/>
                <PauseCircleIcon style={{width:"20vh", height:"auto", color:"black"}}/>
                <p style={{color:"black", fontSize:"1em"}}>Your access to the WMAA Print Portal has been paused</p>
                <p style={{color:"black"}}><i>Questions? Contact your system administrator</i></p>
            </div>
        </Parent>
    )
}