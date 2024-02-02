export default function Parent({children}){
    return (
    <div style={{width:"100vw", overflow:"none"}}>
        <div style={{display:"block", margin:"auto", alignContent:"center", textAlign:"center"}}>
            {children}
        </div>
    </div>
    )
}

