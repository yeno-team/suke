import { Route , Routes as ReactRoutes , Outlet } from "react-router";
import { ChatEmbed } from "../pages/Embeds/Chat";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { UserChannelPage } from "../pages/UserChannel";

export const Routes = () => <ReactRoutes> 
    <Route path="/" element={<Outlet/>}>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/:username" element={<UserChannelPage/>}/>
        <Route path="embed/">
            <Route path="chat/:channelId" element={<ChatEmbed/>}/>
        </Route>
        <Route path="*" element={<h1> Page is missing </h1>}/>
    </Route>
</ReactRoutes>