import React , { useState } from "react";
import { changeEmail , resendEmail } from "@suke/suke-web/src/api/account";
import { useNotification , defaultNotificationOpts } from "@suke/suke-web/src/hooks/useNotifications";
import { IUser } from "@suke/suke-core/src/entities/User";
import { Navigation } from "../../common/Navigation";
import { Button } from "@suke/suke-web/src/components/Button";
import { ImageCircle } from "../../components/ImageCircle";
import apiUrl from "../../util/apiUrl";
import { Modal } from "../../components/Modal";

export interface AccountPageProps {
    user? : IUser
}

const Title = ({title}: {title: string}) => <h1 className="text-white text-xl font-bold mb-3">{title}</h1>;

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
                    <div>
                        <Title title={"Profile Information"} />
                        
                        <div className="mb-2">
                            <ImageCircle className="bg-black " alt="profile picture" src={user.pictureUrl || apiUrl("/api/images/PngItem_307416.png").toString()}></ImageCircle>
                            <Button>Change</Button>
                        </div>

                        <div className="text-white mb-6">
                            <h1> <b className="font-semibold text-lightgray mr-2">Username:</b>  {user.name} </h1>
                            <h1> 
                                <b className="font-semibold text-lightgray mr-2">Email:</b>  
                                {user.email} 
                                {user.isVerified ? 
                                    <span className="text-green ml-1">{"\u2714"}</span> : 
                                    (<React.Fragment><span className="text-red ml-1 mr-2">{"\u2716"}</span><span className="text-blue hover:underline cursor-pointer" onClick={() => resendEmailHandler()}>Resend Email</span></React.Fragment>)} 
                                </h1>
                        </div>
                        <h1 className="text-white font-semibold mb-2">Change your Email</h1>
                        <input type="email" autoComplete="false" className="bg-black p-2 mb-1 text-sm w-52" name="newEmailField" aria-autocomplete="none" placeholder="New Email" onChange={(e) => setNewEmailInput(e.target.value)} value={newEmailFieldInput}/>
                        <br/>
                        <input type="password" className="bg-black p-2 w-52 text-sm" name="passField" autoComplete="new-password" placeholder="Password" onChange={(e) => setPasswordFieldInput(e.target.value)}value={passwordFieldInput}/>
                        <br/>
                        <Button className="mt-2 cursor-pointer" backgroundColor="green" size={2} onClick={changeEmailHandler}> Change Email </Button>
                    </div>
                    <div>

                    </div>
                </div>
            }
        </React.Fragment>
    )
}

const changeProfilePictureModal = ({active}: {active: boolean, setActive: (p: boolean) => void}) => {

    return <Modal className="absolute" active={active}>
        <div>
            <h1>Upload Profile Picture</h1>
        </div>
    </Modal>
}