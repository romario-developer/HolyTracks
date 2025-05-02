import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  
  // Se ainda estiver carregando, não renderiza nada
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Modificado para sempre permitir acesso, independente da autenticação
  return children;
};

export default ProtectedRoute;
