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
