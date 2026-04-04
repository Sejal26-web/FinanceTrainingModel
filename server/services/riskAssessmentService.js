const Prediction = require("../models/Prediction");

// ── Configuration ──
const RULES = {
  // Frequency: max applications allowed within a time window
  MAX_APPLICATIONS_PER_DAY: 3,
  MAX_APPLICATIONS_PER_WEEK: 7,
  MAX_APPLICATIONS_PER_MONTH: 15,

  // Debt-to-income: loan amount (in thousands) vs monthly income
  MAX_LOAN_TO_INCOME_RATIO: 8,

  // Minimum income thresholds
  MIN_INCOME_FOR_LOAN: 1500,

  // High-risk: bad credit + high loan
  HIGH_LOAN_THRESHOLD: 300, // in thousands

  // Max consecutive rejections before cooldown
  MAX_CONSECUTIVE_REJECTIONS: 3,

  // Cooldown period after consecutive rejections (hours)
  REJECTION_COOLDOWN_HOURS: 48,
};

/**
 * Assess risk flags for a loan application.
 * Returns { approved: bool, flags: string[], riskScore: number }
 */
async function assessRisk(userId, input) {
  const flags = [];
  let riskScore = 0;

  // ─── 1. Frequency checks ───
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  if (userId) {
    const [dailyCount, weeklyCount, monthlyCount] = await Promise.all([
      Prediction.countDocuments({ user: userId, createdAt: { $gte: oneDayAgo } }),
      Prediction.countDocuments({ user: userId, createdAt: { $gte: oneWeekAgo } }),
      Prediction.countDocuments({ user: userId, createdAt: { $gte: oneMonthAgo } }),
    ]);

    if (dailyCount >= RULES.MAX_APPLICATIONS_PER_DAY) {
      flags.push(`Too many applications today (${dailyCount}/${RULES.MAX_APPLICATIONS_PER_DAY}). Please try again tomorrow.`);
      riskScore += 40;
    }

    if (weeklyCount >= RULES.MAX_APPLICATIONS_PER_WEEK) {
      flags.push(`Exceeded weekly application limit (${weeklyCount}/${RULES.MAX_APPLICATIONS_PER_WEEK}).`);
      riskScore += 30;
    }

    if (monthlyCount >= RULES.MAX_APPLICATIONS_PER_MONTH) {
      flags.push(`Exceeded monthly application limit (${monthlyCount}/${RULES.MAX_APPLICATIONS_PER_MONTH}).`);
      riskScore += 25;
    }

    // ─── 2. Consecutive rejection cooldown ───
    const recentPredictions = await Prediction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(RULES.MAX_CONSECUTIVE_REJECTIONS)
      .lean();

    if (recentPredictions.length >= RULES.MAX_CONSECUTIVE_REJECTIONS) {
      const allRejected = recentPredictions.every(
        (p) =>
          p.results?.knn?.prediction === "Rejected" &&
          p.results?.rf?.prediction === "Rejected"
      );

      if (allRejected) {
        const lastApp = recentPredictions[0]?.createdAt;
        const cooldownEnd = new Date(lastApp.getTime() + RULES.REJECTION_COOLDOWN_HOURS * 60 * 60 * 1000);

        if (now < cooldownEnd) {
          const hoursLeft = Math.ceil((cooldownEnd - now) / (60 * 60 * 1000));
          flags.push(`${RULES.MAX_CONSECUTIVE_REJECTIONS} consecutive rejections detected. Cooldown active — try again in ${hoursLeft}h.`);
          riskScore += 50;
        }
      }
    }
  }

  // ─── 3. Debt-to-income ratio ───
  const totalIncome = (input.applicant_income || 0) + (input.coapplicant_income || 0);
  const loanAmount = input.loan_amount || 0;

  if (totalIncome > 0) {
    const ratio = loanAmount / (totalIncome / 1000); // normalize
    if (ratio > RULES.MAX_LOAN_TO_INCOME_RATIO) {
      flags.push(`Loan-to-income ratio too high (${ratio.toFixed(1)}x). Maximum allowed: ${RULES.MAX_LOAN_TO_INCOME_RATIO}x.`);
      riskScore += 25;
    }
  }

  // ─── 4. Minimum income check ───
  if (totalIncome < RULES.MIN_INCOME_FOR_LOAN) {
    flags.push(`Combined income (${totalIncome}) is below minimum threshold of ${RULES.MIN_INCOME_FOR_LOAN}.`);
    riskScore += 20;
  }

  // ─── 5. Bad credit + high loan amount ───
  if (input.credit_history === 0 && loanAmount >= RULES.HIGH_LOAN_THRESHOLD) {
    flags.push(`Bad credit history with high loan amount (${loanAmount}K). High default risk.`);
    riskScore += 35;
  }

  // ─── 6. Bad credit + no co-applicant income ───
  if (input.credit_history === 0 && (input.coapplicant_income || 0) === 0) {
    flags.push("Bad credit history with no co-applicant support increases risk.");
    riskScore += 15;
  }

  // ─── 7. High dependents with low income ───
  const dependents = input.dependents || 0;
  if (dependents >= 3 && totalIncome < 5000) {
    flags.push(`High number of dependents (${dependents}) with low combined income.`);
    riskScore += 20;
  }

  // ─── 8. Self-employed with no credit history ───
  if (input.self_employed === "Yes" && input.credit_history === 0) {
    flags.push("Self-employed applicants with bad credit history face higher scrutiny.");
    riskScore += 15;
  }

  // ─── 9. Very short loan term with high amount ───
  if (input.loan_amount_term <= 60 && loanAmount >= 200) {
    const monthlyEMI = (loanAmount * 1000) / input.loan_amount_term;
    if (monthlyEMI > totalIncome * 0.5) {
      flags.push(`Estimated monthly EMI exceeds 50% of income. Repayment burden too high.`);
      riskScore += 20;
    }
  }

  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);

  // Auto-reject if risk score is critically high
  const autoReject = riskScore >= 60;

  return {
    passed: !autoReject,
    autoReject,
    flags,
    riskScore,
    riskLevel: riskScore >= 60 ? "High" : riskScore >= 30 ? "Medium" : "Low",
  };
}

module.exports = { assessRisk };
