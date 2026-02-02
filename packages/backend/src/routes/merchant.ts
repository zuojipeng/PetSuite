import { Router, Request, Response } from 'express';
import { MerchantModel } from '../models/Merchant';
import { ProductModel } from '../models/Product';
import { OrderModel } from '../models/Order';

const router: Router = Router();

// POST /api/merchant - 注册/创建商家档案
router.post('/', async (req: Request, res: Response) => {
  try {
    const merchantModel = new MerchantModel();
    const { walletAddress, storeName, description, logo, coverImage, category } = req.body;

    if (!walletAddress || !storeName) {
      return res.status(400).json({
        success: false,
        error: 'walletAddress and storeName are required',
      });
    }

    // 检查商家是否已存在
    const exists = await merchantModel.exists(walletAddress);
    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'Merchant already exists',
      });
    }

    const merchant = await merchantModel.create({
      walletAddress,
      storeName,
      description: description || '',
      logo: logo || '',
      coverImage: coverImage || '',
      category: category || [],
    });

    res.status(201).json({
      success: true,
      data: merchant,
    });
  } catch (error: any) {
    console.error('Error creating merchant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create merchant',
      message: error.message,
    });
  }
});

// GET /api/merchant/:walletAddress - 获取商家信息
router.get('/:walletAddress', async (req: Request, res: Response) => {
  try {
    const merchantModel = new MerchantModel();
    const merchant = await merchantModel.findByWallet(req.params.walletAddress);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found',
      });
    }

    res.json({
      success: true,
      data: merchant,
    });
  } catch (error: any) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch merchant',
      message: error.message,
    });
  }
});

// PUT /api/merchant/:walletAddress - 更新商家信息
router.put('/:walletAddress', async (req: Request, res: Response) => {
  try {
    const merchantModel = new MerchantModel();
    const updates = req.body;

    // 不允许更改某些字段
    delete updates.walletAddress;
    delete updates.totalSales;
    delete updates.totalOrders;
    delete updates.createdAt;

    const success = await merchantModel.update(req.params.walletAddress, updates);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found or no changes made',
      });
    }

    const updatedMerchant = await merchantModel.findByWallet(req.params.walletAddress);

    res.json({
      success: true,
      data: updatedMerchant,
    });
  } catch (error: any) {
    console.error('Error updating merchant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update merchant',
      message: error.message,
    });
  }
});

// GET /api/merchant/:walletAddress/products - 获取商家的产品列表
router.get('/:walletAddress/products', async (req: Request, res: Response) => {
  try {
    const productModel = new ProductModel();
    const products = await productModel.findByMerchant(req.params.walletAddress);

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    console.error('Error fetching merchant products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message,
    });
  }
});

// GET /api/merchant/:walletAddress/orders - 获取商家的订单列表
router.get('/:walletAddress/orders', async (req: Request, res: Response) => {
  try {
    const orderModel = new OrderModel();
    const filter: any = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await orderModel.findByMerchant(req.params.walletAddress, filter);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('Error fetching merchant orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message,
    });
  }
});

// GET /api/merchant/:walletAddress/stats - 获取商家统计数据
router.get('/:walletAddress/stats', async (req: Request, res: Response) => {
  try {
    const merchantModel = new MerchantModel();
    const productModel = new ProductModel();
    const orderModel = new OrderModel();

    const merchant = await merchantModel.findByWallet(req.params.walletAddress);
    if (!merchant) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found',
      });
    }

    // 获取产品数量
    const products = await productModel.findByMerchant(req.params.walletAddress);
    const productCount = products.length;

    // 获取销售统计
    const salesData = await orderModel.getTotalSalesByMerchant(req.params.walletAddress);

    // 更新商家统计信息
    await merchantModel.updateStats(req.params.walletAddress, {
      totalRevenue: salesData.totalRevenue,
      productCount,
      avgOrderValue: salesData.orderCount > 0
        ? (parseFloat(salesData.totalRevenue) / salesData.orderCount).toFixed(6)
        : '0',
    });

    const updatedMerchant = await merchantModel.findByWallet(req.params.walletAddress);

    res.json({
      success: true,
      data: {
        merchant: updatedMerchant,
        sales: salesData,
      },
    });
  } catch (error: any) {
    console.error('Error fetching merchant stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch merchant stats',
      message: error.message,
    });
  }
});

// GET /api/merchant/verified/list - 获取认证商家列表
router.get('/verified/list', async (req: Request, res: Response) => {
  try {
    const merchantModel = new MerchantModel();
    const limit = parseInt(req.query.limit as string) || 20;
    const merchants = await merchantModel.findVerified(limit);

    res.json({
      success: true,
      data: merchants,
      count: merchants.length,
    });
  } catch (error: any) {
    console.error('Error fetching verified merchants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verified merchants',
      message: error.message,
    });
  }
});

export default router;
