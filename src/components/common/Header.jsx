import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  ListItemIcon,
  styled
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../context/AuthContext';

// Estilização personalizada
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: theme.spacing(0, 1.5),
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.secondary.main,
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9
  }
}));

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  
  // Estado para controlar o menu de usuário
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Manipuladores para o menu de usuário
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Manipulador de logout
  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate('/');
  };
  
  // Manipulador para ir para a página de login
  const handleLogin = () => {
    navigate('/login');
  };
  
  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return '?';
    
    const names = currentUser.name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo/Título */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            App Missa
          </Typography>

          {/* Links de navegação */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center',
            display: { xs: 'none', md: 'flex' } 
          }}>
            <NavButton 
              component={RouterLink} 
              to="/"
            >
              Início
            </NavButton>
            
            <NavButton 
              component={RouterLink} 
              to="/library"
            >
              Minhas Músicas
            </NavButton>
            
            <NavButton 
              component={RouterLink} 
              to="/upload"
            >
              Upload
            </NavButton>
            
            <NavButton 
              component={RouterLink} 
              to="/help"
            >
              Ajuda
            </NavButton>
          </Box>

          {/* Área do usuário */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                  <UserAvatar>{getUserInitials()}</UserAvatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 180 }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                    <Typography variant="subtitle1">{currentUser?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser?.email}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <MenuItem onClick={() => { handleCloseMenu(); navigate('/profile'); }}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Meu Perfil
                  </MenuItem>
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Sair
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <NavButton 
                startIcon={<AccountCircleIcon />}
                onClick={handleLogin}
              >
                Entrar
              </NavButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;