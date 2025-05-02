import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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

// Componente de rota protegida
import ProtectedRoute from './components/common/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Todas as rotas são públicas agora */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/configure" element={<ConfigurationPage />} />
      <Route path="/finalize" element={<FinalizationPage />} />
      <Route path="/player/:songId" element={<PlayerPage />} />
      <Route path="/player" element={<PlayerPage />} />
      <Route path="/library" element={<LibraryPage />} />
      
      {/* Rota de fallback para qualquer rota não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;