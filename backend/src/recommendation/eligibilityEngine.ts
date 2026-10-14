import { StudentFeatureProfile, InternshipFeatureProfile, EligibilityResult } from './types';

export class EligibilityEngine {
  /**
   * Deterministically evaluate eligibility of a candidate for an internship
   */
  public static evaluate(
    student: StudentFeatureProfile,
    internship: InternshipFeatureProfile
  ): EligibilityResult {
    const passedChecks: string[] = [];
    const failedChecks: string[] = [];
    const notes: string[] = [];

    const rule = internship.eligibility;

    // If no eligibility rules are set, candidate is considered eligible by default
    if (!rule) {
      return {
        status: 'ELIGIBLE',
        isEligible: true,
        passedChecks: ['No specific restrictions defined for this role'],
        failedChecks: [],
        notes: ['Open to all applicants matching basic PM Scheme requirements'],
      };
    }

    const edu = student.highestEducation;

    // 1. Education Profile Check
    if (!edu) {
      return {
        status: 'UNKNOWN',
        isEligible: false,
        passedChecks: [],
        failedChecks: ['Education details are missing in your profile'],
        notes: ['Please add your degree and graduation details to determine eligibility'],
      };
    }

    // 2. Degree check
    if (rule.allowedDegrees && rule.allowedDegrees.length > 0) {
      const allowedLower = rule.allowedDegrees.map((d) => d.toLowerCase().trim());
      const studentDegreeLower = edu.degree.toLowerCase().trim();

      const degreeMatch = allowedLower.some((allowed) =>
        studentDegreeLower.includes(allowed) || allowed.includes(studentDegreeLower)
      );

      if (degreeMatch) {
        passedChecks.push(`Degree matches requirement (${edu.degree})`);
      } else {
        failedChecks.push(
          `Degree (${edu.degree}) is not in eligible list: ${rule.allowedDegrees.join(', ')}`
        );
      }
    } else {
      passedChecks.push('Degree eligibility satisfied');
    }

    // 3. Branch / Field of Study check
    if (rule.allowedBranches && rule.allowedBranches.length > 0) {
      const allowedBranchesLower = rule.allowedBranches.map((b) => b.toLowerCase().trim());
      const studentBranchLower = edu.branch.toLowerCase().trim();

      const branchMatch = allowedBranchesLower.some(
        (allowed) =>
          studentBranchLower.includes(allowed) ||
          allowed.includes(studentBranchLower) ||
          allowed === 'all' ||
          allowed === 'any'
      );

      if (branchMatch) {
        passedChecks.push(`Branch/Field matches requirement (${edu.branch})`);
      } else {
        failedChecks.push(
          `Branch (${edu.branch}) does not meet required disciplines: ${rule.allowedBranches.join(', ')}`
        );
      }
    } else {
      passedChecks.push('All disciplines and branches are eligible');
    }

    // 4. Minimum CGPA / Percentage check
    if (rule.minCgpa !== undefined && rule.minCgpa !== null) {
      const studentNormalizedCgpa = edu.cgpaNormalized;
      if (studentNormalizedCgpa >= rule.minCgpa) {
        passedChecks.push(
          `CGPA (${edu.cgpaOrPercentage}/${edu.maxScale}) satisfies minimum requirement of ${rule.minCgpa}/10`
        );
      } else {
        failedChecks.push(
          `CGPA (${edu.cgpaOrPercentage}) is below the required cutoff of ${rule.minCgpa}/10`
        );
      }
    }

    // 5. Graduation Year check
    if (rule.minGraduationYear && edu.graduationYear < rule.minGraduationYear) {
      failedChecks.push(
        `Graduation year (${edu.graduationYear}) is earlier than required (${rule.minGraduationYear})`
      );
    } else if (rule.maxGraduationYear && edu.graduationYear > rule.maxGraduationYear) {
      failedChecks.push(
        `Graduation year (${edu.graduationYear}) is later than required (${rule.maxGraduationYear})`
      );
    } else if (rule.minGraduationYear || rule.maxGraduationYear) {
      passedChecks.push(`Graduation year (${edu.graduationYear}) meets eligibility window`);
    }

    // 6. Age check (PM Scheme typical 21-24)
    if (student.age !== undefined && student.age !== null) {
      if (rule.minAge && student.age < rule.minAge) {
        failedChecks.push(`Age (${student.age}) is below minimum requirement (${rule.minAge} years)`);
      } else if (rule.maxAge && student.age > rule.maxAge) {
        failedChecks.push(`Age (${student.age}) exceeds maximum limit (${rule.maxAge} years)`);
      } else if (rule.minAge || rule.maxAge) {
        passedChecks.push(`Age (${student.age} years) is within permissible scheme bracket`);
      }
    }

    // 7. Mandatory Skills Check
    if (rule.mandatorySkillNames && rule.mandatorySkillNames.length > 0) {
      const candidateSkillSet = new Set(
        student.skills.map((s) => s.name.toLowerCase().trim())
      );

      const missingMandatory: string[] = [];
      for (const reqSkill of rule.mandatorySkillNames) {
        const reqLower = reqSkill.toLowerCase().trim();
        const hasSkill = Array.from(candidateSkillSet).some((cs) => cs.includes(reqLower) || reqLower.includes(cs));
        if (!hasSkill) {
          missingMandatory.push(reqSkill);
        }
      }

      if (missingMandatory.length === 0) {
        passedChecks.push(`All mandatory skills possessed (${rule.mandatorySkillNames.join(', ')})`);
      } else {
        failedChecks.push(`Missing mandatory prerequisite skill(s): ${missingMandatory.join(', ')}`);
      }
    }

    // 8. State / Geographic Restriction
    if (rule.allowedStates && rule.allowedStates.length > 0) {
      const allowedStatesLower = rule.allowedStates.map((s) => s.toLowerCase().trim());
      const studentStateLower = (student.state || '').toLowerCase().trim();

      const isAllStates = allowedStatesLower.includes('all') || allowedStatesLower.includes('pan-india') || allowedStatesLower.length === 0;

      if (!isAllStates && studentStateLower) {
        if (allowedStatesLower.includes(studentStateLower)) {
          passedChecks.push(`Resident state (${student.state}) is eligible`);
        } else {
          failedChecks.push(
            `Internship is restricted to candidates from: ${rule.allowedStates.join(', ')}`
          );
        }
      }
    }

    const isEligible = failedChecks.length === 0;
    const status: EligibilityResult['status'] = isEligible
      ? 'ELIGIBLE'
      : 'NOT_ELIGIBLE';

    return {
      status,
      isEligible,
      passedChecks,
      failedChecks,
      notes,
    };
  }
}
