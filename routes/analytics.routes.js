const express = require('express');
const router = express.Router();
const Business = require('../models/business.model');
const authMiddleware = require('../middleware/auth.middleware');

// Aplicar middleware de autenticação
router.use(authMiddleware);

// Obter estatísticas gerais
router.get('/', async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    
    // Total de negócios
    const totalBusinesses = await Business.countDocuments({ userId });
    
    // Negócios com website
    const withWebsite = await Business.countDocuments({ 
      userId, 
      website: { $exists: true, $ne: '' } 
    });
    
    // Negócios com telefone
    const withPhone = await Business.countDocuments({ 
      userId, 
      phone: { $exists: true, $ne: '' } 
    });
    
    // Negócios salvos como favoritos
    const savedLeads = await Business.countDocuments({ 
      userId, 
      bookmarked: true 
    });
    
    // Estatísticas por tipo de negócio
    const businessTypeStats = await Business.aggregate([
      { $match: { userId } },
      { $group: { _id: '$businessType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Estatísticas por cidade
    const cityStats = await Business.aggregate([
      { $match: { userId } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalBusinesses,
      withWebsite,
      withPhone,
      savedLeads,
      businessTypeStats,
      cityStats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;