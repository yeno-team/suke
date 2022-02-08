import React , { useState } from "react";
import { changeEmail , resendEmail } from "@suke/suke-web/src/api/account";
import { useNotification , defaultNotificationOpts } from "@suke/suke-web/src/hooks/useNotifications";
import { IUser } from "@suke/suke-core/src/entities/User";

export interface AccountPageProps {
    user? : IUser
}

export const AccountPage = ({ user } : AccountPageProps) => {
    const [ newEmailFieldInput , setNewEmailInput ] = useState("");
    const [ passwordFieldInput , setPasswordFieldInput ] = useState("");
    const notificationStore = useNotification();

    const changeEmailHandler = async (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault(); 

        try {
            await changeEmail({ 
                email : newEmailFieldInput, 
                password : passwordFieldInput
            })

            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Success",
                type : "success",
                message : "You've successfully changed your email."
            })

        } catch (e) {
            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Error",
                type : "danger",
                message : (e as Error).message
            })
        }

        setNewEmailInput("");
        setPasswordFieldInput("");
    }

    return (
        <React.Fragment>
            {/* <Navigation/> */}
            {
                user && 
                <div className="">
                    <h1> Username : {user.name} </h1>
                    <h1> Email : {user.email} </h1>
                    <h1> isVerified : {user.isVerified ? "true" : "false"} </h1>
                    
                    {!(user.isVerified) && <button className="cursor-pointer" onClick={resendEmail}> Resend Email </button> }

                    <h1> Change Email </h1>

                    <input type="email" className="bg-gray border" name="newEmailField" placeholder="New Email" onChange={(e) => setNewEmailInput(e.target.value)} value={newEmailFieldInput}/>
                    <input type="password" className="bg-gray border" name="passField" placeholder="Password" onChange={(e) => setPasswordFieldInput(e.target.value)}value={passwordFieldInput}/>
                    <button className="bg-green cursor-pointer" onClick={changeEmailHandler}> Change Email </button>
                </div>
            }
        </React.Fragment>
    )
}