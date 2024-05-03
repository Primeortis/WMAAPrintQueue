import { useRouteError } from "react-router-dom";

function Error(props){
    const error = useRouteError();
    return (
        <>
            <h1>Oops! Something went wrong.</h1>
            <p style={{color:"black"}}>{error.statusText || error.message}</p>
        </>
    )
}

export default Error