import { Router, Request, Response } from 'express';
import { collections } from '../database/mongodb';
import { User, CreateUserInput, UpdateUserInput, ApplyMerchantInput } from '../models/User';

const router: Router = Router();

/**
 * POST /api/users/register
 * 注册或获取用户（钱包连接时调用）
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { walletAddress, displayName, email } = req.body as CreateUserInput;

    // 验证钱包地址
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address',
      });
    }

    const usersCollection = collections.users();

    // 检查用户是否已存在
    const existingUser = await usersCollection.findOne({
      walletAddress: walletAddress.toLowerCase()
    });

    if (existingUser) {
      // 用户已存在，更新最后登录时间
      await usersCollection.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          }
        }
      );

      return res.json({
        success: true,
        data: existingUser,
        message: 'User already exists',
      });
    }

    // 创建新用户
    const newUser: User = {
      walletAddress: walletAddress.toLowerCase(),
      displayName: displayName || `User ${walletAddress.slice(0, 6)}`,
      email: email || undefined,
      roles: ['user'], // 默认角色
      preferences: {
        language: 'zh',
        currency: 'ETH',
        notifications: true,
      },
      stats: {
        petsCount: 0,
        ordersCount: 0,
        nftsCount: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    newUser._id = result.insertedId;

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('Error in /register:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:walletAddress
 * 获取用户信息
 */
router.get('/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    const usersCollection = collections.users();
    const user = await usersCollection.findOne({
      walletAddress: walletAddress.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error in GET /:walletAddress:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/users/:walletAddress
 * 更新用户信息
 */
router.put('/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const updateData = req.body as UpdateUserInput;

    const usersCollection = collections.users();

    const result = await usersCollection.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('Error in PUT /:walletAddress:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/users/:walletAddress/apply-merchant
 * 申请成为商家
 */
router.post('/:walletAddress/apply-merchant', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const { storeName, description, logo } = req.body as Omit<ApplyMerchantInput, 'walletAddress'>;

    // 验证必填字段
    if (!storeName) {
      return res.status(400).json({
        success: false,
        error: 'Store name is required',
      });
    }

    const usersCollection = collections.users();

    // 检查用户是否存在
    const user = await usersCollection.findOne({
      walletAddress: walletAddress.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // 检查是否已经是商家或已有申请
    if (user.roles.includes('merchant')) {
      return res.status(400).json({
        success: false,
        error: 'Already a merchant',
      });
    }

    if (user.merchantProfile?.applicationStatus === 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Merchant application already pending',
      });
    }

    // 创建商家申请
    const result = await usersCollection.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $set: {
          merchantProfile: {
            storeName,
            description: description || '',
            logo: logo || '',
            verified: false,
            applicationStatus: 'pending',
            applicationDate: new Date(),
          },
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );

    res.json({
      success: true,
      data: result,
      message: 'Merchant application submitted successfully',
    });
  } catch (error: any) {
    console.error('Error in /apply-merchant:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/users/:walletAddress/approve-merchant
 * 审核商家申请（管理员功能）
 */
router.post('/:walletAddress/approve-merchant', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const { approved } = req.body;

    const usersCollection = collections.users();

    const user = await usersCollection.findOne({
      walletAddress: walletAddress.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.merchantProfile || user.merchantProfile.applicationStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'No pending merchant application',
      });
    }

    // 更新申请状态
    const updateData: any = {
      'merchantProfile.applicationStatus': approved ? 'approved' : 'rejected',
      'merchantProfile.approvalDate': new Date(),
      updatedAt: new Date(),
    };

    // 如果批准，添加 merchant 角色
    if (approved) {
      updateData.$addToSet = { roles: 'merchant' };
      updateData['merchantProfile.verified'] = true;
    }

    const result = await usersCollection.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    res.json({
      success: true,
      data: result,
      message: approved ? 'Merchant approved' : 'Merchant application rejected',
    });
  } catch (error: any) {
    console.error('Error in /approve-merchant:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:walletAddress/stats
 * 获取用户统计数据
 */
router.get('/:walletAddress/stats', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    const usersCollection = collections.users();
    const petsCollection = collections.pets();
    const ordersCollection = collections.orders();
    const nftsCollection = collections.nftAssets();

    // 统计各种数据
    const [petsCount, ordersCount, nftsCount] = await Promise.all([
      petsCollection.countDocuments({ owner: walletAddress.toLowerCase() }),
      ordersCollection.countDocuments({ buyerAddress: walletAddress.toLowerCase() }),
      nftsCollection.countDocuments({ owner: walletAddress.toLowerCase() }),
    ]);

    // 更新用户统计数据
    await usersCollection.updateOne(
      { walletAddress: walletAddress.toLowerCase() },
      {
        $set: {
          stats: { petsCount, ordersCount, nftsCount },
          updatedAt: new Date(),
        }
      }
    );

    res.json({
      success: true,
      data: {
        petsCount,
        ordersCount,
        nftsCount,
      },
    });
  } catch (error: any) {
    console.error('Error in /stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
