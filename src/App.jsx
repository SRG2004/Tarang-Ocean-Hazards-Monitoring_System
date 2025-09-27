import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './AppRouter';
import './styles/globals.css';

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
