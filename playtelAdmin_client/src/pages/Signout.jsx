// SignOut.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignOut = ({ onSignOut }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Perform the sign-out logic
        onSignOut();
        navigate("/admin/login");
    }, [onSignOut, navigate]);

    return (
            <>
                <p>Signing out...</p>
            </>
    );
};

export default SignOut;



