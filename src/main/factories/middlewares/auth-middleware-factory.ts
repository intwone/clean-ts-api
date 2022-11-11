import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { MiddlewareProtocol } from '@/presentation/protocols/middleware';
import { makeDbLoadAccountByToken } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory';

export const makeAuthMiddleware = (role?: string): MiddlewareProtocol => {
  const dbLoadAccountByToken = makeDbLoadAccountByToken();
  const authMiddleware = new AuthMiddleware(dbLoadAccountByToken, role);
  return authMiddleware;
};
