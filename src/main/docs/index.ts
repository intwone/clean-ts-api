import { badRequest, forbidden, notFound, serverError, unauthorized } from './components';
import { loginPath, signUpPath, surveyPath } from './paths';
import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  signUpParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
} from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Api desenvolvida para realizar enquetes entre desenvolvedores de software.',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }, { name: 'Enquete' }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    signUpParams: signUpParamsSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden,
  },
};
