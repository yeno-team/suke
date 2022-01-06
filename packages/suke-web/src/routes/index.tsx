import { Route, Switch } from "react-router";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { UserChannelPage } from "../pages/UserChannel";

export const Routes = () => <Switch>
    <Route exact path="/" component={HomePage}></Route>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/register" component={RegisterPage} />
    <Route path="/:username" component={UserChannelPage} />
</Switch>