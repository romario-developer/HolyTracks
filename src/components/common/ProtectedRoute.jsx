import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Se ainda estiver carregando, não renderiza nada
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Se estiver autenticado, renderiza o componente filho
  return children;
};

export default ProtectedRoute;
