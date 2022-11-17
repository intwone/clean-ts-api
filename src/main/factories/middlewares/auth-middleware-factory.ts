import { makeDbLoadAccountByToken } from '@/main/factories/usecases/account/load-account-by-token/db-load-account-by-token-factory';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { MiddlewareProtocol } from '@/presentation/protocols/middleware';

export const makeAuthMiddleware = (role?: string): MiddlewareProtocol => {
  const dbLoadAccountByToken = makeDbLoadAccountByToken();
  const authMiddleware = new AuthMiddleware(dbLoadAccountByToken, role);
  return authMiddleware;
};
