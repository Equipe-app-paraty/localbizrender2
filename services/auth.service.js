const { clerkClient } = require('@clerk/express');

class AuthService {
  // Obter informações do usuário atual
  static async getCurrentUser(userId) {
    if (!userId) {
      throw new Error('ID do usuário não fornecido');
    }
    
    try {
      const user = await clerkClient.users.getUser(userId);
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      throw error;
    }
  }
  
  // Verificar se o usuário tem uma determinada permissão
  static async hasPermission(userId, permission) {
    if (!userId) return false;
    
    try {
      const user = await this.getCurrentUser(userId);
      
      // Implementar lógica para verificar permissões
      // Isso dependerá de como você estrutura as permissões no Clerk
      
      return true; // Placeholder - implemente sua lógica real aqui
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  }
  
  // Obter organizações do usuário
  static async getUserOrganizations(userId) {
    if (!userId) return [];
    
    try {
      const membershipList = await clerkClient.users.getOrganizationMembershipList({ userId });
      return membershipList;
    } catch (error) {
      console.error('Erro ao obter organizações do usuário:', error);
      return [];
    }
  }
}

module.exports = AuthService;