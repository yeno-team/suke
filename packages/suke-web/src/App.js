import { BrowserRouter } from 'react-router-dom';

import { ThemeContext } from './context/Theme';
import { Routes } from './routes';
import './sass/App.scss';

function App() {
  return (
    <ThemeContext.Provider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
