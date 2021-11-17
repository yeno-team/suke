import { Route, Switch } from "react-router";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { UserChannelPage } from "../pages/UserChannel";

export const Routes = () => <Switch>
    <Route exact path="/">
        <h1>Hi</h1>
    </Route>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/register" component={RegisterPage} />
    <Route path="/:username" component={UserChannelPage} />
</Switch>