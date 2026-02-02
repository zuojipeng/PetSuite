export * from './Pet';
export * from './Product';
export * from './Order';
export * from './Merchant';
export * from './AIAnalysis';
export * from './NFTAsset';

// Model instances
import { PetModel } from './Pet';
import { ProductModel } from './Product';
import { OrderModel } from './Order';
import { MerchantModel } from './Merchant';
import { AIAnalysisModel } from './AIAnalysis';
import { NFTAssetModel } from './NFTAsset';

export const models = {
  Pet: PetModel,
  Product: ProductModel,
  Order: OrderModel,
  Merchant: MerchantModel,
  AIAnalysis: AIAnalysisModel,
  NFTAsset: NFTAssetModel,
};

// Initialize all indexes
export async function initializeModels(): Promise<void> {
  console.log('Initializing database models and indexes...');

  const petModel = new PetModel();
  const productModel = new ProductModel();
  const orderModel = new OrderModel();
  const merchantModel = new MerchantModel();
  const aiAnalysisModel = new AIAnalysisModel();
  const nftAssetModel = new NFTAssetModel();

  await Promise.all([
    petModel.ensureIndexes(),
    productModel.ensureIndexes(),
    orderModel.ensureIndexes(),
    merchantModel.ensureIndexes(),
    aiAnalysisModel.ensureIndexes(),
    nftAssetModel.ensureIndexes(),
  ]);

  console.log('✅ All database indexes created successfully');
}
