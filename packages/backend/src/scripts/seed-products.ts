import { connectDB } from '../database/mongodb';
import { ProductModel } from '../models/Product';
import { ProductCategory } from '@petsuite/shared/types/product';

const SAMPLE_MERCHANT = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'; // 示例商家地址

interface ProductSeed {
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  images: string[];
  inventory: number;
  tags: string[];
  nftBenefit: {
    enabled: boolean;
    discountPercent: number;
  };
}

const dogProducts: ProductSeed[] = [
  // 狗粮类
  {
    name: '皇家狗粮 Royal Canin - 成犬配方',
    description: '适合1-7岁成年犬，均衡营养配方，含优质蛋白质和必需脂肪酸，支持皮肤和毛发健康。',
    category: 'food',
    price: '0.05',
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'],
    inventory: 100,
    tags: ['dog', 'food', 'adult', 'royal-canin', 'premium'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '希尔斯 Hill\'s Science Diet - 敏感肠胃配方',
    description: '专为敏感肠胃狗狗设计，易消化配方，不含人工色素和香料，帮助改善消化健康。',
    category: 'food',
    price: '0.06',
    images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400'],
    inventory: 80,
    tags: ['dog', 'food', 'sensitive-stomach', 'hills', 'digestive-health'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },
  {
    name: 'Orijen 渴望 - 六种鱼犬粮（无谷配方）',
    description: '高蛋白无谷配方，含85%优质鱼肉，富含Omega-3脂肪酸，适合所有年龄段的狗狗。',
    category: 'food',
    price: '0.08',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400'],
    inventory: 50,
    tags: ['dog', 'food', 'grain-free', 'high-protein', 'orijen', 'fish'],
    nftBenefit: { enabled: true, discountPercent: 15 },
  },
  {
    name: '蓝爵 Blue Buffalo - 幼犬成长配方',
    description: '专为幼犬设计，含DHA促进大脑和眼睛发育，添加益生菌支持免疫系统。',
    category: 'food',
    price: '0.045',
    images: ['https://images.unsplash.com/photo-1558929996-da64ba858215?w=400'],
    inventory: 120,
    tags: ['dog', 'food', 'puppy', 'blue-buffalo', 'brain-development'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '冠能 Pro Plan - 老年犬关节护理配方',
    description: '为7岁以上老年犬设计，添加葡萄糖胺和软骨素，支持关节健康和活动能力。',
    category: 'food',
    price: '0.055',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400'],
    inventory: 70,
    tags: ['dog', 'food', 'senior', 'joint-care', 'pro-plan'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },

  // 狗零食类
  {
    name: 'Zuke\'s Mini Naturals - 鸡肉训练零食',
    description: '低卡路里迷你零食，适合训练使用，100%天然成分，不含小麦、玉米和大豆。',
    category: 'food',
    price: '0.012',
    images: ['https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400'],
    inventory: 200,
    tags: ['dog', 'treats', 'training', 'low-calorie', 'natural'],
    nftBenefit: { enabled: true, discountPercent: 8 },
  },
  {
    name: '牛肉干 Beef Jerky - 纯天然风干',
    description: '100%纯牛肉制成，无添加剂，富含蛋白质，适合各种体型的狗狗。',
    category: 'food',
    price: '0.018',
    images: ['https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400'],
    inventory: 150,
    tags: ['dog', 'treats', 'beef', 'protein', 'natural'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },

  // 玩具类
  {
    name: 'KONG Classic - 经典耐咬玩具（大号）',
    description: '耐用橡胶材质，可填充零食增加趣味性，帮助清洁牙齿，缓解焦虑。',
    category: 'toy',
    price: '0.015',
    images: ['https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=400'],
    inventory: 100,
    tags: ['dog', 'toy', 'chew', 'kong', 'dental-health'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: 'Chuckit! 网球发射器套装',
    description: '包含发射器和3个网球，让你不用弯腰就能扔球，增加互动距离和乐趣。',
    category: 'toy',
    price: '0.022',
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'],
    inventory: 80,
    tags: ['dog', 'toy', 'fetch', 'outdoor', 'exercise'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '智能拼图玩具 - 觅食训练器',
    description: '益智互动玩具，可调节难度等级，让狗狗通过嗅觉和智力获取零食奖励。',
    category: 'toy',
    price: '0.028',
    images: ['https://images.unsplash.com/photo-1535284252726-db6fa1ec1e37?w=400'],
    inventory: 60,
    tags: ['dog', 'toy', 'puzzle', 'interactive', 'mental-stimulation'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },
  {
    name: '发声毛绒玩具 - 小鸭子',
    description: '柔软毛绒材质，内置发声器，满足狗狗啃咬和玩耍需求，适合小型犬。',
    category: 'toy',
    price: '0.008',
    images: ['https://images.unsplash.com/photo-1603003388852-ac9eb5fe0d4f?w=400'],
    inventory: 120,
    tags: ['dog', 'toy', 'plush', 'squeaky', 'small-dog'],
    nftBenefit: { enabled: true, discountPercent: 8 },
  },

  // 健康护理类
  {
    name: 'Cosequin DS - 狗狗关节保健品',
    description: '含葡萄糖胺和软骨素，支持关节健康，改善活动能力，适合所有年龄段狗狗。',
    category: 'health',
    price: '0.042',
    images: ['https://images.unsplash.com/photo-1629965811158-6a9f0b573c19?w=400'],
    inventory: 90,
    tags: ['dog', 'health', 'supplement', 'joint-care', 'mobility'],
    nftBenefit: { enabled: true, discountPercent: 15 },
  },
  {
    name: '鱼油软胶囊 Omega-3',
    description: '富含EPA和DHA，支持皮肤、毛发、心脏和大脑健康，易于喂食。',
    category: 'health',
    price: '0.025',
    images: ['https://images.unsplash.com/photo-1585763964925-0c03e1d9e513?w=400'],
    inventory: 110,
    tags: ['dog', 'health', 'supplement', 'omega-3', 'skin-health'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '益生菌粉 - 肠道健康',
    description: '含多种益生菌菌株，支持消化系统健康，改善肠道菌群平衡。',
    category: 'health',
    price: '0.032',
    images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'],
    inventory: 75,
    tags: ['dog', 'health', 'supplement', 'probiotic', 'digestive-health'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },
  {
    name: '驱虫药 Bravecto - 口服片剂',
    description: '长效口服驱虫药，12周持续保护，预防跳蚤和蜱虫，适合中型犬。',
    category: 'health',
    price: '0.048',
    images: ['https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=400'],
    inventory: 50,
    tags: ['dog', 'health', 'medication', 'flea-tick', 'prevention'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },

  // 配件类
  {
    name: 'Ruffwear Front Range 舒适胸背带',
    description: '防拉扯设计，透气网面材质，双扣安全锁，适合日常散步和户外探险。',
    category: 'accessory',
    price: '0.038',
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'],
    inventory: 85,
    tags: ['dog', 'accessory', 'harness', 'outdoor', 'comfort'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '自动伸缩牵引绳 - 5米',
    description: '单手操作，一键锁定，360度防缠绕，适合中小型犬，承重25kg。',
    category: 'accessory',
    price: '0.018',
    images: ['https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400'],
    inventory: 100,
    tags: ['dog', 'accessory', 'leash', 'retractable', 'walking'],
    nftBenefit: { enabled: true, discountPercent: 8 },
  },
  {
    name: '自动饮水器 - 2L大容量',
    description: '重力自动出水，保持水质清洁，防溢设计，适合多只宠物家庭。',
    category: 'accessory',
    price: '0.022',
    images: ['https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400'],
    inventory: 95,
    tags: ['dog', 'accessory', 'water-dispenser', 'automatic', 'large-capacity'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '宠物床垫 - 记忆棉材质（L号）',
    description: '高密度记忆棉，贴合身体曲线，缓解关节压力，可拆洗外套，适合大型犬。',
    category: 'accessory',
    price: '0.058',
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'],
    inventory: 40,
    tags: ['dog', 'accessory', 'bed', 'memory-foam', 'comfort', 'large-dog'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },
];

const catProducts: ProductSeed[] = [
  // 猫粮类
  {
    name: '皇家猫粮 Royal Canin - 室内成猫配方',
    description: '专为室内猫设计，控制卡路里摄入，减少粪便异味，支持毛球排出。',
    category: 'food',
    price: '0.045',
    images: ['https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400'],
    inventory: 110,
    tags: ['cat', 'food', 'indoor', 'adult', 'royal-canin'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '希尔斯 Hill\'s Science Diet - 泌尿道健康配方',
    description: '支持泌尿系统健康，平衡矿物质含量，预防尿路结石，适合成年猫。',
    category: 'food',
    price: '0.052',
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'],
    inventory: 85,
    tags: ['cat', 'food', 'urinary-health', 'hills', 'adult'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },
  {
    name: '渴望 Orijen - 六种鱼猫粮（无谷配方）',
    description: '高蛋白无谷配方，含85%鱼肉，模拟自然饮食，富含Omega-3，适合所有年龄。',
    category: 'food',
    price: '0.075',
    images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400'],
    inventory: 55,
    tags: ['cat', 'food', 'grain-free', 'high-protein', 'orijen', 'fish'],
    nftBenefit: { enabled: true, discountPercent: 15 },
  },
  {
    name: 'Wellness Core - 幼猫成长配方',
    description: '高蛋白配方，含DHA支持大脑发育，易消化，为幼猫提供全面营养。',
    category: 'food',
    price: '0.048',
    images: ['https://images.unsplash.com/photo-1558929996-da64ba858215?w=400'],
    inventory: 100,
    tags: ['cat', 'food', 'kitten', 'high-protein', 'wellness'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '冠能 Pro Plan - 老年猫肾脏护理配方',
    description: '为7岁以上老年猫设计，低磷配方保护肾脏，添加抗氧化剂支持免疫系统。',
    category: 'food',
    price: '0.055',
    images: ['https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400'],
    inventory: 70,
    tags: ['cat', 'food', 'senior', 'kidney-care', 'pro-plan'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },

  // 猫零食类
  {
    name: 'Churu 啾噜 - 鸡肉泥零食（20支装）',
    description: '日本进口液体零食，高含水量，适合补充水分，可用于喂药，猫咪最爱。',
    category: 'food',
    price: '0.015',
    images: ['https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400'],
    inventory: 180,
    tags: ['cat', 'treats', 'liquid', 'hydration', 'japanese'],
    nftBenefit: { enabled: true, discountPercent: 8 },
  },
  {
    name: '冻干鸡肉粒 - 纯天然',
    description: '100%纯鸡肉冻干，保留营养，无添加剂，适合训练奖励或拌粮食用。',
    category: 'food',
    price: '0.020',
    images: ['https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400'],
    inventory: 130,
    tags: ['cat', 'treats', 'freeze-dried', 'chicken', 'natural'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '化毛膏 - 麦芽口味',
    description: '帮助排出毛球，润滑肠道，预防毛球症，适合长毛猫和换毛季使用。',
    category: 'health',
    price: '0.018',
    images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400'],
    inventory: 95,
    tags: ['cat', 'health', 'hairball', 'digestive-aid', 'supplement'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },

  // 玩具类
  {
    name: '自动逗猫棒 - 智能感应',
    description: '自动模式和手动模式切换，羽毛和铃铛设计，激发猫咪狩猎本能。',
    category: 'toy',
    price: '0.025',
    images: ['https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=400'],
    inventory: 80,
    tags: ['cat', 'toy', 'interactive', 'automatic', 'feather'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '猫抓板 - 瓦楞纸材质（带猫薄荷）',
    description: '环保瓦楞纸材质，耐用耐抓，附赠猫薄荷，保护家具，满足猫咪磨爪需求。',
    category: 'toy',
    price: '0.012',
    images: ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400'],
    inventory: 150,
    tags: ['cat', 'toy', 'scratcher', 'cardboard', 'catnip'],
    nftBenefit: { enabled: true, discountPercent: 8 },
  },
  {
    name: '猫隧道 - 可折叠（3通道）',
    description: '多通道设计，带悬挂玩具球，可折叠收纳，适合多只猫咪玩耍和躲藏。',
    category: 'toy',
    price: '0.022',
    images: ['https://images.unsplash.com/photo-1535284252726-db6fa1ec1e37?w=400'],
    inventory: 70,
    tags: ['cat', 'toy', 'tunnel', 'foldable', 'multi-cat'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '激光逗猫器 - USB充电',
    description: '自动模式和手动模式，多种移动轨迹，USB充电，长续航，适合独居猫咪。',
    category: 'toy',
    price: '0.018',
    images: ['https://images.unsplash.com/photo-1603003388852-ac9eb5fe0d4f?w=400'],
    inventory: 90,
    tags: ['cat', 'toy', 'laser', 'automatic', 'rechargeable'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },

  // 健康护理类
  {
    name: 'Purina Fortiflora - 猫用益生菌',
    description: '含肠道益生菌，支持消化健康，增强免疫力，适合敏感肠胃或应激期猫咪。',
    category: 'health',
    price: '0.038',
    images: ['https://images.unsplash.com/photo-1629965811158-6a9f0b573c19?w=400'],
    inventory: 85,
    tags: ['cat', 'health', 'supplement', 'probiotic', 'digestive-health'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },
  {
    name: '猫用鱼油 Omega-3',
    description: '支持皮肤、毛发和心脏健康，改善毛色光泽，液体配方易于喂食。',
    category: 'health',
    price: '0.028',
    images: ['https://images.unsplash.com/photo-1585763964925-0c03e1d9e513?w=400'],
    inventory: 100,
    tags: ['cat', 'health', 'supplement', 'omega-3', 'skin-health'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
  {
    name: '猫用体外驱虫滴剂 - Revolution',
    description: '滴剂设计，使用方便，预防跳蚤、耳螨和肠道寄生虫，月度使用。',
    category: 'health',
    price: '0.045',
    images: ['https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=400'],
    inventory: 65,
    tags: ['cat', 'health', 'medication', 'flea-tick', 'prevention'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },

  // 配件类
  {
    name: '全封闭猫砂盆 - 特大号（带除臭滤芯）',
    description: '全封闭设计，防止砂粒外溅，活性炭除臭滤芯，顶部进出，适合大型猫。',
    category: 'accessory',
    price: '0.048',
    images: ['https://images.unsplash.com/photo-1544819667-87a5fc64fe29?w=400'],
    inventory: 60,
    tags: ['cat', 'accessory', 'litter-box', 'enclosed', 'odor-control'],
    nftBenefit: { enabled: true, discountPercent: 12 },
  },
  {
    name: '猫砂 - 豆腐砂（原味，6L）',
    description: '可冲厕所，低粉尘，强吸水，天然豆腐渣制成，环保无毒，除臭效果好。',
    category: 'accessory',
    price: '0.015',
    images: ['https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400'],
    inventory: 200,
    tags: ['cat', 'accessory', 'litter', 'tofu', 'flushable', 'eco-friendly'],
    nftBenefit: { enabled: true, discountPercent: 8 },
  },
  {
    name: '猫爬架 - 多层豪华版（120cm）',
    description: '稳固底座，多层平台，剑麻柱，吊床和猫窝，满足猫咪攀爬、磨爪和休息需求。',
    category: 'accessory',
    price: '0.088',
    images: ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400'],
    inventory: 35,
    tags: ['cat', 'accessory', 'cat-tree', 'multi-level', 'scratching-post'],
    nftBenefit: { enabled: true, discountPercent: 15 },
  },
  {
    name: '自动饮水机 - 循环过滤（2.5L）',
    description: '循环过滤系统，保持水质新鲜，静音设计，LED灯提示，鼓励猫咪多喝水。',
    category: 'accessory',
    price: '0.035',
    images: ['https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400'],
    inventory: 75,
    tags: ['cat', 'accessory', 'water-fountain', 'filter', 'automatic'],
    nftBenefit: { enabled: true, discountPercent: 10 },
  },
];

async function seedProducts() {
  console.log('🌱 开始导入产品数据...\n');

  try {
    await connectDB();
    const productModel = new ProductModel();

    // 确保索引存在
    await productModel.ensureIndexes();

    const allProducts = [...dogProducts, ...catProducts];
    let successCount = 0;

    for (const product of allProducts) {
      try {
        await productModel.create({
          merchantAddress: SAMPLE_MERCHANT,
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          currency: 'ETH',
          images: product.images,
          inventory: product.inventory,
          nftBenefit: product.nftBenefit,
          tags: product.tags,
          status: 'active',
        });
        successCount++;
        console.log(`✅ [${successCount}/${allProducts.length}] ${product.name}`);
      } catch (error: any) {
        console.error(`❌ 导入失败: ${product.name} - ${error.message}`);
      }
    }

    console.log(`\n✅ 产品导入完成！`);
    console.log(`📊 统计信息：`);
    console.log(`   - 总数: ${allProducts.length}`);
    console.log(`   - 成功: ${successCount}`);
    console.log(`   - 失败: ${allProducts.length - successCount}`);
    console.log(`   - 狗狗产品: ${dogProducts.length}`);
    console.log(`   - 猫咪产品: ${catProducts.length}`);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ 导入过程出错:', error.message);
    process.exit(1);
  }
}

// 运行导入脚本
seedProducts();
