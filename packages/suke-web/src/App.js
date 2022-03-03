import React from "react"; 
import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from './context/Theme';
import { Routes } from './routes';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './hooks/useAuth';
import { NotificationProvider } from "./hooks/useNotifications";
import { SocketContextProvider } from '@suke/suke-web/src/hooks/useSocket';
import { ChannelContextProvider } from '@suke/suke-web/src/hooks/useChannel';
import { TheaterRoomContextProvider } from "@suke/suke-web/src/hooks/useTheaterRoom";

function App() {
  return (
    <BrowserRouter>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
      >
        <NotificationProvider>
          <ThemeContext.Provider value="dark">
            <AuthProvider>
              <SocketContextProvider>
                  <TheaterRoomContextProvider>
                    <ChannelContextProvider>
                      <Routes />
                    </ChannelContextProvider>
                  </TheaterRoomContextProvider>
              </SocketContextProvider>
            </AuthProvider>
          </ThemeContext.Provider>
        </NotificationProvider>
      </GoogleReCaptchaProvider>
    </BrowserRouter>
  );
}

export default App;
