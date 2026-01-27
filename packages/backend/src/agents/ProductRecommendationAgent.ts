import { BaseAgent } from "./base/Agent";
import { AgentInput, AgentOutput, PetProfile, ProductRecommendation } from "../types";

export class ProductRecommendationAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      {
        model: "gpt-4",
        temperature: 0.4,
        maxTokens: 2500,
        apiKey,
      },
      "ProductRecommendationAgent"
    );
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    try {
      const { petProfile, query, budget, preferences } = input.data;

      // Classify intent
      const intent = await this.classifyIntent(query);

      // Extract constraints
      const constraints = this.extractConstraints(petProfile);

      // Get product candidates (mock data for now)
      const candidates = await this.getProductCandidates(intent, budget);

      // Score products
      const scoredProducts = this.scoreProducts(candidates, petProfile, constraints);

      // Generate detailed reasoning
      const recommendations: ProductRecommendation[] = await Promise.all(
        scoredProducts.slice(0, 5).map(async (product, index) =>
          this.generateProductReasoning(product, petProfile, index + 1)
        )
      );

      // Identify products to avoid
      const avoid = this.identifyAvoidProducts(candidates, constraints);

      // Generate general advice
      const generalAdvice = await this.generateGeneralAdvice(
        petProfile,
        intent,
        recommendations
      );

      // Build reasoning tree
      const reasoning = await this.buildReasoningTree([
        {
          type: "analysis",
          content: `Query classified as: ${intent.category}`,
          confidence: intent.confidence,
          evidence: [`User query: "${query}"`],
        },
        {
          type: "constraint",
          content: "Applied pet-specific constraints",
          confidence: 0.95,
          evidence: [
            `Must avoid: ${constraints.mustNotHave.join(", ")}`,
            `Preferred: ${constraints.preferred.join(", ")}`,
          ],
        },
        {
          type: "decision",
          content: `Analyzed ${candidates.length} products, scored and ranked`,
          confidence: 0.9,
          evidence: [
            `Top recommendation score: ${recommendations[0]?.score || 0}`,
            `Products to avoid: ${avoid.length}`,
          ],
        },
        {
          type: "solution",
          content: `Generated ${recommendations.length} recommendations`,
          confidence: 0.88,
          evidence: [
            `High suitability: ${recommendations.filter(r => r.suitability === 'high').length}`,
            `General advice provided`,
          ],
        },
      ]);

      const executionTime = Date.now() - startTime;

      const output: AgentOutput = {
        success: true,
        data: {
          recommendations,
          avoid,
          generalAdvice,
        },
        reasoning,
        confidence: this.calculateConfidence([intent.confidence, 0.95, 0.9, 0.88]),
        metadata: {
          agentId: this.agentId,
          timestamp: Date.now(),
          executionTime,
        },
      };

      // Store on-chain
      const txHash = await this.storeOnChain(output);
      if (txHash) {
        output.metadata.txHash = txHash;
      }

      return output;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        data: null,
        reasoning: await this.buildReasoningTree([
          {
            type: "analysis",
            content: "Error occurred during product recommendation",
            confidence: 0,
            evidence: [error.message],
          },
        ]),
        confidence: 0,
        metadata: {
          agentId: this.agentId,
          timestamp: Date.now(),
          executionTime,
        },
        error: error.message,
      };
    }
  }

  private async classifyIntent(query: string): Promise<{ category: string; confidence: number }> {
    const categories = ['food', 'toy', 'healthcare', 'grooming', 'general'];

    // Simple keyword-based classification (can be enhanced with LLM)
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('diet')) {
      return { category: 'food', confidence: 0.9 };
    } else if (lowerQuery.includes('toy') || lowerQuery.includes('play')) {
      return { category: 'toy', confidence: 0.9 };
    } else if (lowerQuery.includes('health') || lowerQuery.includes('medicine') || lowerQuery.includes('vet')) {
      return { category: 'healthcare', confidence: 0.9 };
    } else if (lowerQuery.includes('groom') || lowerQuery.includes('bath') || lowerQuery.includes('clean')) {
      return { category: 'grooming', confidence: 0.9 };
    }

    return { category: 'general', confidence: 0.6 };
  }

  private extractConstraints(petProfile: PetProfile): {
    mustHave: string[];
    mustNotHave: string[];
    preferred: string[];
  } {
    const constraints = {
      mustHave: [petProfile.species],
      mustNotHave: [...(petProfile.allergies || [])],
      preferred: [],
    };

    // Add age-specific constraints
    if (petProfile.age < 1) {
      constraints.mustHave.push('puppy', 'kitten', 'young');
    } else if (petProfile.age > 7) {
      constraints.mustHave.push('senior');
    }

    // Add health-specific constraints
    if (petProfile.healthScore < 70) {
      constraints.preferred.push('gentle', 'low-impact', 'easy-digest');
    }

    return constraints;
  }

  private async getProductCandidates(intent: { category: string }, budget?: { min: number; max: number }): Promise<any[]> {
    // Mock product data - in production, this would query a database
    const mockProducts = [
      { id: '1', name: 'Premium Cat Food', brand: 'Royal Canin', category: 'food', price: 29.99, species: ['cat'], ageGroup: ['adult'] },
      { id: '2', name: 'Interactive Cat Toy', brand: 'PetFusion', category: 'toy', price: 15.99, species: ['cat'], ageGroup: ['all'] },
      { id: '3', name: 'Senior Dog Food', brand: 'Hills Science', category: 'food', price: 45.99, species: ['dog'], ageGroup: ['senior'] },
      { id: '4', name: 'Dental Care Treats', brand: 'Greenies', category: 'healthcare', price: 19.99, species: ['dog', 'cat'], ageGroup: ['all'] },
      { id: '5', name: 'Grooming Brush', brand: 'FURminator', category: 'grooming', price: 24.99, species: ['dog', 'cat'], ageGroup: ['all'] },
    ];

    // Filter by category and budget
    return mockProducts.filter(p => {
      if (intent.category !== 'general' && p.category !== intent.category) return false;
      if (budget && (p.price < budget.min || p.price > budget.max)) return false;
      return true;
    });
  }

  private scoreProducts(
    products: any[],
    petProfile: PetProfile,
    constraints: any
  ): any[] {
    return products.map(product => {
      let score = 50; // Base score

      // Species match
      if (product.species.includes(petProfile.species)) {
        score += 15;
      }

      // Age match
      const ageCategory = petProfile.age < 1 ? 'young' : petProfile.age > 7 ? 'senior' : 'adult';
      if (product.ageGroup.includes(ageCategory) || product.ageGroup.includes('all')) {
        score += 15;
      }

      // Health score consideration
      if (petProfile.healthScore > 80) {
        score += 10;
      } else if (petProfile.healthScore < 60) {
        score += 5; // Prefer gentle options
      }

      // Check for allergens (negative score)
      if (constraints.mustNotHave.some((allergen: string) =>
        product.name.toLowerCase().includes(allergen.toLowerCase())
      )) {
        score -= 30;
      }

      return {
        ...product,
        score: Math.max(0, Math.min(100, score))
      };
    }).sort((a, b) => b.score - a.score);
  }

  private async generateProductReasoning(
    product: any,
    petProfile: PetProfile,
    rank: number
  ): Promise<ProductRecommendation> {
    const suitability: 'high' | 'medium' | 'low' =
      product.score > 75 ? 'high' : product.score > 50 ? 'medium' : 'low';

    const pros: string[] = [];
    const cons: string[] = [];

    // Generate pros
    if (product.species.includes(petProfile.species)) {
      pros.push(`Designed specifically for ${petProfile.species}s`);
    }
    if (product.score > 75) {
      pros.push('High compatibility with pet profile');
    }
    if (product.price < 30) {
      pros.push('Budget-friendly option');
    }

    // Generate cons
    if (product.score < 60) {
      cons.push('Moderate compatibility concerns');
    }
    if (product.price > 40) {
      cons.push('Premium pricing');
    }

    return {
      rank,
      product: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: product.category,
      },
      score: product.score,
      reasoning: {
        pros,
        cons,
        matchDetails: `Matched ${pros.length} key criteria for ${petProfile.name}`,
      },
      suitability,
    };
  }

  private identifyAvoidProducts(products: any[], constraints: any): Array<{ product: string; reason: string }> {
    return products
      .filter(p =>
        constraints.mustNotHave.some((allergen: string) =>
          p.name.toLowerCase().includes(allergen.toLowerCase())
        )
      )
      .map(p => ({
        product: p.name,
        reason: `Contains ingredients your pet is allergic to`,
      }));
  }

  private async generateGeneralAdvice(
    petProfile: PetProfile,
    intent: any,
    recommendations: ProductRecommendation[]
  ): Promise<string> {
    if (recommendations.length === 0) {
      return `No products found matching your criteria. Consider broadening your search or consulting with a veterinarian.`;
    }

    const topScore = recommendations[0].score;
    if (topScore > 80) {
      return `Great match! The top recommendation is highly suitable for ${petProfile.name}'s age and health profile.`;
    } else if (topScore > 60) {
      return `Good options available. Consider ${petProfile.name}'s specific health needs when making your final choice.`;
    } else {
      return `Limited matches found. Consult with your veterinarian for personalized recommendations for ${petProfile.name}.`;
    }
  }
}
