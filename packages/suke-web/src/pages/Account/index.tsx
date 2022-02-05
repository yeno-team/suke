import React from "react";
import { IUser } from "@suke/suke-core/src/entities/User";

export interface AccountPageProps {
    user? : IUser
}

export const AccountPage = ({ user } : AccountPageProps) => {
    return (
        <React.Fragment>
            {
                user && 
                <div>
                    <h1> Username : {user.name} </h1>
                    <h1> Email : {user.email} </h1>
                    <h1> isVerified : {user.isVerified ? "true" : "false"} </h1>
                    
                    {!(user.isVerified) && <button className="cursor-pointer"> Resend Email </button> }
                </div>
            }
        </React.Fragment>
    )
}