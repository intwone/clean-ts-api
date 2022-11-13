import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory';
import { adminAuth } from '@/main/middewares/admin-auth';
import { userAuth } from '@/main/middewares/user-auth';
import { Router } from 'express';

export default (router: Router) => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()));
};
