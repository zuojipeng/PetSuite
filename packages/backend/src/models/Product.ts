import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../database/mongodb';
import { Product, ProductCategory, ProductStatus } from '@petsuite/shared/types/product';

export interface ProductDocument extends Omit<Product, '_id'> {
  _id?: ObjectId;
}

export interface ProductFilter {
  category?: ProductCategory;
  merchantAddress?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  species?: 'cat' | 'dog';
}

export class ProductModel {
  private collection: Collection<ProductDocument>;

  constructor() {
    this.collection = getDB().collection<ProductDocument>('products');
  }

  async create(productData: Omit<ProductDocument, '_id' | 'createdAt' | 'updatedAt' | 'soldCount'>): Promise<ProductDocument> {
    const now = new Date();
    const product: ProductDocument = {
      ...productData,
      soldCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(product as any);
    return { ...product, _id: result.insertedId };
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByMerchant(merchantAddress: string): Promise<ProductDocument[]> {
    return await this.collection.find({ merchantAddress }).sort({ createdAt: -1 }).toArray();
  }

  async findWithFilters(filter: ProductFilter, limit: number = 50, skip: number = 0): Promise<ProductDocument[]> {
    const query: any = { status: 'active' };

    if (filter.category) query.category = filter.category;
    if (filter.merchantAddress) query.merchantAddress = filter.merchantAddress;
    if (filter.status) query.status = filter.status;
    if (filter.tags && filter.tags.length > 0) {
      query.tags = { $in: filter.tags };
    }
    if (filter.species) {
      query.tags = { $in: [filter.species] };
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice.toString();
      if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice.toString();
    }

    return await this.collection
      .find(query)
      .sort({ soldCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async update(id: string, updates: Partial<ProductDocument>): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async incrementSoldCount(id: string, quantity: number): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { soldCount: quantity, inventory: -quantity },
        $set: { updatedAt: new Date() }
      }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async searchByKeyword(keyword: string, limit: number = 20): Promise<ProductDocument[]> {
    return await this.collection
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { tags: { $in: [new RegExp(keyword, 'i')] } },
        ],
        status: 'active',
      })
      .limit(limit)
      .toArray();
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ merchantAddress: 1 });
    await this.collection.createIndex({ category: 1, status: 1 });
    await this.collection.createIndex({ tags: 1 });
    await this.collection.createIndex({ soldCount: -1 });
    await this.collection.createIndex({ name: 'text', description: 'text' });
  }
}
