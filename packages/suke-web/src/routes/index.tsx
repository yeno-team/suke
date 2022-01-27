import { Route, Routes as RouterRoutes} from "react-router-dom";
import { CategoryPage } from "../pages/Category";
import { ChatEmbed } from "../pages/Embeds/Chat";
import { ExplorePage } from "../pages/Explore";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { UserChannelPage } from "../pages/UserChannel";

export const Routes = () => <RouterRoutes>
    <Route path="/" element={<HomePage />}></Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/:username" element={<UserChannelPage />} />
    <Route path="/categories/:categoryValue" element={<CategoryPage />} />
    <Route path="embed/">
        <Route path="chat/:channelId" element={<ChatEmbed/>}/>
    </Route>
    <Route path="*" element={<h1> Page is missing </h1>}/>
</RouterRoutes>
