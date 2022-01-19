import React, { useState } from "react";
import { ReactNotificationOptions } from "react-notifications-component";
import { Link } from "react-router-dom";
import { Navigation } from "../../common/Navigation"
import { Button } from "../../components/Button"
import useAuth from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotifications";
import useRecaptcha from "../../hooks/useRecaptcha";

const defaultNotificationOpts : ReactNotificationOptions = {
    container : "bottom-right",
    animationIn : ["animate__animated","animate__fadeIn"],
    animationOut : ["animate__animated","animate__fadeOutDown"],
    dismiss : {
        duration : 3000,
        pauseOnHover : true,
        onScreen : true,
        showIcon : true
    }
}

export const RegisterPage = () => {
    const [ reCaptchaToken , handleReCaptchaVerify ] = useRecaptcha("login");
    const notificationStore = useNotification();
    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const { register } = useAuth();

    const handleRegister = async () => {
        await handleReCaptchaVerify()

        if(!(usernameInput)) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Error",
                type : "danger",
                message : "Please fill out the username field."            
            })
        }

        if(!(emailInput)) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Error",
                type : "danger",
                message : "Please fill out the email field."
            })
        }

        if(!(passwordInput)) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                title : "Error",
                type : "danger",
                message : "Please fill out the password field."
            })
        }

        // Need to fix this
        await register(usernameInput, emailInput, passwordInput , reCaptchaToken);

        return notificationStore.addNotification({
            ...defaultNotificationOpts,
            type : "success",
            title : "Success",
            message : "You successfully registered an account."
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleRegister();
    }

    return (
        <div className="bg-darkblack sm:bg-spaceblack h-screen flex flex-col flex-wrap">
            <Navigation position="absolute"/>
            <div className="bg-darkblack font-sans container m-auto text-lightgray text-center p-8 sm:rounded-sm sm:w-4/6 md:w-3/6 lg:w-2/5 xl:w-1/3 2xl:w-1/4">
                <h2 className="font-bold text-lg">Create a new account</h2>
                <p className="inline-block mt-2">Already got an account? <Link to="/login" className="text-teal underline">Click here.</Link></p>
                <form className="text-left mt-11 text-gray" onSubmit={handleSubmit}>
                    <label htmlFor="username" className="block text-white">Username</label>
                    <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="p-3 w-full rounded-md bg-black mb-4" type="text" name="username" placeholder="Username..."></input>
                    <label htmlFor="email" className="block text-white">Enter your Email</label>
                    <input value={emailInput} onChange={e => setEmailInput(e.target.value)} className="p-3 w-full rounded-md bg-black mb-4" type="email" name="email" placeholder="Email..." />
                    <label htmlFor="password" className="block text-white">Password</label>
                    <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="p-3 w-full rounded-md bg-black" type="password" name="password" placeholder="Password..."></input>
                    <Button className="block w-full rounded-sm py-3 px-0 mt-8" backgroundColor="blue" fontWeight="semibold">SIGN UP</Button>
                </form>
                <span className="mt-4 block text-sm">
                    The site is protected by reCAPTCHA and the Google 
                    <a href="https://policies.google.com/privacy" className="text-blue font-semibold"> Privacy Policy</a> and 
                    <a href="https://policies.google.com/terms" className="text-blue font-semibold"> Terms of Service</a> apply.
                </span>
                <Link to="/tos" className="block mt-4 text-sm text-gray">Terms of Service</Link>
            </div>
        </div>
    )
}