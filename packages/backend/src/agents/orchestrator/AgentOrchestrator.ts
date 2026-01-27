import { PetProfileAgent } from "../PetProfileAgent";
import { ProductRecommendationAgent } from "../ProductRecommendationAgent";
import { AgentInput, AgentOutput } from "../../types";

export class AgentOrchestrator {
  private agents: Map<string, any>;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.agents = new Map();
    this.initializeAgents();
  }

  private initializeAgents(): void {
    this.agents.set("profile", new PetProfileAgent(this.apiKey));
    this.agents.set("recommendation", new ProductRecommendationAgent(this.apiKey));
  }

  async handleQuery(query: string, context: any): Promise<any> {
    try {
      // Determine which agents to invoke based on query
      const plan = this.createExecutionPlan(query, context);

      // Execute agents
      const results = await this.executeAgents(plan);

      // Aggregate results
      return this.aggregateResults(results);
    } catch (error: any) {
      throw new Error(`Orchestration failed: ${error.message}`);
    }
  }

  async createPetProfile(data: any): Promise<AgentOutput> {
    const agent = this.agents.get("profile");
    if (!agent) {
      throw new Error("Profile agent not found");
    }

    const input: AgentInput = {
      type: "pet-profile",
      data,
    };

    return await agent.execute(input);
  }

  async getProductRecommendation(data: any): Promise<AgentOutput> {
    const agent = this.agents.get("recommendation");
    if (!agent) {
      throw new Error("Recommendation agent not found");
    }

    const input: AgentInput = {
      type: "product-recommendation",
      data,
    };

    return await agent.execute(input);
  }

  private createExecutionPlan(query: string, context: any): any {
    const lowerQuery = query.toLowerCase();

    // Simple plan creation based on keywords
    const plan = {
      agents: [] as string[],
      sequential: false,
      context,
    };

    if (
      lowerQuery.includes("profile") ||
      lowerQuery.includes("analyze") ||
      lowerQuery.includes("create pet")
    ) {
      plan.agents.push("profile");
    }

    if (
      lowerQuery.includes("recommend") ||
      lowerQuery.includes("product") ||
      lowerQuery.includes("buy") ||
      lowerQuery.includes("suggest")
    ) {
      plan.agents.push("recommendation");
    }

    // If profile is needed for recommendation, make it sequential
    if (plan.agents.includes("profile") && plan.agents.includes("recommendation")) {
      plan.sequential = true;
    }

    return plan;
  }

  private async executeAgents(plan: any): Promise<Map<string, AgentOutput>> {
    const results = new Map<string, AgentOutput>();

    if (plan.sequential) {
      // Execute agents in sequence
      for (const agentName of plan.agents) {
        const agent = this.agents.get(agentName);
        if (agent) {
          const input: AgentInput = {
            type: agentName,
            data: plan.context,
            context: results,
          };
          const result = await agent.execute(input);
          results.set(agentName, result);
        }
      }
    } else {
      // Execute agents in parallel
      const promises = plan.agents.map(async (agentName: string) => {
        const agent = this.agents.get(agentName);
        if (agent) {
          const input: AgentInput = {
            type: agentName,
            data: plan.context,
          };
          const result = await agent.execute(input);
          return { agentName, result };
        }
        return null;
      });

      const settled = await Promise.allSettled(promises);
      settled.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          results.set(result.value.agentName, result.value.result);
        }
      });
    }

    return results;
  }

  private aggregateResults(results: Map<string, AgentOutput>): any {
    const aggregated: any = {
      success: true,
      agents: {},
      overallConfidence: 0,
      timestamp: Date.now(),
    };

    let totalConfidence = 0;
    let count = 0;

    results.forEach((output, agentName) => {
      aggregated.agents[agentName] = {
        success: output.success,
        data: output.data,
        reasoning: output.reasoning,
        confidence: output.confidence,
        metadata: output.metadata,
      };

      if (output.success) {
        totalConfidence += output.confidence;
        count++;
      } else {
        aggregated.success = false;
      }
    });

    aggregated.overallConfidence = count > 0 ? totalConfidence / count : 0;

    return aggregated;
  }

  getAgent(name: string): any {
    return this.agents.get(name);
  }

  getAllAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}
