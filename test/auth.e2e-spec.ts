import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module'; // Adjust path to your AppModule

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) should return JWT token', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@gmail.com', password: 'password' })
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body.data).toHaveProperty('access_token');
        jwtToken = response.body.data.access_token;
      });
  });

  it('/auth/me (GET) should allow access with JWT token', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.data.email).toBe('admin@gmail.com');
      });
  });

  it('/auth/me (GET) should deny access without JWT token', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });
});
