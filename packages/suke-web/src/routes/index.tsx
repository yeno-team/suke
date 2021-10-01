import { Route, Switch } from "react-router";
import { UserChannelPage } from "../pages/UserChannel";

export const Routes = () => <Switch>
    <Route exact path="/">
        <h1>Hi</h1>
    </Route>
    <Route path="/:username" component={UserChannelPage} />
</Switch>