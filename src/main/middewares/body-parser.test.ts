import app from '@/main/config/app';
import request from 'supertest';

describe('Body Parser Middleware', () => {
  it('should parse request body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });
    await request(app).post('/test_body_parser').send({ name: 'John Doe' }).expect({ name: 'John Doe' });
  });
});
