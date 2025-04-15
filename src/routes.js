import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ConfigurationPage from './pages/ConfigurationPage';
import FinalizationPage from './pages/FinalizationPage';
import PlayerPage from './pages/PlayerPage';
import LibraryPage from './pages/LibraryPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/configure" element={<ConfigurationPage />} />
      <Route path="/finalize" element={<FinalizationPage />} />
      <Route path="/player/:songId" element={<PlayerPage />} />
      <Route path="/player" element={<PlayerPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;