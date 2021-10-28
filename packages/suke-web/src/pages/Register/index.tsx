import React, { useState } from "react";
import { signup } from "../../api/user";
import { Navigation } from "../../common/Navigation"
import { Button } from "../../components/Button"

export const RegisterPage = () => {
    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const handleRegister = async () => {
        await signup({
            name: usernameInput,
            email: emailInput
        }, passwordInput);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        handleRegister();
    }

    return (
        <div>
            <Navigation />
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="bg-white p-2" type="text" name="username" placeholder="Username.."></input>
                <br />
                <label htmlFor="email">Email: </label>
                <input value={emailInput} onChange={e => setEmailInput(e.target.value)} className="bg-white p-2" type="text" name="email" placeholder="Email.."></input>
                <br />
                <label htmlFor="password">Password: </label>
                <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="bg-white p-2" type="password" name="password" placeholder="Password.."></input>
                <br />
                <Button className="block" >Sign Up</Button>
            </form>
        </div>
    )
}