// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Erros específicos do Clerk
  if (err.name === 'ClerkError') {
    return res.status(401).json({
      message: 'Erro de autenticação',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Falha na autenticação'
    });
  }
  
  // Erros de validação do Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erro de validação',
      error: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Erros de ID inválido do Mongoose
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      message: 'ID inválido',
      error: 'O ID fornecido não é válido'
    });
  }
  
  // Erro genérico
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;