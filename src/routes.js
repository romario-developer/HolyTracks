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
      {/* Rotas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rotas protegidas (requerem autenticação) */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/configure" 
        element={
          <ProtectedRoute>
            <ConfigurationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/finalize" 
        element={
          <ProtectedRoute>
            <FinalizationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/player/:songId" 
        element={
          <ProtectedRoute>
            <PlayerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/player" 
        element={
          <ProtectedRoute>
            <PlayerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/library" 
        element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Rota de fallback para qualquer rota não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;