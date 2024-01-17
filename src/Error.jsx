import { useRouteError } from "react-router-dom";

function Error(props){
    const error = useRouteError();
    return (
        <>
            <h1>Oops! Something went wrong.</h1>
            <h1>{error.statusText || error.message}</h1>
        </>
    )
}

export default Error