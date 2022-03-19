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
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<div className="text-2xl absolute top-5/10 left-5/10 transform -translate-x-5/10 -translate-y-5/10 text-white">Something went wrong :(</div>}>
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
    </ErrorBoundary>
  );
}

export default App;
