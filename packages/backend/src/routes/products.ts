import { Router, Request, Response } from 'express';
import { ProductModel, ProductFilter } from '../models/Product';

const router: Router = Router();

// GET /api/products - 获取产品列表（支持筛选）
router.get('/', async (req: Request, res: Response) => {
  try {
    const productModel = new ProductModel();

    const filter: ProductFilter = {};
    if (req.query.category) filter.category = req.query.category as any;
    if (req.query.merchantAddress) filter.merchantAddress = req.query.merchantAddress as string;
    if (req.query.species) filter.species = req.query.species as any;
    if (req.query.minPrice) filter.minPrice = parseFloat(req.query.minPrice as string);
    if (req.query.maxPrice) filter.maxPrice = parseFloat(req.query.maxPrice as string);
    if (req.query.tags) {
      filter.tags = (req.query.tags as string).split(',');
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const products = await productModel.findWithFilters(filter, limit, skip);

    res.json({
      success: true,
      data: products,
      count: products.length,
      filter,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message,
    });
  }
});

// GET /api/products/search - 搜索产品
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const productModel = new ProductModel();
    const limit = parseInt(req.query.limit as string) || 20;
    const products = await productModel.searchByKeyword(q, limit);

    res.json({
      success: true,
      data: products,
      count: products.length,
      query: q,
    });
  } catch (error: any) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search products',
      message: error.message,
    });
  }
});

// GET /api/products/:id - 获取产品详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const productModel = new ProductModel();
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message,
    });
  }
});

// POST /api/products - 创建产品（商家）
router.post('/', async (req: Request, res: Response) => {
  try {
    const productModel = new ProductModel();
    const { merchantAddress, ...productData } = req.body;

    if (!merchantAddress) {
      return res.status(400).json({
        success: false,
        error: 'Merchant address is required',
      });
    }

    const product = await productModel.create({
      merchantAddress,
      ...productData,
      currency: 'ETH',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message,
    });
  }
});

// PUT /api/products/:id - 更新产品
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const productModel = new ProductModel();
    const updates = req.body;

    // 不允许更改商家地址
    if (updates.merchantAddress) {
      delete updates.merchantAddress;
    }

    const success = await productModel.update(req.params.id, updates);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Product not found or no changes made',
      });
    }

    const updatedProduct = await productModel.findById(req.params.id);

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message,
    });
  }
});

// DELETE /api/products/:id - 删除产品
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productModel = new ProductModel();
    const success = await productModel.delete(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message,
    });
  }
});

export default router;
