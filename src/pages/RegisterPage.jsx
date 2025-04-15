import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  styled
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../context/AuthContext';

// Estilização personalizada
const RegisterContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 450,
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: 8,
  marginTop: theme.spacing(8),
  textAlign: 'center'
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(2, 0),
  '& svg': {
    fontSize: 40,
    color: theme.palette.primary.main,
  }
}));

const Form = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  width: '100%'
}));

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Estados locais
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Manipulador para o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register(name, email, password);
      navigate('/'); // Redirecionar para a página inicial após registro
    } catch (error) {
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main">
      <RegisterContainer elevation={3}>
        <IconWrapper>
          <PersonAddIcon />
        </IconWrapper>
        
        <Typography variant="h5" component="h1" gutterBottom>
          Criar Conta no App Missa
        </Typography>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Cadastre-se para começar a gerenciar suas músicas
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Form component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome completo"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar senha"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
          </Button>
          
          <Box mt={2}>
            <Link component={RouterLink} to="/login" variant="body2">
              Já tem uma conta? Faça login
            </Link>
          </Box>
        </Form>
      </RegisterContainer>
    </Container>
  );
};

export default RegisterPage;