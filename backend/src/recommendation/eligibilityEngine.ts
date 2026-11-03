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

      const degreeMatch = allowedLower.some((allowed) => {
        if (allowed === 'all' || allowed === 'any' || allowed === '') return true;
        if (studentDegreeLower.includes(allowed) || allowed.includes(studentDegreeLower)) return true;
        // B.Tech / B.E. equivalence
        if (
          (allowed.includes('b.tech') || allowed.includes('btech') || allowed.includes('b.e') || allowed.includes('be')) &&
          (studentDegreeLower.includes('b.tech') || studentDegreeLower.includes('btech') || studentDegreeLower.includes('b.e') || studentDegreeLower.includes('be'))
        ) {
          return true;
        }
        return false;
      });

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

      const branchMatch = allowedBranchesLower.some((allowed) => {
        if (allowed === 'all' || allowed === 'any' || allowed === '') return true;
        if (studentBranchLower.includes(allowed) || allowed.includes(studentBranchLower)) return true;

        // Semantic synonym groups for Indian academic disciplines
        const isCompAllowed = allowed.includes('computer') || allowed.includes('cse') || allowed.includes('software') || allowed.includes('information technology') || allowed === 'it' || allowed.includes('data science') || allowed.includes('artificial intelligence') || allowed.includes('ai');
        const isCompStudent = studentBranchLower.includes('computer') || studentBranchLower.includes('cse') || studentBranchLower.includes('software') || studentBranchLower.includes('information technology') || studentBranchLower === 'it' || studentBranchLower.includes('data science') || studentBranchLower.includes('artificial intelligence') || studentBranchLower.includes('ai');
        if (isCompAllowed && isCompStudent) return true;

        const isMechAllowed = allowed.includes('mechanical') || allowed.includes('automobile') || allowed.includes('production') || allowed.includes('manufacturing');
        const isMechStudent = studentBranchLower.includes('mechanical') || studentBranchLower.includes('automobile') || studentBranchLower.includes('production') || studentBranchLower.includes('manufacturing');
        if (isMechAllowed && isMechStudent) return true;

        const isElecAllowed = allowed.includes('electrical') || allowed.includes('electronic') || allowed.includes('telecom') || allowed.includes('instrumentation') || allowed === 'ece' || allowed === 'eee';
        const isElecStudent = studentBranchLower.includes('electrical') || studentBranchLower.includes('electronic') || studentBranchLower.includes('telecom') || studentBranchLower.includes('instrumentation') || studentBranchLower === 'ece' || studentBranchLower === 'eee';
        if (isElecAllowed && isElecStudent) return true;

        const isCivilAllowed = allowed.includes('civil') || allowed.includes('construction') || allowed.includes('structural') || allowed.includes('infrastructure');
        const isCivilStudent = studentBranchLower.includes('civil') || studentBranchLower.includes('construction') || studentBranchLower.includes('structural') || studentBranchLower.includes('infrastructure');
        if (isCivilAllowed && isCivilStudent) return true;

        const isBusinessAllowed = allowed.includes('business') || allowed.includes('management') || allowed.includes('commerce') || allowed.includes('finance') || allowed.includes('marketing') || allowed.includes('economics');
        const isBusinessStudent = studentBranchLower.includes('business') || studentBranchLower.includes('management') || studentBranchLower.includes('commerce') || studentBranchLower.includes('finance') || studentBranchLower.includes('marketing') || studentBranchLower.includes('economics');
        if (isBusinessAllowed && isBusinessStudent) return true;

        return false;
      });

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
    } else if (rule.maxGraduationYear && edu.graduationYear > (rule.maxGraduationYear + 2)) {
      failedChecks.push(
        `Graduation year (${edu.graduationYear}) is later than eligible window`
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
        const hasSkill = Array.from(candidateSkillSet).some((cs) => {
          if (cs === reqLower) return true;
          if (cs.includes(reqLower) || reqLower.includes(cs)) return true;
          // Aliases
          if ((reqLower === 'js' || reqLower === 'javascript') && (cs === 'js' || cs === 'javascript')) return true;
          if ((reqLower.includes('c++') || reqLower.includes('cpp')) && (cs.includes('c++') || cs.includes('cpp'))) return true;
          if (reqLower.includes('react') && cs.includes('react')) return true;
          return false;
        });
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

      const isAllStates =
        allowedStatesLower.length === 0 ||
        allowedStatesLower.some(
          (s) =>
            s.includes('all') ||
            s.includes('pan-india') ||
            s.includes('india') ||
            s === 'any' ||
            s === ''
        );

      if (isAllStates) {
        passedChecks.push('Open to candidates from all states and union territories');
      } else if (studentStateLower) {
        const matchesState = allowedStatesLower.some(
          (allowed) =>
            allowed.includes(studentStateLower) ||
            studentStateLower.includes(allowed)
        );
        if (matchesState) {
          passedChecks.push(`Resident state (${(student.state || '').trim()}) is eligible`);
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
