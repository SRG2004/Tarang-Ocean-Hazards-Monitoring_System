import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter'
import { CombinedProvider } from './contexts/AppContext'
import './styles/globals.css'

if (window.Waves) {
  window.Waves.init();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CombinedProvider>
      <AppRouter />
    </CombinedProvider>
  </React.StrictMode>,
)
