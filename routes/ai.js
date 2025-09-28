
import express from 'express';
import { getAIService } from '../services/aiIntelligenceService.js';
import { authenticateToken as auth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/ai/analyze
// @desc    Analyze a hazard report
// @access  Private
router.post('/analyze', auth, async (req, res) => {
  try {
    const aiService = getAIService();
    const { reportData } = req.body;

    if (!reportData) {
      return res.status(400).json({ msg: 'reportData is required' });
    }

    const analysis = await aiService.analyzeHazardReport(reportData);
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ai/health
// @desc    Health check for AI services
// @access  Public
router.get('/health', async (req, res) => {
  try {
    const aiService = getAIService();
    const health = await aiService.healthCheck();
    res.json(health);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
