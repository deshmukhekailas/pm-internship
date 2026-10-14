import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const server = app.listen(config.port, () => {
  logger.info(`=======================================================`);
  logger.info(` PM INTERNSHIP SCHEME - AI RECOMMENDATION ENGINE API   `);
  logger.info(`=======================================================`);
  logger.info(`Server running on: http://localhost:${config.port}`);
  logger.info(`Swagger API Docs:  http://localhost:${config.port}/api/docs`);
  logger.info(`Health check:      http://localhost:${config.port}/health`);
  logger.info(`AI Mode:           ${config.aiProvider}`);
  logger.info(`Environment:       ${config.nodeEnv}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
