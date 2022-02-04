import React from "react";
import useAuth from "@suke/suke-web/src/hooks/useAuth";

export const AccountPage = () => {
    const { user } = useAuth();

    

    return (
        <React.Fragment>
            {
                user ? 
                <div>
                    <h1> Username : {user.name} </h1>
                    <h1> Email : {user.email} </h1>
                    <h1> isVerified : {user.isVerified ? "true" : "false"} </h1>

                    {!(user.isVerified) && <button className="cursor-pointer"> Resend Email </button> }
                </div> :
                <h1> You are not logged in </h1>
            }
        </React.Fragment>
    )
}