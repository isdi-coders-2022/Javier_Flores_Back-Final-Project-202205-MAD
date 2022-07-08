import request from 'supertest';
import { server } from '../index.js';
import { mongooseConnect } from '../db/mongoose';
import { app } from '../app.js';
import { User } from '../models/user.model.js';
import { Item } from '../models/item.model.js';
import { Suitcase } from '../models/suitcase.model.js';

let saveToken = '';
let saveId = '';
let saveItem = { _id: '', name: '', weight: 0, destination: '' };
let saveSuitcase = {
    _id: '',
    destination: '',
    owner: '',
    items: [{ item: '', quantity: 0, isChecked: false }],
    isWeightOk: false,
};

describe('Given the routes of user', () => {
    beforeEach(async () => {
        await mongooseConnect();
    });
    afterEach(async () => {
        server.close();
    });
    describe('When method POST is used in "/user', () => {
        test('Then status should be 201', async () => {
            const newUser = {
                name: 'jorge',
                email: 'jorge@pepe.com',
                password: '123456',
                suitcases: [],
            };
            const response = await request(app).post('/user').send(newUser);

            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method POST is used in /user without email field', () => {
        test('Then status should be 400', async () => {
            const newUser = {
                name: 'jose',
                password: '123456',
                suitcases: [],
            };
            const response = await request(app).post('/user').send(newUser);

            expect(response.statusCode).toBe(400);
        });
    });
    describe('When method POST is used in /user without name field', () => {
        test('Then status should be 400', async () => {
            const newUser = {
                email: 'jose',
                password: '123456',
                suitcases: [],
            };
            const response = await request(app).post('/user').send(newUser);

            expect(response.statusCode).toBe(400);
        });
    });
    describe('When method POST is used in /user without password field', () => {
        test('Then status should be 400', async () => {
            const newUser = {
                email: 'jose',
                name: '123456',
                suitcases: [],
            };
            const response = await request(app).post('/user').send(newUser);

            expect(response.statusCode).toBe(400);
        });
    });
    describe('When method POST is used in "/user/login with wrong password field', () => {
        test('Then status should be 401', async () => {
            const enterUser = {
                name: 'jorge',
                password: 'wrong',
            };
            const response = await request(app)
                .post('/user/login')
                .send(enterUser);
            saveToken = response.body.token;
            saveId = response.body.id;
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method POST is used in "/user/login', () => {
        test('Then status should be 201', async () => {
            const enterUser = {
                name: 'jorge',
                password: '123456',
            };
            const response = await request(app)
                .post('/user/login')
                .send(enterUser);
            saveToken = response.body.token;
            saveId = response.body.id;
            expect(response.statusCode).toBe(201);
        });
    });

    describe('When method GET is used in "/user', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get('/user');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method GET is used in "/user/:id', () => {
        test('Then status should be 200', async () => {
            const response = await request(app)
                .get('/user/' + saveId)
                .set('Authorization', 'Bearer ' + saveToken);

            expect(response.statusCode).toBe(200);
        });
    });
});
describe('Given the routes of Item', () => {
    beforeEach(async () => {
        await mongooseConnect();
    });
    afterEach(async () => {
        server.close();
    });
    describe('When method POST is used in "/item without weight and destination', () => {
        test('Then status should be 406', async () => {
            const newItem = {
                name: 'test',
            };
            const response = await request(app).post('/item').send(newItem);

            expect(response.statusCode).toBe(406);
        });
    });
    describe('When method POST is used in "/item', () => {
        test('Then status should be 201', async () => {
            const newItem = {
                name: 'test',
                weight: 1,
                destination: 'beach',
            };
            const response = await request(app).post('/item').send(newItem);
            saveItem = response.body;

            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method GET is used in "/item', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get('/item');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method GET is used in "/item/:id', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(
                '/item/' + String(saveItem._id)
            );

            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method PATCH is used in "/item/:id', () => {
        test('Then status should be 200', async () => {
            const editItem = { name: 'cepillo', weight: 3 };
            const response = await request(app)
                .patch('/item/' + String(saveItem._id))
                .send(editItem)
                .set('Authorization', 'Bearer ' + saveToken);

            expect(response.statusCode).toBe(200);
        });
    });
});
describe('Given the routes of Suitcase', () => {
    beforeEach(async () => {
        await mongooseConnect();
    });
    afterEach(async () => {
        server.close();
    });
    describe('When method POST is used in "/suitcase', () => {
        test('Then status should be 201', async () => {
            const newSuitcase = {
                destination: 'beach',
                owner: saveId,
                items: [
                    {
                        item: saveItem._id,
                        quantity: 1,
                        isChecked: true,
                    },
                ],
                isWeightOk: true,
            };
            const response = await request(app)
                .post('/suitcase')
                .send(newSuitcase)
                .set('Authorization', 'Bearer ' + saveId);
            saveSuitcase = response.body;
            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method GET is used in "/suitcase', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get('/suitcase');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method GET is used in "/suitcase/:id', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(
                '/suitcase/' + String(saveSuitcase._id)
            );

            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method PATCH is used in "/suitcase/:id', () => {
        test('Then status should be 200', async () => {
            const editSuitcase = {
                destination: 'beach',
                owner: saveId,
                isWeightOk: false,
            };
            const response = await request(app)
                .patch('/suitcase/' + String(saveSuitcase._id))
                .send(editSuitcase)

                .set('Authorization', 'Bearer ' + saveToken);
            console.log('AaaaAAAAAAAAAAAAAAAAAAAAA');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method DELETE is used in "/suitcase/:id', () => {
        test('Then status should be 200', async () => {
            const response = await request(app)
                .delete('/suitcase/' + String(saveSuitcase._id))
                .set('Authorization', 'Bearer ' + saveToken);
            expect(response.statusCode).toBe(202);
        });
    });
});
describe('Given methods patch and delete from User router', () => {
    describe('When method PATCH is used in "/user/:id', () => {
        test('Then status should be 200', async () => {
            const editUser = { name: 'jose' };
            const response = await request(app)
                .patch('/user/' + saveId)
                .send(editUser)
                .set('Authorization', 'Bearer ' + saveToken);

            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method DELETE is used in "/user/:id', () => {
        test('Then status should be 202', async () => {
            const response = await request(app)
                .delete('/user/' + saveId)
                .set('Authorization', 'Bearer ' + saveToken);
            expect(response.statusCode).toBe(202);
        });
    });
});
describe('Given methods from Suggestion router', () => {
    describe("When method GET is used in '/suggestion/?qbeach", () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(
                '/suggestion/?qdestination=beach'
            );

            expect(response.statusCode).toBe(200);
        });
    });
});

afterAll(async () => {
    await mongooseConnect();
    await User.deleteMany({});
    await Item.deleteMany({});
    await Suitcase.deleteMany({});
});

//Rutas
// suitcaseRouter.get('/', suitcaseController.getAllController); Done
// suitcaseRouter.get('/:id', suitcaseController.getController); Done
// suitcaseRouter.post('/', suitcaseController.postController); Done
// suitcaseRouter.patch(
//     '/:id',
//     loginRequired,
//     userRequiredForSuitcase,
//     suitcaseController.patchController
// );
// suitcaseRouter.delete(
//     '/:id',
//     loginRequired,
//     userRequiredForSuitcase,
//     suitcaseController.deleteController
// );
