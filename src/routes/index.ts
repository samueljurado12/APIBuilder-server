import { Router } from 'express';

import auth from './auth';
import project from './project';
import projectConfig from './projectConfig';

const routes = Router();

routes.use('/auth', auth);
routes.use('/project', project);
routes.use('/projectConfig', projectConfig);

export default routes;
