import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from './context/Theme';
import { Routes } from './routes';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './hooks/useAuth';
import { SocketContextProvider } from './hooks/useSocket';
import { NotificationProvider } from "./hooks/useNotifications";

function App() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
    >
      <NotificationProvider>
        <ThemeContext.Provider value="dark">
          <BrowserRouter>
            <AuthProvider>
              <SocketContextProvider>
                <Routes />
              </SocketContextProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeContext.Provider>
      </NotificationProvider>
    </GoogleReCaptchaProvider>
  );
}

export default App;
