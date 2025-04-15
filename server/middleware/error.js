const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // Log para desenvolvimento
    console.log(err.stack);
  
    // Erro de ID do Mongoose - ID inválido
    if (err.name === 'CastError') {
      const message = 'Recurso não encontrado';
      error = { message, statusCode: 404 };
    }
  
    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = { message, statusCode: 400 };
    }
  
    // Erro de duplicação de chave do Mongoose
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `Valor duplicado para o campo '${field}'`;
      error = { message, statusCode: 400 };
    }
  
    // Responder com o erro formatado
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Erro do servidor'
    });
  };
  
  module.exports = errorHandler;