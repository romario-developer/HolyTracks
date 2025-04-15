import React from 'react';
import { Box, Typography, Paper, styled } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Estilização personalizada
const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.success.main,
  margin: theme.spacing(2, 0)
}));

const CodeDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(4, 0)
}));

const QRCodeBox = styled(Paper)(({ theme }) => ({
  width: 150,
  height: 150,
  backgroundColor: '#eee',
  border: '1px solid #ddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(3)
}));

const CodeNumber = styled(Typography)(({ theme }) => ({
  fontSize: 30,
  letterSpacing: 3,
  backgroundColor: '#f0f0f0',
  padding: theme.spacing(2),
  borderRadius: 4,
  border: '1px dashed #ccc'
}));

const SyncNote = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontStyle: 'italic'
}));

const SuccessMessage = () => {
  // Em uma implementação real, este código seria gerado pelo backend
  const syncCode = '456-789';
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <SuccessIcon />
      
      <Typography variant="h4" color="success.main" gutterBottom>
        Música adicionada com sucesso!
      </Typography>
      
      <Typography variant="body1" paragraph>
        Sua música foi processada e está pronta para ser usada no App Missa.
      </Typography>
      
      <CodeDisplay>
        <QRCodeBox>
          <Typography>QR Code</Typography>
        </QRCodeBox>
        
        <CodeNumber variant="h5">
          {syncCode}
        </CodeNumber>
      </CodeDisplay>
      
      <SyncNote variant="body2">
        Use o código acima para abrir esta música diretamente no App Missa!
      </SyncNote>
    </Box>
  );
};

export default SuccessMessage;