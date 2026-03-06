import { useAuth } from "../hooks/useAuth"
import { Navigate, useLocation } from "react-router-dom";

// create a basic handleSubmit function, import useLocation and call it to get 
// the current location
// inside handleSubmit, after a successful login read the from value that PR stored
// call navigate() using that value as the destination, with a fallback to /jobs in case from is
// undefined

export const Login = () => {
    var { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/jobs" replace />;
    }

    return (
        <div>
            <h2>I am the Log In page!</h2>
            <p>Someday, you can log in here! For now, click this:</p>
            <button onClick={() => { isLoggedIn = true }}>Log In</button>
        </div>
    )
}