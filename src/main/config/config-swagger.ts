import swaggerConfig from '@/main/docs';
import { noCache } from '@/main/middewares/no-cache';
import { Express } from 'express';
import { serve, setup } from 'swagger-ui-express';

export default (app: Express): void => {
  app.use('/api/docs', serve, noCache, setup(swaggerConfig));
};
