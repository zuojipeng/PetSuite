import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../database/mongodb';
import { MerchantProfile } from '@petsuite/shared/types/user';

export interface MerchantDocument extends Omit<MerchantProfile, 'walletAddress'> {
  _id?: ObjectId;
  walletAddress: string;
}

export class MerchantModel {
  private collection: Collection<MerchantDocument>;

  constructor() {
    this.collection = getDB().collection<MerchantDocument>('merchants');
  }

  async create(merchantData: Omit<MerchantDocument, '_id' | 'createdAt' | 'updatedAt' | 'stats' | 'isVerified' | 'rating' | 'totalSales' | 'totalOrders'>): Promise<MerchantDocument> {
    const now = new Date();
    const merchant: MerchantDocument = {
      ...merchantData,
      isVerified: false,
      rating: 0,
      totalSales: 0,
      totalOrders: 0,
      stats: {
        totalRevenue: '0',
        avgOrderValue: '0',
        productCount: 0,
        customerCount: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(merchant as any);
    return { ...merchant, _id: result.insertedId };
  }

  async findByWallet(walletAddress: string): Promise<MerchantDocument | null> {
    return await this.collection.findOne({ walletAddress });
  }

  async findById(id: string): Promise<MerchantDocument | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async update(walletAddress: string, updates: Partial<MerchantDocument>): Promise<boolean> {
    const result = await this.collection.updateOne(
      { walletAddress },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async updateStats(walletAddress: string, stats: Partial<MerchantDocument['stats']>): Promise<boolean> {
    const merchant = await this.findByWallet(walletAddress);
    if (!merchant) return false;

    const updatedStats = { ...merchant.stats, ...stats };
    return await this.update(walletAddress, { stats: updatedStats });
  }

  async incrementTotalOrders(walletAddress: string, amount: number): Promise<boolean> {
    const result = await this.collection.updateOne(
      { walletAddress },
      {
        $inc: { totalOrders: 1, totalSales: amount },
        $set: { updatedAt: new Date() }
      }
    );
    return result.modifiedCount > 0;
  }

  async findVerified(limit: number = 20): Promise<MerchantDocument[]> {
    return await this.collection
      .find({ isVerified: true })
      .sort({ rating: -1, totalOrders: -1 })
      .limit(limit)
      .toArray();
  }

  async exists(walletAddress: string): Promise<boolean> {
    const count = await this.collection.countDocuments({ walletAddress });
    return count > 0;
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ walletAddress: 1 }, { unique: true });
    await this.collection.createIndex({ isVerified: 1, rating: -1 });
    await this.collection.createIndex({ category: 1 });
  }
}
