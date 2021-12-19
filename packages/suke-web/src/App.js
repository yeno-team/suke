import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from './context/Theme';
import { Routes } from './routes';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './hooks/useAuth';
import { SocketContextProvider } from './hooks/useSocket';


function App() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LfwouIUAAAAALIs_U2Neh7ugSYE65Dh9j5Mkfcr"
    >
      <ThemeContext.Provider value="dark">
        <BrowserRouter>
          <AuthProvider>
            <SocketContextProvider>
              <Routes />
            </SocketContextProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeContext.Provider>
    </GoogleReCaptchaProvider>
  );
}

export default App;
