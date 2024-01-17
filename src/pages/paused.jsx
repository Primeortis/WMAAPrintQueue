import PauseCircleIcon from '@mui/icons-material/PauseCircle';

export default function PausedPage(props){
    return (
        <div style={{width:"100vw", overflow:"none", top:"0"}}>
            <img src="/wmaa.png" style={{width:"10vw", height:"auto", margin:"auto"}}/>
            <h1>Your access to the WMAA Print Portal has been paused.</h1>
            <PauseCircleIcon/>
        </div>
    )
}