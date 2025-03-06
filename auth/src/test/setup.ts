import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

// declare global {
//     namespace NodeJS {
//         interface Global {
//             signin: () => Promise<string[]>;
//         }
//     }
// }
declare global {
    var signin: () => Promise<string[]>;
}


let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
    
   
});

beforeEach(async () => {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('Database connection is not established');
    }
    const collections = await db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie as string[];
};

