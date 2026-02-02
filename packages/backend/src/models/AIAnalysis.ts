import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../database/mongodb';

export type AnalysisType = 'health' | 'recommendation' | 'market' | 'other';

export interface AIAnalysisDocument {
  _id?: ObjectId;
  petId?: string;           // 关联的宠物ID（可选）
  userId?: string;          // 用户钱包地址
  analysisType: AnalysisType;
  input: {
    petProfile?: any;       // 宠物档案
    query?: string;         // 用户查询
    context?: any;          // 其他上下文
  };
  output: {
    result: any;            // 分析结果
    reasoning?: any;        // 推理过程
    recommendations?: any;  // 推荐内容
  };
  confidence?: number;      // 置信度 (0-1)
  provider: string;         // AI 提供商 (deepseek, kimi, etc.)
  model: string;            // 使用的模型
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost?: number;            // 成本（用于计费）
  timestamp: Date;
  executionTime?: number;   // 执行时间（毫秒）
}

export class AIAnalysisModel {
  private collection: Collection<AIAnalysisDocument>;

  constructor() {
    this.collection = getDB().collection<AIAnalysisDocument>('ai_analyses');
  }

  async create(analysisData: Omit<AIAnalysisDocument, '_id' | 'timestamp'>): Promise<AIAnalysisDocument> {
    const analysis: AIAnalysisDocument = {
      ...analysisData,
      timestamp: new Date(),
    };

    const result = await this.collection.insertOne(analysis as any);
    return { ...analysis, _id: result.insertedId };
  }

  async findById(id: string): Promise<AIAnalysisDocument | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByPet(petId: string, limit: number = 20): Promise<AIAnalysisDocument[]> {
    return await this.collection
      .find({ petId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  async findByUser(userId: string, limit: number = 50): Promise<AIAnalysisDocument[]> {
    return await this.collection
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  async findByType(analysisType: AnalysisType, limit: number = 50): Promise<AIAnalysisDocument[]> {
    return await this.collection
      .find({ analysisType })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  async getAnalyticsForUser(userId: string): Promise<{
    totalAnalyses: number;
    byType: Record<AnalysisType, number>;
    totalCost: number;
    avgConfidence: number;
  }> {
    const analyses = await this.findByUser(userId, 1000);

    const byType: Record<AnalysisType, number> = {
      health: 0,
      recommendation: 0,
      market: 0,
      other: 0,
    };

    let totalCost = 0;
    let totalConfidence = 0;
    let confidenceCount = 0;

    analyses.forEach(analysis => {
      byType[analysis.analysisType]++;
      if (analysis.cost) totalCost += analysis.cost;
      if (analysis.confidence !== undefined) {
        totalConfidence += analysis.confidence;
        confidenceCount++;
      }
    });

    return {
      totalAnalyses: analyses.length,
      byType,
      totalCost,
      avgConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0,
    };
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ petId: 1, timestamp: -1 });
    await this.collection.createIndex({ userId: 1, timestamp: -1 });
    await this.collection.createIndex({ analysisType: 1, timestamp: -1 });
    await this.collection.createIndex({ timestamp: -1 });
  }
}
