import { Route , Routes as ReactRoutes , Outlet } from "react-router";
import { ChatEmbed } from "../pages/Embeds/Chat";
import { UserChannelPage } from "../pages/UserChannel";

export const Routes = () => <ReactRoutes> 
    <Route>
        <Route path="/" element={<Outlet/>}>
            <Route path="embed/">
                <Route path="chat/:username" element={<ChatEmbed/>}/>
            </Route>
            <Route path="*" element={<h1> Page is missing </h1>}/>
        </Route>
    </Route>
</ReactRoutes>