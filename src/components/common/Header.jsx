// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Button,
  styled
} from '@mui/material';
// eslint-disable-next-line no-unused-vars
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

const Header = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  
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

          {/* Área do usuário - removida temporariamente */}
          <Box sx={{ flexGrow: 0 }}>
            {/* Botões de autenticação removidos para acesso sem autenticação */}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;