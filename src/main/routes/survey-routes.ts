import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory';
import { adminAuth } from '../middewares/admin-auth';
import { userAuth } from '../middewares/user-auth';

export default (router: Router) => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()));
};
