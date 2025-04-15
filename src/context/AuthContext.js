import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  // Estado para armazenar os dados do usuário autenticado
  const [currentUser, setCurrentUser] = useState(null);
  // Estado para controlar o carregamento inicial (verificar localStorage)
  const [loading, setLoading] = useState(true);

  // Verificar se há usuário salvo no localStorage ao carregar
  useEffect(() => {
    const savedUser = localStorage.getItem('app_missa_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('app_missa_user');
      }
    }
    setLoading(false);
  }, []);

  // Função para registrar novo usuário
  const register = async (name, email, password) => {
    // Simulando uma chamada de API para registro
    // Em produção, isso seria uma chamada real a um backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: `user_${Date.now()}`,
          name,
          email,
          createdAt: new Date().toISOString(),
        };

        // Salvar no localStorage (simulando banco de dados)
        const users = JSON.parse(localStorage.getItem('app_missa_users') || '[]');
        users.push({
          ...newUser,
          password, // NOTA: Em produção, nunca armazenar senhas em texto puro!
        });
        localStorage.setItem('app_missa_users', JSON.stringify(users));

        // Definir como usuário atual e salvar a sessão
        setCurrentUser(newUser);
        localStorage.setItem('app_missa_user', JSON.stringify(newUser));

        resolve(newUser);
      }, 1000); // Simular um atraso de rede
    });
  };

  // Função para fazer login
  const login = async (email, password) => {
    // Simulando uma chamada de API para login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verificar se o usuário existe
        const users = JSON.parse(localStorage.getItem('app_missa_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          // Omitir a senha antes de armazenar na sessão
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('app_missa_user', JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Credenciais inválidas'));
        }
      }, 1000); // Simular um atraso de rede
    });
  };

  // Função para fazer logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('app_missa_user');
  };

  // Valor do contexto
  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;