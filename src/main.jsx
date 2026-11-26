import './styles/global.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from './App';
import { StoreProvider } from './context/StoreContext';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FluentProvider theme={webLightTheme}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </FluentProvider>
  </BrowserRouter>,
);
