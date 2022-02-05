import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@suke/suke-web/src/hooks/useAuth";
import { AccountPageProps } from "../Account";

export interface RequireAuthPageProps {
    component : JSX.Element
}

export const RequireAuthPage  = ({ component } : RequireAuthPageProps ) : JSX.Element => {
    const { user } = useAuth();

    return (
        <React.Fragment>
            {user && user.name !== "Guest" ? React.cloneElement<AccountPageProps>(component , { user }) : <Navigate to="/"/>}
        </React.Fragment>
    )
}