import { Router, Request, Response } from 'express';
import { AIAnalysisModel } from '../models/AIAnalysis';
import { PetModel } from '../models/Pet';
import { ProductModel, ProductFilter } from '../models/Product';
import { PetProfile } from '@petsuite/shared/types/pet';

const router: Router = Router();

// POST /api/ai/recommend - AI 产品推荐
router.post('/recommend', async (req: Request, res: Response) => {
  try {
    const { petProfile, userId, query } = req.body;

    if (!petProfile || !petProfile.species) {
      return res.status(400).json({
        success: false,
        error: 'Pet profile with species is required',
      });
    }

    const startTime = Date.now();
    const aiAnalysisModel = new AIAnalysisModel();
    const productModel = new ProductModel();

    // 1. 根据宠物特征筛选产品
    const filter: ProductFilter = {
      species: petProfile.species,
      status: 'active',
    };

    // 如果有特定查询，添加标签过滤
    if (query) {
      const queryLower = query.toLowerCase();
      if (queryLower.includes('敏感') || queryLower.includes('sensitive')) {
        filter.tags = ['sensitive-stomach', 'digestive-health'];
      } else if (queryLower.includes('老年') || queryLower.includes('senior')) {
        filter.tags = ['senior'];
      } else if (queryLower.includes('幼') || queryLower.includes('puppy') || queryLower.includes('kitten')) {
        filter.tags = ['puppy', 'kitten'];
      }
    }

    let products = await productModel.findWithFilters(filter, 20);

    // 2. 过滤过敏源
    if (petProfile.allergies && petProfile.allergies.length > 0) {
      products = products.filter(product => {
        const allergyKeywords = petProfile.allergies!.map((a: string) => a.toLowerCase());
        const productText = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase();
        return !allergyKeywords.some((allergy: string) => productText.includes(allergy));
      });
    }

    // 3. 根据宠物特征评分和排序
    const scoredProducts = products.map(product => {
      let score = 50; // 基础分数
      const productText = `${product.name} ${product.description} ${product.tags.join(' ')}`.toLowerCase();

      // 年龄匹配
      if (petProfile.age) {
        if (petProfile.age < 2 && (productText.includes('puppy') || productText.includes('kitten') || productText.includes('幼'))) {
          score += 20;
        } else if (petProfile.age >= 7 && (productText.includes('senior') || productText.includes('老年'))) {
          score += 20;
        } else if (petProfile.age >= 2 && petProfile.age < 7 && (productText.includes('adult') || productText.includes('成'))) {
          score += 15;
        }
      }

      // 健康问题匹配
      if (petProfile.healthIssues && petProfile.healthIssues.length > 0) {
        petProfile.healthIssues.forEach((issue: string) => {
          if (productText.includes(issue.toLowerCase())) {
            score += 15;
          }
        });
      }

      // 健康分数影响
      if (petProfile.healthScore) {
        if (petProfile.healthScore < 60 && productText.includes('health')) {
          score += 10;
        }
      }

      // 高评分产品加分
      if (product.soldCount > 50) {
        score += 10;
      }

      // 评分归一化 (0-100)
      score = Math.min(100, Math.max(0, score));

      return {
        product,
        score,
      };
    });

    // 按评分排序
    scoredProducts.sort((a, b) => b.score - a.score);

    // 4. 生成推荐结果（取前10个）
    const recommendations = scoredProducts.slice(0, 10).map((item, index) => {
      const suitability = item.score >= 75 ? 'high' : item.score >= 50 ? 'medium' : 'low';

      // 生成推荐理由
      const pros: string[] = [];
      const cons: string[] = [];

      if (item.score >= 75) {
        pros.push('高度匹配宠物特征');
      }
      if (item.product.soldCount > 50) {
        pros.push('热门产品，用户好评');
      }
      if (item.product.nftBenefit.enabled) {
        pros.push(`NFT 会员可享 ${item.product.nftBenefit.discountPercent}% 折扣`);
      }

      const productText = `${item.product.name} ${item.product.description}`.toLowerCase();
      if (petProfile.age && petProfile.age < 2) {
        if (productText.includes('puppy') || productText.includes('kitten')) {
          pros.push('专为幼年宠物设计');
        }
      }
      if (petProfile.age && petProfile.age >= 7) {
        if (productText.includes('senior')) {
          pros.push('适合老年宠物的配方');
        }
      }

      if (item.score < 50) {
        cons.push('匹配度一般，建议咨询兽医');
      }

      return {
        rank: index + 1,
        product: {
          id: item.product._id!.toString(),
          name: item.product.name,
          brand: item.product.merchantAddress.slice(0, 6) + '...',
          price: parseFloat(item.product.price),
          category: item.product.category,
          image: item.product.images[0] || '',
        },
        score: item.score,
        reasoning: {
          pros,
          cons,
          matchDetails: `基于 ${petProfile.species === 'dog' ? '狗狗' : '猫咪'} 的年龄、健康状况和特殊需求进行智能匹配`,
        },
        suitability,
      };
    });

    // 5. 保存 AI 分析记录
    const executionTime = Date.now() - startTime;
    await aiAnalysisModel.create({
      petId: petProfile._id,
      userId: userId || 'anonymous',
      analysisType: 'recommendation',
      input: {
        petProfile,
        query,
      },
      output: {
        result: recommendations,
        reasoning: {
          totalProducts: products.length,
          filtered: scoredProducts.length,
          recommended: recommendations.length,
        },
      },
      confidence: recommendations.length > 0 ? 0.85 : 0.5,
      provider: 'rule-based',
      model: 'petsuite-v1',
      executionTime,
    });

    res.json({
      success: true,
      data: {
        recommendations,
        metadata: {
          totalScanned: products.length,
          totalRecommended: recommendations.length,
          executionTime,
          confidence: recommendations.length > 0 ? 0.85 : 0.5,
        },
      },
    });
  } catch (error: any) {
    console.error('Error in AI recommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      message: error.message,
    });
  }
});

// POST /api/ai/analyze - AI 健康分析
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { petProfile, userId } = req.body;

    if (!petProfile) {
      return res.status(400).json({
        success: false,
        error: 'Pet profile is required',
      });
    }

    const startTime = Date.now();
    const aiAnalysisModel = new AIAnalysisModel();

    // 简单的规则基础健康分析
    const healthScore = petProfile.healthScore || 75;
    let summary = '';
    let recommendation = '';
    let alert = '';

    if (healthScore >= 80) {
      summary = '您的宠物健康状况良好！';
      recommendation = '继续保持当前的喂养和护理习惯';
      alert = '无特殊警示';
    } else if (healthScore >= 60) {
      summary = '健康状况一般，需要注意';
      recommendation = '建议增加营养补充，定期体检';
      alert = '注意观察食欲和精神状态';
    } else {
      summary = '健康状况较差，需要重视';
      recommendation = '建议尽快就医，咨询专业兽医';
      alert = '警告：健康分数偏低，请及时采取措施';
    }

    // 过敏和健康问题提示
    if (petProfile.allergies && petProfile.allergies.length > 0) {
      alert += `\n注意过敏源：${petProfile.allergies.join(', ')}`;
    }

    const analysis = {
      summary,
      recommendation,
      alert,
      healthScore,
      nutritionAdvice: '根据年龄和体重选择合适的食物，保持营养均衡',
      exerciseAdvice: petProfile.species === 'dog' ? '每天至少散步30分钟' : '提供足够的玩具和活动空间',
    };

    // 保存分析记录
    const executionTime = Date.now() - startTime;
    await aiAnalysisModel.create({
      petId: petProfile._id,
      userId: userId || 'anonymous',
      analysisType: 'health',
      input: {
        petProfile,
      },
      output: {
        result: analysis,
      },
      confidence: 0.75,
      provider: 'rule-based',
      model: 'petsuite-v1',
      executionTime,
    });

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error('Error in AI analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze pet health',
      message: error.message,
    });
  }
});

// GET /api/ai/history/:userId - 获取用户的 AI 分析历史
router.get('/history/:userId', async (req: Request, res: Response) => {
  try {
    const aiAnalysisModel = new AIAnalysisModel();
    const limit = parseInt(req.query.limit as string) || 50;
    const analyses = await aiAnalysisModel.findByUser(req.params.userId, limit);

    res.json({
      success: true,
      data: analyses,
      count: analyses.length,
    });
  } catch (error: any) {
    console.error('Error fetching AI history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI history',
      message: error.message,
    });
  }
});

// GET /api/ai/analytics/:userId - 获取用户的 AI 使用分析
router.get('/analytics/:userId', async (req: Request, res: Response) => {
  try {
    const aiAnalysisModel = new AIAnalysisModel();
    const analytics = await aiAnalysisModel.getAnalyticsForUser(req.params.userId);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error('Error fetching AI analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI analytics',
      message: error.message,
    });
  }
});

export default router;
