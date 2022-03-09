import React , { useState } from "react";
import { changeEmail , resendEmail } from "@suke/suke-web/src/api/account";
import { useNotification , defaultNotificationOpts } from "@suke/suke-web/src/hooks/useNotifications";
import { IUser } from "@suke/suke-core/src/entities/User";
import { Navigation } from "../../common/Navigation";
import { Button } from "@suke/suke-web/src/components/Button";

export interface AccountPageProps {
    user? : IUser
}

export const AccountPage = ({ user } : AccountPageProps) => {
    const [ newEmailFieldInput , setNewEmailInput ] = useState("");
    const [ passwordFieldInput , setPasswordFieldInput ] = useState("");
    const notificationStore = useNotification();

    const changeEmailHandler = async (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

    const resendEmailHandler = async() => {     
        try {
            await resendEmail()

            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Success",
                type : "success",
                message : "We have sent you a verification link to your new email address."
            })
        } catch (e) {
            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Error",
                type : "danger",
                message : (e as Error).message
            })
        }
    }

    return (
        <React.Fragment>
            <Navigation />
            {
                user && 
                <div className="font-sans mx-10 my-4">
                    <h1 className="text-white text-xl font-bold mb-3">Account Settings</h1>
                    <div className="text-white mb-2">
                        <h1> <b className="font-semibold text-lightgray mr-2">Username:</b>  {user.name} </h1>
                        <h1> 
                            <b className="font-semibold text-lightgray mr-2">Email:</b>  
                            {user.email} 
                            {user.isVerified ? 
                                <span className="text-green ml-1">{"\u2714"}</span> : 
                                (<React.Fragment><span className="text-red ml-1 mr-2">{"\u2716"}</span><span className="text-blue hover:underline cursor-pointer" onClick={() => resendEmailHandler()}>Resend Email</span></React.Fragment>)} 
                            </h1>
                    </div>
                    <h1 className="text-white font-semibold mb-2"> Change Email </h1>
                    <input type="email" autoComplete="false" className="bg-gray border" name="newEmailField" placeholder="New Email" onChange={(e) => setNewEmailInput(e.target.value)} value={newEmailFieldInput}/>
                    <br/>
                    <input type="password" className="bg-gray border" name="passField" placeholder="Password" onChange={(e) => setPasswordFieldInput(e.target.value)}value={passwordFieldInput}/>
                    <br/>
                    <Button className="mt-1 cursor-pointer" backgroundColor="green" size={2} onClick={changeEmailHandler}> Change Email </Button>
                </div>
            }
        </React.Fragment>
    )
}