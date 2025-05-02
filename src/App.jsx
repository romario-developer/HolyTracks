import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/common/Header';
import { SongProvider } from './context/SongContext';
import { AuthProvider } from './context/AuthContext';

// Páginas
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ConfigurationPage from './pages/ConfigurationPage';
import FinalizationPage from './pages/FinalizationPage';
import PlayerPage from './pages/PlayerPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Tema personalizado
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
  },
});

// Layout principal com Header
const RootLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

// Definição das rotas para o React Router v6
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'configure', element: <ConfigurationPage /> },
      { path: 'finalize', element: <FinalizationPage /> },
      { path: 'player/:songId', element: <PlayerPage /> },
      { path: 'player', element: <PlayerPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: '*', element: <HomePage /> }
    ]
  }
]);

// Componente App usando RouterProvider
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SongProvider>
          <RouterProvider 
            router={router} 
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          />
          <ToastContainer position="top-right" autoClose={5000} />
        </SongProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;