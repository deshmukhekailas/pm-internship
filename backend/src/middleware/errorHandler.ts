import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error(`Unhandled Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  if (err.name === 'UnauthorizedError') {
    sendError(res, 'Unauthorized access', 401);
    return;
  }

  if (err.code === 'P2002') {
    // Prisma unique constraint violation
    const target = err.meta?.target || 'Resource';
    sendError(res, `A record with this ${target} already exists.`, 409);
    return;
  }

  if (err.code === 'P2025') {
    sendError(res, 'The requested record was not found.', 404);
    return;
  }

  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal server error';

  sendError(res, message, err.statusCode || 500);
};
