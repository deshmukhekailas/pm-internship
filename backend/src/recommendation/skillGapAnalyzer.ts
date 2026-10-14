import { SkillGapAnalysis, InternshipFeatureProfile, StudentFeatureProfile } from './types';

// Curated learning pathways for common tech and industry skills
const SKILL_LEARNING_RESOURCES: Record<string, string> = {
  docker: 'Learn containerization basics with Docker Free Hands-On Tutorial or SWAYAM Cloud Computing course',
  kubernetes: 'Explore container orchestration through Kubernetes.io interactive tutorials',
  react: 'Build interactive frontends with the official React 18+ docs and FreeCodeCamp',
  python: 'Practice core Python and standard libraries on Kaggle Python course / NPTEL Programming in Python',
  sql: 'Master relational queries and indexing with Mode Analytics SQL Tutorial / W3Schools SQL',
  javascript: 'Brush up modern ES6+ concepts and async programming on javascript.info',
  typescript: 'Learn static typing and interfaces with the TypeScript Handbook',
  'machine learning': 'Enroll in Andrew Ng Machine Learning Specialization or NPTEL AI/ML curriculum',
  aws: 'Review AWS Cloud Practitioner digital training on AWS Skill Builder',
  git: 'Practice Git branching, pull requests, and version control on GitHub Skills',
  fastapi: 'Explore modern high-performance Python APIs with FastAPI official tutorial',
  nodejs: 'Study Node.js event-loop, Express routing, and REST architectural patterns',
  java: 'Practice object-oriented architecture and Spring Boot on Baeldung / GeeksforGeeks',
  'c++': 'Review data structures, algorithms, and STL libraries on LearnCpp.com',
  autocad: 'Complete introductory mechanical/civil 2D & 3D modeling on Autodesk Design Academy',
  'financial modeling': 'Learn DCF, ratio analysis, and 3-statement modeling via Corporate Finance Institute (CFI)',
  excel: 'Master advanced Excel functions (VLOOKUP/XLOOKUP, Pivot Tables, Macros) on Microsoft Learn',
};

export class SkillGapAnalyzer {
  /**
   * Analyze skill gaps between candidate and internship requirements
   */
  public static analyze(
    student: StudentFeatureProfile,
    internship: InternshipFeatureProfile
  ): SkillGapAnalysis {
    const studentSkillNames = new Set(
      student.skills.map((s) => s.name.toLowerCase().trim())
    );

    const matchedSkills: string[] = [];
    const missingRequiredSkills: string[] = [];
    const missingPreferredSkills: string[] = [];
    const learningSuggestions: SkillGapAnalysis['learningSuggestions'] = [];

    // Check required skills
    for (const req of internship.requiredSkills) {
      const reqName = req.name.trim();
      const reqLower = reqName.toLowerCase();

      const isMatched = Array.from(studentSkillNames).some(
        (ss) => ss.includes(reqLower) || reqLower.includes(ss)
      );

      if (isMatched) {
        matchedSkills.push(reqName);
      } else {
        missingRequiredSkills.push(reqName);
        const resourceHint =
          SKILL_LEARNING_RESOURCES[reqLower] ||
          `Explore foundational tutorials and practical projects in ${reqName}`;
        learningSuggestions.push({
          skill: reqName,
          importance: 'REQUIRED',
          suggestion: resourceHint,
        });
      }
    }

    // Check preferred skills
    for (const pref of internship.preferredSkills) {
      const prefName = pref.name.trim();
      const prefLower = prefName.toLowerCase();

      const isMatched = Array.from(studentSkillNames).some(
        (ss) => ss.includes(prefLower) || prefLower.includes(ss)
      );

      if (isMatched) {
        if (!matchedSkills.includes(prefName)) {
          matchedSkills.push(prefName);
        }
      } else {
        if (!missingRequiredSkills.includes(prefName)) {
          missingPreferredSkills.push(prefName);
          const resourceHint =
            SKILL_LEARNING_RESOURCES[prefLower] ||
            `Familiarize yourself with ${prefName} to gain an added advantage`;
          learningSuggestions.push({
            skill: prefName,
            importance: 'PREFERRED',
            suggestion: resourceHint,
          });
        }
      }
    }

    return {
      matchedSkills,
      missingRequiredSkills,
      missingPreferredSkills,
      learningSuggestions,
    };
  }
}
