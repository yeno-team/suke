import React, { useState } from "react";
import { Navigation } from "../../common/Navigation"
import { Button } from "../../components/Button"
import { login } from '../../api/auth';

export const LoginPage = () => {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const handleLogin = async () => {
        await login(usernameInput, passwordInput);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        handleLogin();
    }

    return (
        <div>
            <Navigation />
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="bg-white p-2" type="text" name="username" placeholder="Username.."></input>
                <br />
                <label htmlFor="password">Password: </label>
                <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="bg-white p-2" type="password" name="password" placeholder="Password.."></input>
                <br />
                <Button className="block" >Login</Button>
            </form>
        </div>
    )
}