import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from './context/Theme';
import { Routes } from './routes';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './hooks/useAuth';
import { NotificationProvider } from "./hooks/useNotifications";
import { SocketContextProvider } from '@suke/suke-web/src/hooks/useSocket';
import { ChannelContextProvider } from '@suke/suke-web/src/hooks/useChannel';

function App() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
    >
      <NotificationProvider>
        <ThemeContext.Provider value="dark">
          <BrowserRouter>
            <SocketContextProvider>
              <AuthProvider>
                <ChannelContextProvider>
                  <Routes />
                </ChannelContextProvider>
              </AuthProvider>
            </SocketContextProvider>
          </BrowserRouter>
        </ThemeContext.Provider>
      </NotificationProvider>
    </GoogleReCaptchaProvider>
  );
}

export default App;
