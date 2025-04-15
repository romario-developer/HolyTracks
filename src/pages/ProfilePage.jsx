import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Divider,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  styled
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../context/AuthContext';

// Estilização personalizada
const ProfileContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: 8,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4)
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  fontSize: 40
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3)
}));

const ProfilePage = () => {
  const { currentUser } = useAuth();
  
  // Estados do formulário
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!name) return '?';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  // Manipulador para salvar alterações do perfil
  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    
    // Simulação de atualização do perfil
    setSaving(true);
    setError('');
    
    // Em uma aplicação real, esse seria um chamada de API
    setTimeout(() => {
      // Atualização simulada bem-sucedida
      setSuccessMessage('Perfil atualizado com sucesso!');
      setSaving(false);
    }, 1500);
  };
  
  // Manipulador para alteração de senha
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Validação de senha
    if (!currentPassword) {
      setError('A senha atual é obrigatória');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // Simulação de alteração de senha
    setSaving(true);
    setError('');
    
    // Em uma aplicação real, esse seria um chamada de API
    setTimeout(() => {
      // Alteração simulada bem-sucedida
      setSuccessMessage('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaving(false);
    }, 1500);
  };
  
  // Fechar a mensagem de sucesso
  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };
  
  return (
    <Container maxWidth="md">
      <ProfileContainer elevation={2}>
        <ProfileHeader>
          <LargeAvatar>{getUserInitials()}</LargeAvatar>
          <Typography variant="h4" gutterBottom>
            Meu Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie suas informações pessoais e senha
          </Typography>
        </ProfileHeader>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <FormSection>
          <Typography variant="h6" gutterBottom>
            Informações Pessoais
          </Typography>
          
          <Box component="form" onSubmit={handleSaveProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nome completo"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={saving}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={true} // Email não pode ser alterado neste exemplo
                  helperText="O email não pode ser alterado"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={saving ? <CircularProgress size={24} /> : <SaveIcon />}
                  disabled={saving}
                >
                  Salvar Alterações
                </Button>
              </Grid>
            </Grid>
          </Box>
        </FormSection>
        
        <Divider sx={{ my: 4 }} />
        
        <FormSection>
          <Typography variant="h6" gutterBottom>
            Alterar Senha
          </Typography>
          
          <Box component="form" onSubmit={handleChangePassword}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Senha atual"
                  type="password"
                  fullWidth
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={saving}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nova senha"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={saving}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirmar nova senha"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={saving}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={saving ? <CircularProgress size={24} /> : <SaveIcon />}
                  disabled={saving}
                >
                  Alterar Senha
                </Button>
              </Grid>
            </Grid>
          </Box>
        </FormSection>
      </ProfileContainer>
      
      {/* Snackbar para mensagens de sucesso */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;