import {
  StudentFeatureProfile,
  InternshipFeatureProfile,
  EligibilityResult,
  CompatibilityResult,
  ScoringWeights,
} from './types';
import { TfIdfEngine } from './tfidf';
import { SkillGapAnalyzer } from './skillGapAnalyzer';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  skillWeight: 30,
  educationWeight: 20,
  domainWeight: 15,
  locationWeight: 10,
  experienceWeight: 10,
  careerGoalWeight: 10,
  preferenceWeight: 5,
};

export class ScoringEngine {
  /**
   * Deterministically calculate multi-factor compatibility score and human-readable explanations
   */
  public static calculate(
    student: StudentFeatureProfile,
    internship: InternshipFeatureProfile,
    eligibility: EligibilityResult,
    weights: ScoringWeights = DEFAULT_WEIGHTS
  ): CompatibilityResult {
    const reasons: string[] = [];

    // Analyze skill gaps
    const skillGap = SkillGapAnalyzer.analyze(student, internship);

    // 1. Skill Match Score (0 - 100)
    let skillScore = 0;
    const totalRequired = internship.requiredSkills.length;
    const totalPreferred = internship.preferredSkills.length;

    let matchedReqCount = 0;
    for (const req of internship.requiredSkills) {
      if (skillGap.matchedSkills.some((s) => s.toLowerCase() === req.name.toLowerCase())) {
        matchedReqCount++;
      }
    }

    let matchedPrefCount = 0;
    for (const pref of internship.preferredSkills) {
      if (skillGap.matchedSkills.some((s) => s.toLowerCase() === pref.name.toLowerCase())) {
        matchedPrefCount++;
      }
    }

    if (totalRequired === 0 && totalPreferred === 0) {
      skillScore = 70; // baseline if role has generic skill requirements
    } else {
      const reqWeight = totalPreferred > 0 ? 0.75 : 1.0;
      const prefWeight = totalPreferred > 0 ? 0.25 : 0.0;

      const reqRatio = totalRequired > 0 ? matchedReqCount / totalRequired : 1.0;
      const prefRatio = totalPreferred > 0 ? matchedPrefCount / totalPreferred : 0.0;

      skillScore = Math.round((reqRatio * reqWeight + prefRatio * prefWeight) * 100);
    }

    // Proficiency bonus
    const expertSkills = student.skills.filter(
      (s) => s.proficiencyLevel === 'ADVANCED' || s.proficiencyLevel === 'EXPERT'
    );
    if (expertSkills.length > 0 && skillScore > 0) {
      skillScore = Math.min(100, skillScore + 5);
    }

    if (skillGap.matchedSkills.length > 0) {
      reasons.push(
        `✓ ${skillGap.matchedSkills.slice(0, 3).join(', ')} directly match role skill requirements.`
      );
    }
    if (skillGap.missingRequiredSkills.length > 0) {
      reasons.push(
        `△ Recommended to brush up on required skill(s): ${skillGap.missingRequiredSkills.slice(0, 2).join(', ')}.`
      );
    }

    // 2. Education Match Score (0 - 100)
    let educationScore = 60;
    let eduReason = 'Education meets minimum academic threshold.';

    if (student.highestEducation) {
      const edu = student.highestEducation;
      const branchLower = edu.branch.toLowerCase();
      const domainLower = internship.domain.toLowerCase();

      // Check alignment
      const isDirectBranch =
        branchLower.includes(domainLower) ||
        domainLower.includes(branchLower) ||
        (domainLower.includes('software') && (branchLower.includes('computer') || branchLower.includes('it'))) ||
        (domainLower.includes('civil') && branchLower.includes('civil')) ||
        (domainLower.includes('mechanical') && branchLower.includes('mechanical')) ||
        (domainLower.includes('finance') && (branchLower.includes('commerce') || branchLower.includes('finance') || branchLower.includes('management')));

      if (isDirectBranch) {
        educationScore = 95;
        eduReason = `✓ Your ${edu.degree} in ${edu.branch} strongly aligns with the ${internship.domain} discipline.`;
      } else {
        educationScore = 75;
        eduReason = `✓ Your degree in ${edu.branch} provides foundational academic readiness.`;
      }

      // CGPA factor
      if (edu.cgpaNormalized >= 8.5) {
        educationScore = Math.min(100, educationScore + 5);
      }
    }
    reasons.push(eduReason);

    // 3. Domain Interest Match Score (0 - 100)
    let domainScore = 40;
    const internDomainLower = internship.domain.toLowerCase();
    const candidateDomainsLower = student.preferredDomains.map((d) => d.toLowerCase());

    const directDomainMatch = candidateDomainsLower.some(
      (d) => internDomainLower.includes(d) || d.includes(internDomainLower)
    );

    if (directDomainMatch) {
      domainScore = 100;
      reasons.push(`✓ Aligns with your specified interest in ${internship.domain}.`);
    } else if (candidateDomainsLower.length === 0) {
      domainScore = 70; // no preference specified
    } else {
      domainScore = 45;
    }

    // 4. Location Match Score (0 - 100)
    let locationScore = 50;
    const internLocationLower = internship.location.toLowerCase();
    const internStateLower = internship.state.toLowerCase();
    const candidateLocationsLower = student.preferredLocations.map((l) => l.toLowerCase());

    if (internship.workMode === 'REMOTE' || student.remotePreference === 'REMOTE') {
      if (internship.workMode === 'REMOTE') {
        locationScore = 100;
        reasons.push(`✓ Remote work mode provides complete location flexibility.`);
      } else if (student.remotePreference === 'REMOTE') {
        locationScore = 40;
      }
    } else {
      const cityMatch = candidateLocationsLower.some((loc) => internLocationLower.includes(loc) || loc.includes(internLocationLower));
      const stateMatch = candidateLocationsLower.some((loc) => internStateLower.includes(loc) || loc.includes(internStateLower));

      if (cityMatch) {
        locationScore = 100;
        reasons.push(`✓ Location (${internship.location}) directly matches your location preference.`);
      } else if (stateMatch || (student.state && student.state.toLowerCase() === internStateLower)) {
        locationScore = 80;
        reasons.push(`✓ Located within your preferred state (${internship.state}).`);
      } else if (candidateLocationsLower.length === 0) {
        locationScore = 70; // Pan-India open
      } else {
        locationScore = 35;
      }
    }

    // 5. Experience & Projects Match Score (0 - 100)
    let experienceScore = 50;
    const candidateProjectText = student.projects
      .map((p) => `${p.title} ${p.description} ${p.technologies}`)
      .join(' ');
    const candidateExpText = student.experiences
      .map((e) => `${e.title} ${e.company} ${e.description || ''}`)
      .join(' ');
    const candidateCombinedCorpus = `${candidateProjectText} ${candidateExpText}`;
    const internshipCorpus = `${internship.title} ${internship.description} ${internship.responsibilities}`;

    if (candidateCombinedCorpus.trim().length > 10) {
      const textSimilarity = TfIdfEngine.cosineSimilarity(candidateCombinedCorpus, internshipCorpus);
      // Map cosine similarity (typically 0.05 - 0.6 for documents) to a 0-100 scale
      experienceScore = Math.min(100, Math.round(30 + textSimilarity * 110));
      if (textSimilarity > 0.15) {
        reasons.push(`✓ Past projects and practical experiences exhibit relevant technical exposure.`);
      }
    } else {
      experienceScore = 60; // default for fresher candidates under PM scheme
    }

    // 6. Career Goal Match Score (0 - 100)
    let careerGoalScore = 50;
    if (student.careerGoal && student.careerGoal.trim().length > 5) {
      const goalSimilarity = TfIdfEngine.cosineSimilarity(student.careerGoal, internshipCorpus);
      careerGoalScore = Math.min(100, Math.round(40 + goalSimilarity * 100));
      if (goalSimilarity > 0.12) {
        reasons.push(`✓ Supports your long-term career ambition: "${student.careerGoal.slice(0, 60)}..."`);
      }
    } else {
      careerGoalScore = 65;
    }

    // 7. Work Mode & Preference Match Score (0 - 100)
    let preferenceScore = 70;
    if (student.remotePreference === 'ANY' || student.remotePreference === internship.workMode) {
      preferenceScore = 100;
    } else if (student.remotePreference === 'HYBRID' && internship.workMode !== 'ONSITE') {
      preferenceScore = 85;
    } else {
      preferenceScore = 50;
    }

    // Normalize weights to sum to 1.0
    const totalWeight =
      weights.skillWeight +
      weights.educationWeight +
      weights.domainWeight +
      weights.locationWeight +
      weights.experienceWeight +
      weights.careerGoalWeight +
      weights.preferenceWeight;

    const normSkillWeight = weights.skillWeight / totalWeight;
    const normEduWeight = weights.educationWeight / totalWeight;
    const normDomainWeight = weights.domainWeight / totalWeight;
    const normLocWeight = weights.locationWeight / totalWeight;
    const normExpWeight = weights.experienceWeight / totalWeight;
    const normGoalWeight = weights.careerGoalWeight / totalWeight;
    const normPrefWeight = weights.preferenceWeight / totalWeight;

    // Calculate final weighted score
    let compatibilityScore = Math.round(
      skillScore * normSkillWeight +
        educationScore * normEduWeight +
        domainScore * normDomainWeight +
        locationScore * normLocWeight +
        experienceScore * normExpWeight +
        careerGoalScore * normGoalWeight +
        preferenceScore * normPrefWeight
    );

    // If candidate is NOT eligible by mandatory rules, cap compatibility or clearly indicate
    if (!eligibility.isEligible) {
      compatibilityScore = Math.min(45, compatibilityScore);
    }

    return {
      internshipId: internship.id,
      compatibilityScore,
      eligibility,
      factors: {
        skillMatch: {
          score: skillScore,
          weight: weights.skillWeight,
          weightedContribution: Math.round(skillScore * normSkillWeight),
          explanation: `${skillGap.matchedSkills.length} matching skills, ${skillGap.missingRequiredSkills.length} missing required`,
        },
        educationMatch: {
          score: educationScore,
          weight: weights.educationWeight,
          weightedContribution: Math.round(educationScore * normEduWeight),
          explanation: eduReason,
        },
        domainMatch: {
          score: domainScore,
          weight: weights.domainWeight,
          weightedContribution: Math.round(domainScore * normDomainWeight),
          explanation: directDomainMatch ? 'Direct domain match' : 'General domain overlap',
        },
        locationMatch: {
          score: locationScore,
          weight: weights.locationWeight,
          weightedContribution: Math.round(locationScore * normLocWeight),
          explanation: `Location fit for ${internship.location}, ${internship.state}`,
        },
        experienceMatch: {
          score: experienceScore,
          weight: weights.experienceWeight,
          weightedContribution: Math.round(experienceScore * normExpWeight),
          explanation: 'Relevance of projects and practical portfolio',
        },
        careerGoalMatch: {
          score: careerGoalScore,
          weight: weights.careerGoalWeight,
          weightedContribution: Math.round(careerGoalScore * normGoalWeight),
          explanation: 'Alignment with long-term professional objectives',
        },
        preferenceMatch: {
          score: preferenceScore,
          weight: weights.preferenceWeight,
          weightedContribution: Math.round(preferenceScore * normPrefWeight),
          explanation: `Work mode: ${internship.workMode}`,
        },
      },
      skillGap,
      reasons: reasons.slice(0, 5),
      engineMode: 'LOCAL_ML',
    };
  }
}
