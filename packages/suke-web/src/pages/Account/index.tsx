import React , { ChangeEvent, ChangeEventHandler, useState } from "react";
import { changeEmail , changePassword, resendEmail } from "@suke/suke-web/src/api/account";
import { useNotification , defaultNotificationOpts } from "@suke/suke-web/src/hooks/useNotifications";
import { IUser } from "@suke/suke-core/src/entities/User";
import { Navigation } from "../../common/Navigation";
import { Button } from "@suke/suke-web/src/components/Button";
import { ImageCircle } from "../../components/ImageCircle";
import { Modal } from "../../components/Modal";
import { uploadProfileImage } from "../../api/images";
import useAuth from "../../hooks/useAuth";
import { UserProfilePicture } from "../../common/UserProfilePicture";
import { Icon } from "@iconify/react";

export interface AccountPageProps {
    user? : IUser
}

const Title = ({title}: {title: string}) => <h1 className="text-white text-xl font-bold mb-3">{title}</h1>;

const ChangeProfilePictureModal = ({active, setActive, updateUser}: {active: boolean, setActive: (p: boolean) => void, updateUser: () => void}) => {
    const [file, setFile] = useState<File | undefined>();
    const notificationStore = useNotification();
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files![0]);
    }

    const onSubmit = async () => {
        try {
            if (!file) {
                return notificationStore.addNotification({
                    ...defaultNotificationOpts,
                    type : "danger",
                    title : "Error",
                    message : "Please select an image to upload."
                });
            }
            await uploadProfileImage(file);
            updateUser();
            setActive(false);
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "success",
                title : "Success",
                message : "Set your Profile Successfully."
            });
        } catch (e) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error).message
            });
        }
    }

    return <Modal className="absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-greatblack" active={active}>
        <div className="relative px-20 py-10">
            <h1 className="text-lg font-semibold mb-5 inline-block">Change Profile Picture </h1>
            <div className="absolute right-5 top-3 text-xl hover:bg-opacity-90 cursor-pointer" onClick={() => setActive(false)}>x</div>
            <input type="file" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={onFileChange}></input>
            {
                file && <React.Fragment>
                    <ImageCircle className="mx-auto bg-coolblack w-20 h-20" src={URL.createObjectURL(file)} noproxy="true" alt=""/>
                    <Button className="mt-4" backgroundColor="coolgray" onClick={onSubmit}>Set Picture</Button>
                </React.Fragment>
            }
        </div>
    </Modal>
}

export const EmailChangeModal = ({active, toggleActive, updateUser}: {active: boolean, toggleActive: () => void, updateUser: () => void}) => {
    const [ newEmailFieldInput , setNewEmailInput ] = useState("");
    const [ passwordFieldInput , setPasswordFieldInput ] = useState("");
    const notificationStore = useNotification();

    const changeEmailHandler = async (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            await changeEmail({ 
                email : newEmailFieldInput, 
                password : passwordFieldInput
            })
            updateUser();
            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Success",
                type : "success",
                message : "You've successfully changed your email."
            });
        } catch (e) {
            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Error",
                type : "danger",
                message : (e as Error).message
            });
        }

        setNewEmailInput("");
        setPasswordFieldInput("");
    }
    
    return (
        <Modal className="absolute p-10 text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-greatblack" active={active}>
            <div className="absolute right-5 top-3 text-xl hover:bg-opacity-90 cursor-pointer" onClick={() => toggleActive()}>x</div>
            <h1 className="text-white font-semibold mb-2">Change your Email</h1>
            <input type="email" autoComplete="false" className="bg-newblack p-2 mb-1 text-sm w-52" name="newEmailField" aria-autocomplete="none" placeholder="New Email" onChange={(e) => setNewEmailInput(e.target.value)} value={newEmailFieldInput}/>
            <br/>
            <input type="password" className="bg-newblack p-2 w-52 text-sm" name="passField" autoComplete="new-password" placeholder="Confirm Password" onChange={(e) => setPasswordFieldInput(e.target.value)}value={passwordFieldInput}/>
            <br/>
            <Button className="mt-2 cursor-pointer" backgroundColor="coolgray" onClick={changeEmailHandler}> Change Email </Button>
        </Modal>
    );  
}

export const PasswordChangeModal = ({active, toggleActive, updateUser}: {active: boolean, toggleActive: () => void, updateUser: () => void}) => {
    const [ newPasswordFieldInput , setNewPasswordFieldinput ] = useState("");
    const [ newPasswordConfirmInput , setNewPasswordConfirmInput ] = useState("");
    const notificationStore = useNotification();

    const changePasswordHandler = async () => {
        try {
            await changePassword({ 
                newPassword : newPasswordFieldInput, 
                password : newPasswordConfirmInput
            });

            updateUser();
            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Success",
                type : "success",
                message : "You've successfully changed your password."
            });
        } catch (e) {
            notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Error",
                type : "danger",
                message : (e as Error).message
            });
        }
        setNewPasswordFieldinput("");
        setNewPasswordConfirmInput("");
    }
    
    return (
        <Modal className="absolute p-10 text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-greatblack" active={active}>
            <div className="absolute right-5 top-3 text-xl hover:bg-opacity-90 cursor-pointer" onClick={() => toggleActive()}>x</div>
            <h1 className="text-white font-semibold mb-2">Change your Password</h1>
                <input type="password" autoComplete="false" className="bg-newblack p-2 mb-1 text-sm w-52" name="newEmailField" aria-autocomplete="none" placeholder="New Password" onChange={(e) => setNewPasswordFieldinput(e.target.value)} value={newPasswordFieldInput}/>
                <br/>
                <input type="password" className="bg-newblack p-2 w-52 text-sm" name="pass1Field" autoComplete="new-password" placeholder="Old Password" onChange={(e) => setNewPasswordConfirmInput(e.target.value)}value={newPasswordConfirmInput}/>
                <br/>
                <Button className="mt-2 cursor-pointer" backgroundColor="coolgray" onClick={changePasswordHandler}> Change Password </Button>
        </Modal>
    );  
}

export const AccountPage = ({ user } : AccountPageProps) => {
    const [emailChangeModalActive, setEmailChangeModalActive] = useState(false);
    const [passwordChangeModalActive, setPasswordChangeModalActive] = useState(false);
    const [pfpModalActive, setPfpModalActive] = useState(false);
    const notificationStore = useNotification();
    const { updateUser } = useAuth();

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
            <ChangeProfilePictureModal updateUser={updateUser} active={pfpModalActive} setActive={setPfpModalActive} />
            <EmailChangeModal updateUser={updateUser} active={emailChangeModalActive} toggleActive={() => setEmailChangeModalActive(prev => !prev)}></EmailChangeModal>
            <PasswordChangeModal updateUser={updateUser} active={passwordChangeModalActive} toggleActive={() => setPasswordChangeModalActive(prev => !prev)} />
            <Navigation />
            {
                user &&
                <div className="font-sans mx-10 my-4">
                    <div className="bg-coolblack py-4 px-8">
                        <Title title={"Account Settings"} />
                        <div className="mb-2">
                            <UserProfilePicture fileName={user.pictureFilename} />
                            <Button className="inline-block ml-3" backgroundColor="coolgray" onClick={() => setPfpModalActive(true)}>Change</Button>
                        </div>

                        <div className="text-white mb-6">
                            <h1> <b className="font-semibold text-lightgray mr-2">Username:</b>  {user.name} </h1>
                            <h1> 
                                <b className="font-semibold text-lightgray mr-2">Email:</b>  
                                {user.email} 
                                {
                                    user.isVerified ? 
                                    <span className="text-green ml-1">{"\u2714"}</span> : 
                                    (<React.Fragment><span className="text-red ml-1 mr-2">{"\u2716"}</span><span className="text-blue hover:underline cursor-pointer" onClick={() => resendEmailHandler()}>Resend Email</span></React.Fragment>)
                                }
                                <Icon icon="bxs:edit" className="inline-block text-gray ml-2 cursor-pointer hover:text-lightgray" onClick={() => setEmailChangeModalActive(prev => !prev)}></Icon>
                            </h1>
                            <h1> <b className="font-semibold text-lightgray mr-2">Password:</b>  ******** <Icon icon="bxs:edit" className="inline-block text-gray ml-2 cursor-pointer hover:text-lightgray" onClick={() => setPasswordChangeModalActive(prev => !prev)}></Icon></h1>
                        </div>
                       
                        <div className="mt-6">
                            
                        </div>
                        
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

