export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'AI-Based Internship Recommendation Engine for PM Internship Scheme',
    version: '1.0.0',
    description:
      'Production-grade RESTful API documentation for India\'s PM Internship Scheme AI-Powered Recommendation Engine. Supports multi-factor semantic matching, deterministic rule-based eligibility verification, resume parsing, and administrative management.',
    contact: {
      name: 'PM Internship Scheme Project Directorate',
      url: 'https://pminternship.mca.gov.in',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new Student or Admin account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: {
                  email: { type: 'string', example: 'student@example.com' },
                  password: { type: 'string', example: 'Student@12345' },
                  firstName: { type: 'string', example: 'Aarav' },
                  lastName: { type: 'string', example: 'Sharma' },
                  phone: { type: 'string', example: '+919876543210' },
                  role: { type: 'string', enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful' },
          400: { description: 'Validation error or duplicate email' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login with credentials and receive JWT access & refresh tokens',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'student@example.com' },
                  password: { type: 'string', example: 'Student@12345' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get current authenticated user profile',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile details' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/student/profile': {
      get: {
        summary: 'Get complete student profile, education, skills, projects, and completion percentage',
        tags: ['Student'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Student profile retrieved' },
        },
      },
      put: {
        summary: 'Update student profile details and preferences',
        tags: ['Student'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Student profile updated' },
        },
      },
    },
    '/api/student/resume': {
      post: {
        summary: 'Upload and parse resume file (PDF/DOCX/TXT)',
        tags: ['Student'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  resume: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Resume parsed successfully' },
        },
      },
    },
    '/api/internships': {
      get: {
        summary: 'List and filter internships with pagination and optional student compatibility scoring',
        tags: ['Internships'],
        parameters: [
          { name: 'keyword', in: 'query', schema: { type: 'string' } },
          { name: 'domain', in: 'query', schema: { type: 'string' } },
          { name: 'workMode', in: 'query', schema: { type: 'string' } },
          { name: 'location', in: 'query', schema: { type: 'string' } },
          { name: 'minStipend', in: 'query', schema: { type: 'number' } },
          { name: 'onlyEligible', in: 'query', schema: { type: 'boolean' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        ],
        responses: {
          200: { description: 'List of matching internships' },
        },
      },
    },
    '/api/internships/{id}': {
      get: {
        summary: 'Get full internship details and personalized candidate compatibility explanation',
        tags: ['Internships'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Internship details with skill gap and eligibility breakdown' },
          404: { description: 'Internship not found' },
        },
      },
    },
    '/api/recommendations': {
      get: {
        summary: 'Get personalized AI-ranked internship recommendations for logged-in student',
        tags: ['Recommendations'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Ranked list of compatible internships' },
        },
      },
    },
    '/api/recommendations/generate': {
      post: {
        summary: 'Trigger recalculation of AI recommendations',
        tags: ['Recommendations'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Fresh recommendations generated' },
        },
      },
    },
    '/api/recommendations/skill-gap': {
      get: {
        summary: 'Get aggregate skill gap analysis and recommended learning pathways',
        tags: ['Recommendations'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Skill gap summary' },
        },
      },
    },
    '/api/applications/apply/{id}': {
      post: {
        summary: 'Apply for an internship',
        tags: ['Applications'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          201: { description: 'Application submitted' },
          400: { description: 'Duplicate application or deadline expired' },
        },
      },
    },
    '/api/admin/dashboard': {
      get: {
        summary: 'Get admin dashboard key performance indicators and analytics',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard metrics and charts data' },
          403: { description: 'Forbidden - Admin access required' },
        },
      },
    },
    '/api/admin/config': {
      get: {
        summary: 'Get configurable recommendation weights and AI engine mode',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Current config' } },
      },
      put: {
        summary: 'Update recommendation weights (Skill, Education, Domain, Location, Experience, etc.)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Config updated' } },
      },
    },
  },
};
