const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');

// Get all companies
router.get('/', authenticateJWT, authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get company by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;