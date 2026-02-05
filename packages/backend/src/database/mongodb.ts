import { MongoClient, Db } from 'mongodb';

let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/petsuite';
    const client = new MongoClient(uri);

    await client.connect();
    console.log('✅ Connected to MongoDB');

    db = client.db('petsuite');
    return db;
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

export const collections = {
  users: () => getDB().collection('users'),
  pets: () => getDB().collection('pets'),
  recommendations: () => getDB().collection('recommendations'),
  products: () => getDB().collection('products'),
  orders: () => getDB().collection('orders'),
  merchants: () => getDB().collection('merchants'),
  nftAssets: () => getDB().collection('nftAssets'),
  aiAnalysis: () => getDB().collection('aiAnalysis'),
};
