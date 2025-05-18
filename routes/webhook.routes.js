const express = require('express');
const router = express.Router();
const { Webhook } = require('svix');
const { clerkClient } = require('../config/clerk.config');

// Rota para receber webhooks do Clerk
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verificar a assinatura do webhook
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET não está configurado');
      return res.status(500).json({ error: 'Configuração de webhook ausente' });
    }
    
    // Obter cabeçalhos necessários para verificação
    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];
    
    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ error: 'Cabeçalhos de webhook ausentes' });
    }
    
    // Criar instância do webhook e verificar
    const webhook = new Webhook(webhookSecret);
    const payload = req.body;
    
    // Verificar a assinatura
    let event;
    try {
      event = webhook.verify(
        payload,
        {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        }
      );
    } catch (err) {
      console.error('Erro ao verificar webhook:', err);
      return res.status(400).json({ error: 'Assinatura de webhook inválida' });
    }
    
    // Processar o evento
    const { type, data } = event;
    
    console.log(`Evento recebido: ${type}`);
    
    // Lidar com diferentes tipos de eventos
    switch (type) {
      case 'user.created':
        // Lógica para quando um usuário é criado
        console.log('Novo usuário criado:', data.id);
        break;
        
      case 'user.deleted':
        // Lógica para quando um usuário é excluído
        console.log('Usuário excluído:', data.id);
        break;
        
      // Adicione outros casos conforme necessário
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;