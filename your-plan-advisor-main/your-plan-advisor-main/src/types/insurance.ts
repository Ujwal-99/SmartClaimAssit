/**
 * Insurance Types
 * Defines the data structures used across all modules
 * of the Smart ClaimAssist system.
 */

/** User profile collected in Module 1 */
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  monthlyIncome: number;
  hasHealthIssues: boolean;
  familySize: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  createdAt: string;
}

/** Insurance plan types available in the system */
export type PlanType = 'health' | 'term' | 'combined';

/** Recommendation result from Module 2 */
export interface PlanRecommendation {
  planName: string;
  planType: PlanType;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

/** Premium calculation result from Module 3 */
export interface PremiumResult {
  basePremium: number;
  ageFactor: number;
  coverageFactor: number;
  totalPremium: number;
  policyType: PlanType;
  coverageAmount: number;
}

/** Claim risk assessment result from Module 4 */
export interface ClaimRiskResult {
  score: number;
  level: 'low' | 'medium' | 'high';
  breakdown: {
    ageScore: number;
    claimPercentageScore: number;
    delayScore: number;
    previousClaimsScore: number;
  };
}

/** Policy comparison data for Module 5 */
export interface PolicyPlan {
  name: string;
  type: PlanType;
  coverage: string;
  premiumRange: string;
  familyCoverage: string;
  riskProtection: string;
  benefits: string[];
}

/** Chat message for Module 6 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
