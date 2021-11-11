import { BrowserRouter } from 'react-router-dom';
import { ThemeContext } from './context/Theme';
import { Routes } from './routes';
import { AuthProvider } from './hooks/useAuth';
import { SocketContextProvider } from './hooks/useSocket';


function App() {
  return (
    <ThemeContext.Provider value="dark">
      <BrowserRouter>
        <AuthProvider>
          <SocketContextProvider>
            <Routes />
          </SocketContextProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
