import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "../../common/Navigation"
import { Button } from "../../components/Button"
import useAuth from "../../hooks/useAuth";
import useRecaptcha from "../../hooks/useRecaptcha";
import { defaultNotificationOpts, useNotification } from "../../hooks/useNotifications";

export const LoginPage = () => {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [ reCaptchaToken , handleReCaptchaVerify ] = useRecaptcha("login");
    const notificationStore = useNotification();
    const { login, user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user?.id !== 0) {
            navigate("/");
        }
    }, [navigate, user])
    

    const handleLogin = async () => {
        await handleReCaptchaVerify();

        if(!(usernameInput)) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : "Please fill out the username field."
            });
        }

        if(!(passwordInput)) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : "Please fill out the password field."
            });
        }

        
        const success = await login(usernameInput, passwordInput , reCaptchaToken);

        if (!success) {
            return notificationStore.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : "Incorrect Login Details."
            });
        }

        return notificationStore.addNotification({
            ...defaultNotificationOpts,
            type : "success",
            title : "Success",
            message : "You've successfully logged in."
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        handleLogin();
    }

    return (
        <div className="bg-darkblack sm:bg-spaceblack h-screen flex flex-col flex-wrap">
            <Navigation position="absolute" />
            <div className="bg-darkblack font-sans container m-auto text-lightgray text-center p-8 sm:rounded-sm sm:w-4/6 md:w-3/6 lg:w-2/5 xl:w-1/3 2xl:w-1/4">
                <h2 className="font-bold text-lg">Login to Suke</h2>
                <p className="inline-block mt-2">Forgot your password? <a href="/forgot-password" className="text-teal underline">Click here.</a></p>
                <form className="text-left mt-11 text-gray" onSubmit={handleSubmit}>
                    <label htmlFor="username" className="block text-white">Username</label>
                    <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="p-3 w-full rounded-md bg-black mb-4" type="text" name="username" placeholder="Username..."></input>
                    <label htmlFor="password" className="block text-white">Password</label>
                    <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="p-3 w-full rounded-md bg-black" type="password" name="password" placeholder="Password..."></input>
                    <input type="checkbox" name="remember" value="remember" className="mt-3 mr-2"></input>
                    <label htmlFor="remember" className="text-sm">Remember me</label>
                    <Button className="block w-full rounded-sm py-3 px-0 mt-8" backgroundColor="blue" fontWeight="semibold">LOGIN</Button>
                </form>
                <span className="mt-4 block text-sm">
                    The site is protected by reCAPTCHA and the Google 
                    <a href="https://policies.google.com/privacy" className="text-blue font-semibold"> Privacy Policy</a> and 
                    <a href="https://policies.google.com/terms" className="text-blue font-semibold"> Terms of Service</a> apply.
                </span>
                <Link to="/register" className="block mt-4 text-sm text-gray">Don't have an account?</Link>
            </div>
        </div>
    )
}