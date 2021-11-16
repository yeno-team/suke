import React, { useState } from "react";
import { Navigation } from "../../common/Navigation"
import { Button } from "../../components/Button"
import useAuth from "../../hooks/useAuth";

export const RegisterPage = () => {
    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const { register } = useAuth();

    const handleRegister = async () => {
        await register(usernameInput, emailInput, passwordInput);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        handleRegister();
    }

    return (
        <div className="bg-darkblack sm:bg-spaceblack h-screen flex flex-col flex-wrap">
            <Navigation position="absolute" />
            <div className="bg-darkblack font-sans container m-auto text-lightgray text-center p-8 sm:rounded-sm sm:w-4/6 md:w-3/6 lg:w-2/5 xl:w-1/3 2xl:w-1/4">
                <h2 className="font-bold text-lg">Create a new account</h2>
                <p className="inline-block mt-2">Already got an account? <a href="/login" className="text-teal underline">Click here.</a></p>
                <form className="text-left mt-11 text-gray" onSubmit={handleSubmit}>
                    <label htmlFor="username" className="block text-white">Username</label>
                    <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="p-3 w-full rounded-md bg-coolgray mb-4" type="text" name="username" placeholder="Username..."></input>
                    <label htmlFor="email" className="block text-white">Enter your Email</label>
                    <input value={emailInput} onChange={e => setEmailInput(e.target.value)} className="p-3 w-full rounded-md bg-coolgray mb-4" type="text" name="email" placeholder="Email..." />
                    <label htmlFor="password" className="block text-white">Create a new Password</label>
                    <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="p-3 w-full rounded-md bg-coolgray" type="password" name="password" placeholder="Password..."></input>
                    <Button className="block w-full rounded-sm py-3 px-0 mt-8" backgroundColor="blue" fontWeight="semibold">SIGN UP</Button>
                </form>
                <a href="/tos" className="block mt-4 text-sm text-gray">Terms of Service</a>
            </div>
        </div>
    )
}