import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente para proteger rotas que exigem autenticação
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Se ainda está carregando, não renderiza nada (ou poderia mostrar um spinner)
  if (loading) {
    return null;
  }

  // Se não estiver autenticado, redireciona para a página de login
  // e mantém o estado da URL atual para redirecionar de volta após o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo protegido
  return children;
};

export default ProtectedRoute;