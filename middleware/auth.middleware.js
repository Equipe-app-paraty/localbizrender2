const { clerkMiddleware, requireAuth, getAuth } = require('@clerk/express');
const clerkConfig = require('../config/clerk.config');
const { clerkClient, verifyToken } = require('../config/clerk.config');

// Middleware básico do Clerk
const setupClerkMiddleware = () => {
  return clerkMiddleware({
    publishableKey: clerkConfig.publishableKey,
    secretKey: clerkConfig.secretKey,
    signInUrl: clerkConfig.signInUrl,
    signUpUrl: clerkConfig.signUpUrl
  });
};

// Middleware para rotas protegidas
const protectRoute = () => {
  return requireAuth({
    signInUrl: clerkConfig.signInUrl
  });
};

// Middleware para verificar permissões específicas
const checkPermission = (permission) => {
  return (req, res, next) => {
    const auth = getAuth(req);
    
    if (!auth || !auth.has({ permission })) {
      return res.status(403).json({
        message: 'Você não tem permissão para acessar este recurso'
      });
    }
    
    next();
  };
};

// Middleware para extrair o ID do usuário
const extractUserId = (req, res, next) => {
  const auth = getAuth(req);
  
  if (auth && auth.userId) {
    req.userId = auth.userId;
  }
  
  next();
};

// Middleware para verificar se o usuário é o proprietário do recurso
const isResourceOwner = (resourceModel, paramIdField = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramIdField];
      const resource = await resourceModel.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: 'Recurso não encontrado' });
      }
      
      if (resource.userId !== req.userId) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar este recurso' });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o cabeçalho de autorização está presente
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];
    
    // Verificar o token com o Clerk
    const decodedToken = await verifyToken(token);
    
    if (!decodedToken || !decodedToken.sub) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    
    // Adicionar informações do usuário ao objeto de requisição
    req.auth = {
      userId: decodedToken.sub,
      sessionId: decodedToken.sid || null,
      // Adicione outros dados conforme necessário
    };
    
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ message: 'Falha na autenticação' });
  }
};

module.exports = {
  setupClerkMiddleware,
  protectRoute,
  checkPermission,
  extractUserId,
  isResourceOwner,
  authMiddleware
}; 