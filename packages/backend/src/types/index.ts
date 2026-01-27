export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens?: number;
  apiKey: string;
}

export interface AgentInput {
  type: string;
  data: any;
  context?: any;
}

export interface ReasoningNode {
  id: string;
  type: 'decision' | 'constraint' | 'solution' | 'analysis';
  content: string;
  children?: ReasoningNode[];
  confidence?: number;
  evidence?: string[];
}

export interface ReasoningTree {
  root: ReasoningNode;
  totalNodes: number;
  createdAt: number;
}

export interface AgentOutput {
  success: boolean;
  data: any;
  reasoning: ReasoningTree;
  confidence: number;
  metadata: {
    agentId: string;
    timestamp: number;
    executionTime: number;
    txHash?: string;
  };
  error?: string;
}

export interface PetProfile {
  name: string;
  species: 'cat' | 'dog';
  breed: string;
  age: number;
  weight?: number;
  healthScore: number;
  allergies?: string[];
  healthIssues?: string[];
  dietaryRestrictions?: string[];
  recommendations?: {
    diet: string[];
    exercise: string[];
    checkups: string[];
  };
}

export interface ProductRecommendation {
  rank: number;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    category: string;
  };
  score: number;
  reasoning: {
    pros: string[];
    cons: string[];
    matchDetails: string;
  };
  suitability: 'high' | 'medium' | 'low';
}
