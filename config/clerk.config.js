const { Clerk } = require('@clerk/clerk-sdk-node');

// Inicializar o cliente Clerk
const clerkClient = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Função para verificar tokens JWT
const verifyToken = async (token) => {
  try {
    const decoded = await clerkClient.verifyToken(token);
    return decoded;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
};

module.exports = {
  clerkClient,
  verifyToken
};