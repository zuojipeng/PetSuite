import { Router, Request, Response } from 'express';
import { AgentOrchestrator } from '../agents/orchestrator/AgentOrchestrator';
import { collections } from '../database/mongodb';

const router: Router = Router();

// Initialize orchestrator
let orchestrator: AgentOrchestrator;

export function initializeOrchestrator(apiKey: string): void {
  orchestrator = new AgentOrchestrator(apiKey);
}

// POST /api/agents/profile - Create pet profile
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { name, species, age, description, healthIssues, allergies } = req.body;

    // Validate input
    if (!name || !species || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, species, description',
      });
    }

    // Execute agent
    const result = await orchestrator.createPetProfile({
      name,
      species,
      age: age || 1,
      description,
      healthIssues: healthIssues || [],
      allergies: allergies || [],
    });

    // Save to database
    if (result.success) {
      await collections.pets().insertOne({
        name: result.data.name,
        species: result.data.species,
        breed: result.data.breed,
        age: result.data.age,
        healthScore: result.data.healthScore,
        profile: result.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error in /profile:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/agents/recommend - Get product recommendations
router.post('/recommend', async (req: Request, res: Response) => {
  try {
    const { petProfile, query, budget, preferences } = req.body;

    // Validate input
    if (!petProfile || !query) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: petProfile, query',
      });
    }

    // Execute agent
    const result = await orchestrator.getProductRecommendation({
      petProfile,
      query,
      budget,
      preferences: preferences || [],
    });

    // Save to database
    if (result.success) {
      await collections.recommendations().insertOne({
        petName: petProfile.name,
        query,
        recommendations: result.data.recommendations,
        reasoning: result.reasoning,
        confidence: result.confidence,
        txHash: result.metadata.txHash,
        createdAt: new Date(),
      });
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error in /recommend:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/agents/history/:petName - Get recommendation history
router.get('/history/:petName', async (req: Request, res: Response) => {
  try {
    const { petName } = req.params;

    const history = await collections.recommendations()
      .find({ petName })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    res.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error('Error in /history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/agents/status - Get orchestrator status
router.get('/status', (req: Request, res: Response) => {
  try {
    const agents = orchestrator.getAllAgents();

    res.json({
      success: true,
      data: {
        status: 'operational',
        agents,
        timestamp: Date.now(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
