/**
 * Insurance Logic Module
 * Contains all rule-based business logic for the Smart ClaimAssist system.
 * No machine learning — only conditional/formula-based calculations.
 */

import type { UserProfile, PlanRecommendation, PremiumResult, ClaimRiskResult, PlanType, PolicyPlan } from '@/types/insurance';

// ===================================
// MODULE 2: Plan Recommendation Engine
// ===================================

/**
 * Recommends insurance plans based on user profile.
 * Uses hybrid logic:
 * 1. Rule-based filtering
 * 2. Suitability scoring
 */

export function recommendPlan(profile: UserProfile): PlanRecommendation {

  const hasDependents =
    profile.familySize > 1 || profile.maritalStatus === "married";

  // =========================
  // Suitability Score System
  // =========================

  let healthScore = 0;
  let termScore = 0;
  let combinedScore = 0;

  // Age Factor
  if (profile.age < 30) {
    termScore += 3;
  } else if (profile.age < 45) {
    combinedScore += 2;
  } else {
    healthScore += 3;
  }

  // Income Factor
  if (profile.monthlyIncome > 80000) {
    combinedScore += 3;
  } else if (profile.monthlyIncome > 40000) {
    termScore += 2;
  } else {
    healthScore += 1;
  }

  // Family Factor
  if (profile.familySize > 3) {
    combinedScore += 3;
  } else if (profile.familySize > 1) {
    healthScore += 2;
  }

  // Health Issues
  if (profile.hasHealthIssues) {
    healthScore += 4;
  }

  // Marital Status
  if (profile.maritalStatus === "married") {
    combinedScore += 2;
  }

  const scores = {
    health: healthScore,
    term: termScore,
    combined: combinedScore,
  };

  const bestPlan = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  // ===================================
  // Rule Priority
  // ===================================

  if (profile.hasHealthIssues) {
    return {
      planName: "Specialized Health Plan",
      planType: "health",
      reason:
        "You have existing health conditions. A specialized health plan provides better coverage for pre-existing diseases with shorter waiting periods.",
      confidence: "high",
    };
  }

  if (profile.monthlyIncome > 50000 && hasDependents) {
    return {
      planName: "Combined Protection Plan",
      planType: "combined",
      reason: `With a monthly income of ₹${profile.monthlyIncome.toLocaleString()} and ${profile.familySize} family members, a combined protection plan provides both life insurance and health coverage.`,
      confidence: "high",
    };
  }

  if (profile.familySize > 2) {
    return {
      planName: "Family Floater Health Plan",
      planType: "health",
      reason: `With a family size of ${profile.familySize}, a family floater plan covers all members under a single policy.`,
      confidence: "high",
    };
  }

  if (profile.age < 35) {
    return {
      planName: "Term Life Insurance Plan",
      planType: "term",
      reason:
        "At your age, term life insurance offers maximum coverage at the lowest premium, helping secure your family's financial future.",
      confidence: "high",
    };
  }

  // =========================
  // Score-Based Fallback
  // =========================

  if (bestPlan === "combined") {
    return {
      planName: "Combined Protection Plan",
      planType: "combined",
      reason:
        "Based on your profile factors like age, income, and dependents, a combined protection plan offers balanced coverage.",
      confidence: "medium",
    };
  }

  if (bestPlan === "term") {
    return {
      planName: "Term Life Insurance Plan",
      planType: "term",
      reason:
        "Your financial profile indicates that a term plan provides strong life coverage at an affordable premium.",
      confidence: "medium",
    };
  }

  return {
    planName: "Comprehensive Health Plan",
    planType: "health",
    reason:
      "Based on your profile analysis, a comprehensive health plan is recommended to ensure protection against medical expenses.",
    confidence: "medium",
  };
}


// ===================================
// AI Explanation Engine
// ===================================

/**
 * Explains why a recommendation was generated.
 * Used to show AI reasoning in UI.
 */

export function explainRecommendation(profile: UserProfile): string[] {

  const explanations: string[] = [];

  if (profile.age < 35) {
    explanations.push("Your age is below 35, making term insurance affordable.");
  } else if (profile.age > 45) {
    explanations.push("Higher age increases health risk, so health coverage becomes more important.");
  }

  if (profile.familySize > 1) {
    explanations.push(`You have ${profile.familySize} family members, so family protection is important.`);
  }

  if (profile.monthlyIncome > 50000) {
    explanations.push("Your income level supports a broader insurance coverage plan.");
  }

  if (profile.hasHealthIssues) {
    explanations.push("Existing health conditions require specialized medical coverage.");
  }

  if (profile.maritalStatus === "married") {
    explanations.push("Being married increases financial responsibility, so stronger coverage is recommended.");
  }

  return explanations;
}

// ===================================
// MODULE 3: Premium Calculator
// ===================================

/**
 * Calculates insurance premium using formula-based approach.
 * Formula: Premium = Base + (Age Factor) + (Coverage Factor)
 * 
 * Base rates per policy type:
 * - Health: ₹5,000/year
 * - Term Life: ₹4,000/year
 * - Combined: ₹8,000/year
 * 
 * Age Factor: base * (age / 100) * multiplier
 * Coverage Factor: coverageAmount * rate
 */
export function calculatePremium(
  policyType: PlanType,
  coverageAmount: number,
  age: number
): PremiumResult {
  const baseRates: Record<PlanType, number> = {
    health: 5000,
    term: 4000,
    combined: 8000,
  };

  const ageMultipliers: Record<PlanType, number> = {
    health: 1.5,
    term: 1.2,
    combined: 1.4,
  };

  const coverageRates: Record<PlanType, number> = {
    health: 0.015,
    term: 0.008,
    combined: 0.012,
  };

  const basePremium = baseRates[policyType];
  const ageFactor = Math.round(basePremium * (age / 100) * ageMultipliers[policyType]);
  const coverageFactor = Math.round(coverageAmount * coverageRates[policyType]);
  const totalPremium = basePremium + ageFactor + coverageFactor;

  return {
    basePremium,
    ageFactor,
    coverageFactor,
    totalPremium,
    policyType,
    coverageAmount,
  };
}

// ===================================
// MODULE 4: Claim Risk Indicator
// ===================================

/**
 * Calculates claim risk score using rule-based scoring.
 * 
 * Scoring rules (total max = 100):
 * - Age score (0-25): Higher age = higher risk
 * - Claim percentage score (0-30): claim/coverage ratio
 * - Delay score (0-25): Filing delay in days
 * - Previous claims score (0-20): Number of past claims
 * 
 * Risk levels:
 * - 0-35: Low (Green)
 * - 36-65: Medium (Yellow)
 * - 66-100: High (Red)
 */
export function calculateClaimRisk(
  age: number,
  claimAmount: number,
  coverageAmount: number,
  delayDays: number,
  previousClaims: number
): ClaimRiskResult {
  // Age score: 0-25 points
  let ageScore = 0;
  if (age < 30) ageScore = 5;
  else if (age < 40) ageScore = 10;
  else if (age < 50) ageScore = 15;
  else if (age < 60) ageScore = 20;
  else ageScore = 25;

  // Claim percentage score: 0-30 points
  const claimPercentage = (claimAmount / coverageAmount) * 100;
  let claimPercentageScore = 0;
  if (claimPercentage < 30) claimPercentageScore = 5;
  else if (claimPercentage < 50) claimPercentageScore = 10;
  else if (claimPercentage < 70) claimPercentageScore = 15;
  else if (claimPercentage < 90) claimPercentageScore = 22;
  else claimPercentageScore = 30;

  // Delay score: 0-25 points
  let delayScore = 0;
  if (delayDays <= 7) delayScore = 0;
  else if (delayDays <= 30) delayScore = 8;
  else if (delayDays <= 60) delayScore = 15;
  else if (delayDays <= 90) delayScore = 20;
  else delayScore = 25;

  // Previous claims score: 0-20 points
  let previousClaimsScore = 0;
  if (previousClaims === 0) previousClaimsScore = 0;
  else if (previousClaims === 1) previousClaimsScore = 5;
  else if (previousClaims === 2) previousClaimsScore = 10;
  else if (previousClaims <= 4) previousClaimsScore = 15;
  else previousClaimsScore = 20;

  const score = ageScore + claimPercentageScore + delayScore + previousClaimsScore;

  let level: 'low' | 'medium' | 'high';
  if (score <= 35) level = 'low';
  else if (score <= 65) level = 'medium';
  else level = 'high';

  return {
    score,
    level,
    breakdown: {
      ageScore,
      claimPercentageScore,
      delayScore,
      previousClaimsScore,
    },
  };
}

// ===================================
// MODULE 5: Policy Comparison Data
// ===================================

/** Returns static policy plans for comparison table */
export function getPolicyPlans(): PolicyPlan[] {
  return [
    {
      name: 'Health Insurance Plan',
      type: 'health',
      coverage: '₹3L – ₹10L',
      premiumRange: '₹5,000 – ₹15,000/yr',
      familyCoverage: 'Individual or Family Floater',
      riskProtection: 'Hospitalization, Surgery, Medication',
      benefits: [
        'Cashless hospitalization',
        'Pre & post hospitalization expenses',
        'Day care procedures',
        'Annual health checkups',
        'No claim bonus up to 50%',
      ],
    },
    {
      name: 'Term Life Insurance Plan',
      type: 'term',
      coverage: '₹25L – ₹1Cr',
      premiumRange: '₹4,000 – ₹12,000/yr',
      familyCoverage: 'Nominee-based payout',
      riskProtection: 'Death benefit, Accidental coverage',
      benefits: [
        'High sum assured at low premium',
        'Tax benefits under 80C',
        'Accidental death benefit rider',
        'Critical illness rider option',
        'Flexible policy tenure (10-40 years)',
      ],
    },
    {
      name: 'Combined Protection Plan',
      type: 'combined',
      coverage: '₹10L – ₹50L',
      premiumRange: '₹8,000 – ₹25,000/yr',
      familyCoverage: 'Full family coverage',
      riskProtection: 'Life + Health + Accident',
      benefits: [
        'Life and health coverage in one policy',
        'Family-wide protection',
        'Critical illness cover included',
        'Hospital cash benefit',
        'Premium waiver on disability',
        'Maturity benefit option',
      ],
    },
  ];
}
// ===================================
// MODULE 6: Chatbot Knowledge Base
// ===================================

/** Predefined knowledge-based responses */
const knowledgeBase = {

  premium: [
    "An **insurance premium** is the amount you pay regularly to keep your insurance policy active. The cost depends on factors such as age, coverage amount, policy type, and health condition. Higher coverage usually means a higher premium. Younger and healthier individuals generally pay lower premiums. Premium calculation helps users estimate the affordability of a policy."
  ],

  risk: [
    "The **Claim Risk Indicator** evaluates how risky an insurance claim might be. It analyzes factors such as age, claim history, claim amount, and delay in filing a claim. Based on these inputs the system generates a score between 0 and 100. Lower scores indicate safer claims with higher chances of approval. This helps insurers and users understand potential claim risks."
  ],

  plan: [
    "Insurance **plan recommendation** helps users select the most suitable policy based on their personal profile. The system analyzes factors like age, monthly income, family size, marital status, and health conditions. Using rule-based logic and scoring methods, it suggests plans such as Term Insurance, Health Insurance, or Combined Protection Plans. This helps users choose policies that match their financial and family protection needs."
  ],

  documents: [
    "Insurance policies and claims require certain **verification documents**. Common documents include Aadhaar or PAN for identity, address proof, income proof, and sometimes medical reports. During claims, users may also submit hospital bills, prescriptions, and claim forms. These documents help insurers verify policyholder identity and validate claim requests."
  ],

  claim: [
    "An **insurance claim** is a request made to an insurance company to receive benefits according to the policy terms. Claims can occur due to medical emergencies, accidents, or other insured events. There are two common claim types: cashless claims where hospitals are paid directly, and reimbursement claims where the user pays first and gets refunded later."
  ],

  greeting: [
    "Hello! 👋 I'm **ClaimAssist**, your insurance support assistant. I can help explain insurance plans, premium calculations, claim risk analysis, required documents, and claim procedures. Feel free to ask questions like 'What is insurance premium?' or 'Which insurance plan is best?'"
  ]

};


/** helper to pick random response */
function randomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}


/** delay function to simulate AI thinking */
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/** Memory of last topic */
let lastTopic: string | null = null;


/**
 * Chatbot response logic
 */
export async function getChatbotResponse(userMessage: string): Promise<string> {

  const msg = userMessage.toLowerCase();

  await delay(800);

  // PREMIUM
  if (
    msg.includes("premium") ||
    msg.includes("cost") ||
    msg.includes("price") ||
    msg.includes("pay") ||
    msg.includes("payment")
  ) {
    lastTopic = "premium";
    return randomResponse(knowledgeBase.premium);
  }

  // PLAN
  if (
    msg.includes("plan") ||
    msg.includes("policy") ||
    msg.includes("insurance type") ||
    msg.includes("best plan") ||
    msg.includes("recommend")
  ) {
    lastTopic = "plan";
    return randomResponse(knowledgeBase.plan);
  }

  // DOCUMENTS
  if (
    msg.includes("document") ||
    msg.includes("documents") ||
    msg.includes("proof") ||
    msg.includes("verification")
  ) {
    lastTopic = "documents";
    return randomResponse(knowledgeBase.documents);
  }

  // RISK
  if (
    msg.includes("risk") ||
    msg.includes("risk indicator") ||
    msg.includes("probability")
  ) {
    lastTopic = "risk";
    return randomResponse(knowledgeBase.risk);
  }

  // CLAIM
  if (
    msg.includes("claim") ||
    msg.includes("insurance claim") ||
    msg.includes("claim process")
  ) {
    lastTopic = "claim";
    return randomResponse(knowledgeBase.claim);
  }

  // GREETING
  if (
    msg.includes("hi") ||
    msg.includes("hello") ||
    msg.includes("hey")
  ) {
    lastTopic = "greeting";
    return randomResponse(knowledgeBase.greeting);
  }

  // FOLLOW-UP QUESTIONS USING MEMORY
  if (
    msg.includes("how") ||
    msg.includes("more") ||
    msg.includes("explain") ||
    msg.includes("details")
  ) {
    if (lastTopic && knowledgeBase[lastTopic]) {
      return randomResponse(knowledgeBase[lastTopic]);
    }
  }

  // GENERAL INSURANCE INFO
  if (msg.includes("insurance")) {
    return `Insurance protects individuals financially from unexpected events such as illness, accidents, or loss of life.

Common types include:
• Health Insurance  
• Life Insurance  
• Term Insurance  
• Combined Protection Plans  

Ask me about **plans, premiums, claims, risk indicator, or required documents**.`;
  }

  // BEST PLAN QUESTION
  if (msg.includes("which") || msg.includes("best")) {
    return `Choosing the **best insurance plan** depends on factors like age, income, family size, and health conditions.

Common recommendations:
• Young individuals → Term Insurance  
• Families → Health Insurance  
• Higher income → Combined Protection Plan`;
  }

  // DEFAULT RESPONSE
  return `I can help you understand several insurance topics:

• Insurance plans  
• Premium calculations  
• Claim risk indicator  
• Required documents  
• Claim process  

Try asking questions like:
"What is insurance premium?"
"Which insurance plan is best?"
"What documents are required for claims?"`;

}