import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../database/mongodb';
import { Order, OrderStatus } from '@petsuite/shared/types/product';

export interface OrderDocument extends Omit<Order, '_id'> {
  _id?: ObjectId;
}

export interface OrderFilter {
  buyerAddress?: string;
  merchantAddress?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
}

export class OrderModel {
  private collection: Collection<OrderDocument>;

  constructor() {
    this.collection = getDB().collection<OrderDocument>('orders');
  }

  async create(orderData: Omit<OrderDocument, '_id'>): Promise<OrderDocument> {
    const result = await this.collection.insertOne(orderData as any);
    return { ...orderData, _id: result.insertedId };
  }

  async findById(id: string): Promise<OrderDocument | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderDocument | null> {
    return await this.collection.findOne({ orderNumber });
  }

  async findByBuyer(buyerAddress: string, limit: number = 50): Promise<OrderDocument[]> {
    return await this.collection
      .find({ buyerAddress })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async findByMerchant(merchantAddress: string, filter?: Partial<OrderFilter>): Promise<OrderDocument[]> {
    const query: any = { merchantAddress };

    if (filter?.status) query.status = filter.status;
    if (filter?.startDate || filter?.endDate) {
      query.createdAt = {};
      if (filter.startDate) query.createdAt.$gte = filter.startDate;
      if (filter.endDate) query.createdAt.$lte = filter.endDate;
    }

    return await this.collection.find(query).sort({ createdAt: -1 }).toArray();
  }

  async updateStatus(id: string, status: OrderStatus, additionalData?: Partial<OrderDocument>): Promise<boolean> {
    const updateData: any = { status };

    if (status === 'paid' && !additionalData?.paidAt) {
      updateData.paidAt = new Date();
    }
    if (status === 'completed' && !additionalData?.completedAt) {
      updateData.completedAt = new Date();
    }
    if (status === 'cancelled' && !additionalData?.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  }

  async findByTxHash(txHash: string): Promise<OrderDocument | null> {
    return await this.collection.findOne({ txHash });
  }

  async getTotalSalesByMerchant(merchantAddress: string): Promise<{ totalRevenue: string; orderCount: number }> {
    const orders = await this.collection
      .find({
        merchantAddress,
        status: { $in: ['paid', 'completed'] },
      })
      .toArray();

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + parseFloat(order.totalAmount || '0');
    }, 0);

    return {
      totalRevenue: totalRevenue.toFixed(6),
      orderCount: orders.length,
    };
  }

  async generateOrderNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PS${year}${month}${day}${random}`;
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ buyerAddress: 1, createdAt: -1 });
    await this.collection.createIndex({ merchantAddress: 1, createdAt: -1 });
    await this.collection.createIndex({ orderNumber: 1 }, { unique: true });
    await this.collection.createIndex({ txHash: 1 });
    await this.collection.createIndex({ status: 1 });
  }
}
