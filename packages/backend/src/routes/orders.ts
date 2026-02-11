import { Router, Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { NFTAssetModel } from '../models/NFTAsset';
import { OrderStatus } from '@petsuite/shared/types/product';

const router: Router = Router();

// POST /api/orders - 创建订单
router.post('/', async (req: Request, res: Response) => {
  try {
    const orderModel = new OrderModel();
    const productModel = new ProductModel();
    const nftAssetModel = new NFTAssetModel();

    const { buyerAddress, productId, quantity, nftTokenId, items } = req.body;
    const normalizedProductId = productId || (Array.isArray(items) ? items[0]?.productId : undefined);
    const normalizedQuantity = quantity || (Array.isArray(items) ? items[0]?.quantity : undefined);

    if (!buyerAddress || !normalizedProductId || !normalizedQuantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: buyerAddress, productId, quantity',
      });
    }

    // 获取产品信息
    const product = await productModel.findById(normalizedProductId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // 检查库存
    if (product.inventory < normalizedQuantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient inventory',
        available: product.inventory,
      });
    }

    // 计算价格
    const unitPrice = parseFloat(product.price);
    let originalAmount = unitPrice * normalizedQuantity;
    let discountPercent = 0;
    let appliedNFT = false;

    // 应用 NFT 折扣（如果提供了 NFT Token ID）
    if (nftTokenId && product.nftBenefit.enabled) {
      const nft = await nftAssetModel.findByTokenId(nftTokenId);
      if (nft && nft.owner === buyerAddress) {
        discountPercent = Math.max(
          product.nftBenefit.discountPercent,
          nft.benefits.discountRate
        );
        appliedNFT = true;
      }
    }

    const discountAmount = originalAmount * (discountPercent / 100);
    const totalAmount = originalAmount - discountAmount;

    // 生成订单号
    const orderNumber = await orderModel.generateOrderNumber();

    // 创建订单
    const order = await orderModel.create({
      orderNumber,
      buyerAddress,
      merchantAddress: product.merchantAddress,
      productId: normalizedProductId,
      productSnapshot: {
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        category: product.category,
      },
      quantity: normalizedQuantity,
      totalAmount: totalAmount.toFixed(6),
      originalAmount: originalAmount.toFixed(6),
      discount: {
        applied: appliedNFT,
        nftTokenId: appliedNFT ? nftTokenId : undefined,
        discountPercent,
        savedAmount: discountAmount.toFixed(6),
      },
      status: 'pending',
      blockchain: 'monad-testnet',
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message,
    });
  }
});

// GET /api/orders/:id - 获取订单详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const orderModel = new OrderModel();
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message,
    });
  }
});

// GET /api/orders/buyer/:address - 获取买家订单列表
router.get('/buyer/:address', async (req: Request, res: Response) => {
  try {
    const orderModel = new OrderModel();
    const limit = parseInt(req.query.limit as string) || 50;
    const orders = await orderModel.findByBuyer(req.params.address, limit);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message,
    });
  }
});

// GET /api/orders/merchant/:address - 获取商家订单列表
router.get('/merchant/:address', async (req: Request, res: Response) => {
  try {
    const orderModel = new OrderModel();
    const filter: any = {};

    if (req.query.status) {
      filter.status = req.query.status as OrderStatus;
    }

    const orders = await orderModel.findByMerchant(req.params.address, filter);

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

// PUT /api/orders/:id/status - 更新订单状态
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const orderModel = new OrderModel();
    const productModel = new ProductModel();
    const { status, txHash } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    const additionalData: any = {};
    if (txHash) additionalData.txHash = txHash;

    // 如果订单状态变为 paid，更新产品库存
    if (status === 'paid' && order.status === 'pending') {
      await productModel.incrementSoldCount(order.productId, order.quantity);
    }

    const success = await orderModel.updateStatus(req.params.id, status, additionalData);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update order status',
      });
    }

    const updatedOrder = await orderModel.findById(req.params.id);

    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: error.message,
    });
  }
});

// GET /api/orders/number/:orderNumber - 通过订单号查询
router.get('/number/:orderNumber', async (req: Request, res: Response) => {
  try {
    const orderModel = new OrderModel();
    const order = await orderModel.findByOrderNumber(req.params.orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message,
    });
  }
});

export default router;
