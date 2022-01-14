
import { Route , Routes as ReactRoutes , Outlet, Switch } from "react-router";
import { ChatEmbed } from "../pages/Embeds/Chat";
import { Route,  } from "react-router";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { UserChannelPage } from "../pages/UserChannel";

export const Routes = () => <Switch>
    <Route exact path="/" component={HomePage}></Route>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/register" component={RegisterPage} />
    <Route path="/:username" component={UserChannelPage} />
    <Route path="embed/">
        <Route path="chat/:channelId" element={<ChatEmbed/>}/>
    </Route>
    <Route path="*" element={<h1> Page is missing </h1>}/>
</Switch>
