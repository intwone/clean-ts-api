import { loginPath } from './paths/login-paths';
import { accountSchema } from './schemas/account-schema';
import { loginParamsSchema } from './schemas/login-params-schema';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Api desenvolvida para realizar enquetes entre desenvolvedores de software.',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
  },
};
