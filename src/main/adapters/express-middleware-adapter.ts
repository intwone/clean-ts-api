import { HttpRequestProtocol } from '@/presentation/protocols';
import { MiddlewareProtocol } from '@/presentation/protocols/middleware';
import { NextFunction, Request, Response } from 'express';

export const adaptMiddleware = (middleware: MiddlewareProtocol) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequestProtocol = {
      headers: req.headers,
    };
    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      return next();
    }
    return res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  };
};
