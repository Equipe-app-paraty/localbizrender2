const express = require('express');
const router = express.Router();
const Business = require('../models/business.model');
const authMiddleware = require('../middleware/auth.middleware');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Obter todos os negócios do usuário
router.get('/', async (req, res, next) => {
  try {
    const businesses = await Business.find({ userId: req.auth.userId });
    res.json(businesses);
  } catch (error) {
    next(error);
  }
});

// Obter um negócio específico
router.get('/:id', async (req, res, next) => {
  try {
    const business = await Business.findOne({ 
      _id: req.params.id,
      userId: req.auth.userId 
    });
    
    if (!business) {
      return res.status(404).json({ message: 'Negócio não encontrado' });
    }
    
    res.json(business);
  } catch (error) {
    next(error);
  }
});

// Criar um novo negócio
router.post('/', async (req, res, next) => {
  try {
    const newBusiness = new Business({
      ...req.body,
      userId: req.auth.userId
    });
    
    const savedBusiness = await newBusiness.save();
    res.status(201).json(savedBusiness);
  } catch (error) {
    next(error);
  }
});

// Atualizar um negócio
router.put('/:id', async (req, res, next) => {
  try {
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!business) {
      return res.status(404).json({ message: 'Negócio não encontrado' });
    }
    
    res.json(business);
  } catch (error) {
    next(error);
  }
});

// Excluir um negócio
router.delete('/:id', async (req, res, next) => {
  try {
    const business = await Business.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.auth.userId 
    });
    
    if (!business) {
      return res.status(404).json({ message: 'Negócio não encontrado' });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Alternar status de favorito
router.patch('/:id/bookmark', async (req, res, next) => {
  try {
    const business = await Business.findOne({ 
      _id: req.params.id,
      userId: req.auth.userId 
    });
    
    if (!business) {
      return res.status(404).json({ message: 'Negócio não encontrado' });
    }
    
    business.bookmarked = !business.bookmarked;
    await business.save();
    
    res.json(business);
  } catch (error) {
    next(error);
  }
});

module.exports = router;