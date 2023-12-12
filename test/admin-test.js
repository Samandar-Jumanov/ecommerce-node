const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 
const { expect } = chai;

chai.use(chaiHttp);

describe('Admin API', () => {
    describe('POST /admin/auth/create-account/', () => {
        it('should create a new admin account', async () => {
            const testFile = {
                originalname: 'test.jpg',
                buffer: Buffer.from('dummy content'),
                mimetype: 'image/jpeg',
            };

            const res = await chai.request(app)
                .post('/admin/auth/create-account')
                .field('name', "Name")
                .field('surname', "Surname")
                .field('email', "surname@gmail.com")
                .field('companySecretKey', "12345678")
                .field('password', "paswd")
                .attach('file', testFile.buffer, testFile.originalname);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message', 'Account created successfully');
            expect(res.body).to.have.property('adminInfo');
        });
    });

});
