import { BaseAgent } from "./base/Agent";
import { AgentInput, AgentOutput, PetProfile } from "../types";

export class PetProfileAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      {
        model: "gpt-4",
        temperature: 0.3,
        maxTokens: 2000,
        apiKey,
      },
      "PetProfileAgent"
    );
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    try {
      const { name, species, age, description, healthIssues, allergies } = input.data;

      // Extract health information from description
      const healthInfo = await this.extractHealthInfo(description);

      // Calculate health score
      const healthScore = this.calculateHealthScore({
        age,
        healthIssues: healthIssues || healthInfo.healthIssues,
        allergies: allergies || healthInfo.allergies,
      });

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        species,
        age,
        healthScore,
        healthInfo
      );

      // Build pet profile
      const profile: PetProfile = {
        name,
        species,
        breed: healthInfo.breed || "Unknown",
        age,
        healthScore,
        allergies: allergies || healthInfo.allergies,
        healthIssues: healthIssues || healthInfo.healthIssues,
        dietaryRestrictions: healthInfo.dietaryRestrictions,
        recommendations,
      };

      // Build reasoning tree
      const reasoning = await this.buildReasoningTree([
        {
          type: "analysis",
          content: `Analyzed ${name}, a ${age}-year-old ${species}`,
          confidence: 0.95,
          evidence: [`Description: ${description}`],
        },
        {
          type: "decision",
          content: `Health score calculated: ${healthScore}/100`,
          confidence: 0.9,
          evidence: [
            `Age factor: ${age}`,
            `Health issues: ${healthIssues?.length || 0}`,
            `Allergies: ${allergies?.length || 0}`,
          ],
        },
        {
          type: "solution",
          content: "Generated personalized recommendations",
          confidence: 0.85,
          evidence: [
            `Diet recommendations: ${recommendations.diet.length}`,
            `Exercise recommendations: ${recommendations.exercise.length}`,
            `Checkup recommendations: ${recommendations.checkups.length}`,
          ],
        },
      ]);

      const executionTime = Date.now() - startTime;

      const output: AgentOutput = {
        success: true,
        data: profile,
        reasoning,
        confidence: this.calculateConfidence([0.95, 0.9, 0.85]),
        metadata: {
          agentId: this.agentId,
          timestamp: Date.now(),
          executionTime,
        },
      };

      return output;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        data: null,
        reasoning: await this.buildReasoningTree([
          {
            type: "analysis",
            content: "Error occurred during pet profile analysis",
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

  private async extractHealthInfo(description: string): Promise<any> {
    const prompt = `
Extract health information from the following pet description:
"${description}"

Return a JSON object with:
{
  "breed": "string (if mentioned)",
  "healthIssues": ["array of health issues"],
  "allergies": ["array of allergies"],
  "dietaryRestrictions": ["array of dietary restrictions"]
}

Only include information explicitly mentioned or strongly implied in the description.
Return valid JSON only, no additional text.
`;

    try {
      const response = await this.callLLM(prompt);
      const parsed = JSON.parse(response);
      return {
        breed: parsed.breed || null,
        healthIssues: parsed.healthIssues || [],
        allergies: parsed.allergies || [],
        dietaryRestrictions: parsed.dietaryRestrictions || [],
      };
    } catch (error) {
      return {
        breed: null,
        healthIssues: [],
        allergies: [],
        dietaryRestrictions: [],
      };
    }
  }

  private calculateHealthScore(data: {
    age: number;
    healthIssues: string[];
    allergies: string[];
  }): number {
    let score = 100;

    // Age factor
    if (data.age > 10) {
      score -= 10;
    } else if (data.age > 7) {
      score -= 5;
    }

    // Health issues
    score -= data.healthIssues.length * 10;

    // Allergies
    score -= data.allergies.length * 5;

    return Math.max(0, Math.min(100, score));
  }

  private async generateRecommendations(
    species: string,
    age: number,
    healthScore: number,
    healthInfo: any
  ): Promise<{
    diet: string[];
    exercise: string[];
    checkups: string[];
  }> {
    const prompt = `
Generate personalized pet care recommendations for:
- Species: ${species}
- Age: ${age} years
- Health Score: ${healthScore}/100
- Health Issues: ${healthInfo.healthIssues.join(", ") || "none"}
- Allergies: ${healthInfo.allergies.join(", ") || "none"}

Return a JSON object with:
{
  "diet": ["3-5 specific diet recommendations"],
  "exercise": ["3-5 specific exercise recommendations"],
  "checkups": ["3-5 specific health checkup recommendations"]
}

Make recommendations specific, actionable, and appropriate for the pet's age and health status.
Return valid JSON only, no additional text.
`;

    try {
      const response = await this.callLLM(prompt);
      const parsed = JSON.parse(response);
      return {
        diet: parsed.diet || [],
        exercise: parsed.exercise || [],
        checkups: parsed.checkups || [],
      };
    } catch (error) {
      // Fallback recommendations
      return {
        diet: [`Age-appropriate ${species} food`, "Fresh water daily"],
        exercise: ["Regular daily exercise", "Interactive play sessions"],
        checkups: ["Annual veterinary checkup", "Vaccination updates"],
      };
    }
  }
}
