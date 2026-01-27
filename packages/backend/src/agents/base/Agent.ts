import { ChatOpenAI } from "langchain/chat_models/openai";
import { ethers } from "ethers";
import {
  AgentConfig,
  AgentInput,
  AgentOutput,
  ReasoningTree,
  ReasoningNode,
} from "../../types";

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected llm: ChatOpenAI;
  protected agentId: string;

  constructor(config: AgentConfig, agentId: string) {
    this.config = config;
    this.agentId = agentId;
    this.llm = new ChatOpenAI({
      modelName: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens || 2000,
      openAIApiKey: config.apiKey,
    });
  }

  abstract execute(input: AgentInput): Promise<AgentOutput>;

  protected async buildReasoningTree(
    steps: any[]
  ): Promise<ReasoningTree> {
    const nodes: ReasoningNode[] = steps.map((step, index) => ({
      id: `node-${index}`,
      type: step.type || 'analysis',
      content: step.content,
      confidence: step.confidence,
      evidence: step.evidence,
      children: step.children || undefined,
    }));

    const tree: ReasoningTree = {
      root: {
        id: 'root',
        type: 'decision',
        content: `${this.agentId} Analysis`,
        children: nodes,
      },
      totalNodes: nodes.length + 1,
      createdAt: Date.now(),
    };

    return tree;
  }

  protected async storeOnChain(
    output: AgentOutput
  ): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.MONAD_RPC_URL || "https://testnet.rpc.monad.xyz"
      );

      const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY || "",
        provider
      );

      const vaultAddress = process.env.RECOMMENDATION_VAULT_ADDRESS;
      if (!vaultAddress) {
        throw new Error("Vault address not configured");
      }

      const vaultABI = [
        "function storeRecommendation(uint256 petTokenId, bytes32 queryHash, bytes32 resultHash) external returns (uint256)",
      ];

      const vault = new ethers.Contract(vaultAddress, vaultABI, wallet);

      // Generate hashes
      const queryHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(output.data))
      );
      const resultHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(output.reasoning))
      );

      // Store on-chain
      const tx = await vault.storeRecommendation(
        0, // petTokenId - can be updated based on context
        queryHash,
        resultHash
      );

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error("Error storing on-chain:", error.message);
      return "";
    }
  }

  protected calculateConfidence(factors: number[]): number {
    if (factors.length === 0) return 0;
    const sum = factors.reduce((acc, val) => acc + val, 0);
    return Math.min(sum / factors.length, 1);
  }

  protected async callLLM(prompt: string): Promise<string> {
    try {
      const response = await this.llm.invoke(prompt);
      return response.content as string;
    } catch (error: any) {
      throw new Error(`LLM call failed: ${error.message}`);
    }
  }
}
