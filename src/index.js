import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  colors: {
    brand: {
      primary: '#FF57B9', // Pink color inspired by D.Va
      secondary: '#00FFFF', // Cyan color for cyberpunk aesthetic
      dark: '#1A1A2E',
    },
  },
  fonts: {
    heading: '"Orbitron", sans-serif',
    body: '"Chakra Petch", sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
); 