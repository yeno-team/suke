import { Route, Routes as RouterRoutes} from "react-router-dom";
import { CategoryPage } from "../pages/Category";
import { ChatEmbed } from "../pages/Embeds/Chat";
import { ExplorePage } from "../pages/Explore";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { UserChannelPage } from "../pages/UserChannel";
import { AccountPage } from "../pages/Account";
import { RequireAuthPage } from "../pages/RequireAuth";
import { VerifyEmailPage } from "../pages/VerifyEmail";
import { TheaterPage } from "../pages/Theater";
import { TheaterRoomPage } from "../pages/TheaterRoom";

export const Routes = () => <RouterRoutes>
    <Route path="/" element={<HomePage />}></Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="my/">
        <Route path="account" element={<RequireAuthPage component={<AccountPage/>}/>} />
    </Route>
    <Route path="account/">
        <Route path="verifyemail/:token" element={<VerifyEmailPage/>}/>
    </Route>
    <Route path="/:username" element={<UserChannelPage />} />
    <Route path="/categories/:categoryValue" element={<CategoryPage />} />
    <Route path="/theater" element={<TheaterPage />} />
    <Route path="/theater/:roomId" element={<TheaterRoomPage />} />
    <Route path="embed/">
        <Route path="chat/:channelId" element={<ChatEmbed/>}/>
    </Route>
    <Route path="*" element={<h1> Page is missing </h1>}/>
</RouterRoutes>
