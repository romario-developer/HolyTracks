// ... existing code ...

// Dentro do seu componente onde você está usando react-dropzone
const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

// Em vez de passar isDragActive diretamente para um elemento DOM
return (
  <Paper elevation={3}>
    <Box 
      sx={{ 
        padding: 3, 
        textAlign: 'center',
        // Use isDragActive para estilização em vez de passá-lo como prop
        backgroundColor: isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'inherit',
      }}
      {...getRootProps()} // Não inclua isDragActive aqui
    >
      <input {...getInputProps()} />
      {/* Resto do seu componente */}
    </Box>
  </Paper>
);

// ... existing code ...