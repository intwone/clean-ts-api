import components from './components';
import paths from './paths';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Api desenvolvida para realizar enquetes entre desenvolvedores de software.',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }, { name: 'Enquete' }],
  paths,
  schemas,
  components,
};
