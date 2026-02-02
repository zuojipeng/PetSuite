import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../database/mongodb';

export type PetStage = 'Infant' | 'Youth' | 'Adult' | 'Senior';

export interface NFTBenefitDetails {
  discountRate: number;     // 折扣率 (0-100)
  exclusiveAccess: boolean; // 独家访问权限
  prioritySupport: boolean; // 优先客服
  customRewards: string[];  // 自定义奖励
}

export interface NFTAssetDocument {
  _id?: ObjectId;
  tokenId: string;          // NFT Token ID（链上）
  petId: string;            // 关联的宠物ID
  owner: string;            // 所有者钱包地址
  stage: PetStage;          // 当前阶段
  level: number;            // 等级 (1-100)
  experience: number;       // 经验值
  benefits: NFTBenefitDetails;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  contractAddress: string;  // 合约地址
  blockchain: 'monad-testnet' | 'monad-mainnet';
  mintedAt: Date;
  lastUpdated: Date;
  evolutionHistory: Array<{
    fromStage: PetStage;
    toStage: PetStage;
    timestamp: Date;
    txHash?: string;
  }>;
}

export class NFTAssetModel {
  private collection: Collection<NFTAssetDocument>;

  constructor() {
    this.collection = getDB().collection<NFTAssetDocument>('nft_assets');
  }

  async create(nftData: Omit<NFTAssetDocument, '_id' | 'mintedAt' | 'lastUpdated' | 'evolutionHistory'>): Promise<NFTAssetDocument> {
    const now = new Date();
    const nft: NFTAssetDocument = {
      ...nftData,
      mintedAt: now,
      lastUpdated: now,
      evolutionHistory: [],
    };

    const result = await this.collection.insertOne(nft as any);
    return { ...nft, _id: result.insertedId };
  }

  async findByTokenId(tokenId: string): Promise<NFTAssetDocument | null> {
    return await this.collection.findOne({ tokenId });
  }

  async findByOwner(owner: string): Promise<NFTAssetDocument[]> {
    return await this.collection.find({ owner }).sort({ mintedAt: -1 }).toArray();
  }

  async findByPet(petId: string): Promise<NFTAssetDocument | null> {
    return await this.collection.findOne({ petId });
  }

  async updateLevel(tokenId: string, level: number, experience: number): Promise<boolean> {
    const result = await this.collection.updateOne(
      { tokenId },
      {
        $set: {
          level,
          experience,
          lastUpdated: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async evolveStage(tokenId: string, newStage: PetStage, txHash?: string): Promise<boolean> {
    const nft = await this.findByTokenId(tokenId);
    if (!nft) return false;

    const evolutionRecord = {
      fromStage: nft.stage,
      toStage: newStage,
      timestamp: new Date(),
      txHash,
    };

    const result = await this.collection.updateOne(
      { tokenId },
      {
        $set: {
          stage: newStage,
          lastUpdated: new Date(),
        },
        $push: {
          evolutionHistory: evolutionRecord as any,
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async updateBenefits(tokenId: string, benefits: Partial<NFTBenefitDetails>): Promise<boolean> {
    const nft = await this.findByTokenId(tokenId);
    if (!nft) return false;

    const updatedBenefits = { ...nft.benefits, ...benefits };

    const result = await this.collection.updateOne(
      { tokenId },
      {
        $set: {
          benefits: updatedBenefits,
          lastUpdated: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async updateMetadata(tokenId: string, metadata: Partial<NFTAssetDocument['metadata']>): Promise<boolean> {
    const nft = await this.findByTokenId(tokenId);
    if (!nft) return false;

    const updatedMetadata = { ...nft.metadata, ...metadata };

    const result = await this.collection.updateOne(
      { tokenId },
      {
        $set: {
          metadata: updatedMetadata,
          lastUpdated: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async transferOwnership(tokenId: string, newOwner: string): Promise<boolean> {
    const result = await this.collection.updateOne(
      { tokenId },
      {
        $set: {
          owner: newOwner,
          lastUpdated: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async getStageDistribution(): Promise<Record<PetStage, number>> {
    const pipeline = [
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
        },
      },
    ];

    const results = await this.collection.aggregate(pipeline).toArray();

    const distribution: Record<PetStage, number> = {
      Infant: 0,
      Youth: 0,
      Adult: 0,
      Senior: 0,
    };

    results.forEach(result => {
      distribution[result._id as PetStage] = result.count;
    });

    return distribution;
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ tokenId: 1 }, { unique: true });
    await this.collection.createIndex({ owner: 1 });
    await this.collection.createIndex({ petId: 1 }, { unique: true });
    await this.collection.createIndex({ stage: 1 });
    await this.collection.createIndex({ mintedAt: -1 });
  }
}
