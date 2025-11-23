import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth and Agenda (e2e)', () => {
  let app: INestApplication;
  let server: any;
  const testUser = { email: 'testuser@example.com', password: 'secret123', name: 'Test User' };
  let token: string;

  let mongod: MongoMemoryServer;

  // aumentar timeout porque criação do Mongo em memória + init do Nest pode demorar
  jest.setTimeout(30000);

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    // drop test database and close connections
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (err) {
      // ignore
    }
    if (app) await app.close();
    if (mongod) await mongod.stop();
  });

  it('registers a user', async () => {
    const res = await request(server).post('/auth/register').send(testUser).expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('email', testUser.email);
    expect(res.body).not.toHaveProperty('password');
  });

  it('logs in and receives token', async () => {
    const res = await request(server).post('/auth/login').send({ email: testUser.email, password: testUser.password }).expect(200);
    expect(res.body).toHaveProperty('access_token');
    token = res.body.access_token;
  });

  it('fails to create agenda without token', async () => {
    await request(server)
      .post('/agenda')
      .send({ patientName: 'Paciente', date: new Date().toISOString(), notes: 'Sem token' })
      .expect(401);
  });

  it('creates agenda with token', async () => {
    const res = await request(server)
      .post('/agenda')
      .set('Authorization', `Bearer ${token}`)
      .send({ patientName: 'Paciente', date: new Date().toISOString(), notes: 'Com token' })
      .expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('patientName', 'Paciente');
  });

  it('lists agendas publicly', async () => {
    const res = await request(server).get('/agenda').expect(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
