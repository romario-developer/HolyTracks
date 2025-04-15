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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';

// Estilização personalizada
const LoginContainer = styled(Paper)(({ theme }) => ({
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

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Estados locais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Manipulador para o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/'); // Redirecionar para a página inicial após login
    } catch (error) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main">
      <LoginContainer elevation={3}>
        <IconWrapper>
          <LockOutlinedIcon />
        </IconWrapper>
        
        <Typography variant="h5" component="h1" gutterBottom>
          Entrar no App Missa
        </Typography>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Faça login para acessar suas músicas e playlists
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
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
          
          <Box mt={2}>
            <Link component={RouterLink} to="/register" variant="body2">
              Não tem uma conta? Cadastre-se
            </Link>
          </Box>
        </Form>
      </LoginContainer>
    </Container>
  );
};

export default LoginPage;