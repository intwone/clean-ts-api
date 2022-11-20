import { badRequest, notFound, serverError, unauthorized } from './components';
import { loginPath } from './paths';
import { accountSchema, errorSchema, loginParamsSchema } from './schemas';

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
    error: errorSchema,
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound,
  },
};
