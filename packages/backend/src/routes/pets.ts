import { Router, Request, Response } from 'express';
import { PetModel } from '../models/Pet';

const router: Router = Router();

// POST /api/pets - 创建宠物档案
router.post('/', async (req: Request, res: Response) => {
  try {
    const petModel = new PetModel();
    const { owner, ...petData } = req.body;

    if (!owner) {
      return res.status(400).json({
        success: false,
        error: 'Owner wallet address is required',
      });
    }

    const pet = await petModel.create({
      ...petData,
      owner,
    });

    res.status(201).json({
      success: true,
      data: pet,
    });
  } catch (error: any) {
    console.error('Error creating pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pet profile',
      message: error.message,
    });
  }
});

// GET /api/pets/:id - 获取宠物详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const petModel = new PetModel();
    const pet = await petModel.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    res.json({
      success: true,
      data: pet,
    });
  } catch (error: any) {
    console.error('Error fetching pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pet profile',
      message: error.message,
    });
  }
});

// GET /api/pets/owner/:address - 获取用户的所有宠物
router.get('/owner/:address', async (req: Request, res: Response) => {
  try {
    const petModel = new PetModel();
    const pets = await petModel.findByOwner(req.params.address);

    res.json({
      success: true,
      data: pets,
      count: pets.length,
    });
  } catch (error: any) {
    console.error('Error fetching pets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pets',
      message: error.message,
    });
  }
});

// PUT /api/pets/:id - 更新宠物信息
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const petModel = new PetModel();
    const { owner, ...updates } = req.body;

    // 不允许更改所有者
    if (owner) {
      delete updates.owner;
    }

    const success = await petModel.update(req.params.id, updates);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found or no changes made',
      });
    }

    const updatedPet = await petModel.findById(req.params.id);

    res.json({
      success: true,
      data: updatedPet,
    });
  } catch (error: any) {
    console.error('Error updating pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pet profile',
      message: error.message,
    });
  }
});

// DELETE /api/pets/:id - 删除宠物档案
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const petModel = new PetModel();
    const success = await petModel.delete(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    res.json({
      success: true,
      message: 'Pet profile deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting pet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete pet profile',
      message: error.message,
    });
  }
});

export default router;
