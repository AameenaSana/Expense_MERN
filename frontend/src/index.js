import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalProvider } from './context/globalContext';
import { ThemeProvider } from './context/themeContext';
import { GlobalStyle } from './styles/GlobalStyle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ThemeProvider>
  </React.StrictMode>
);

