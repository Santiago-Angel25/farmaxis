import './styles/global.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from './App';
import { StoreProvider } from './context/StoreContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FluentProvider theme={webLightTheme}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </FluentProvider>
  </BrowserRouter>,
);