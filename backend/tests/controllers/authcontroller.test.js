const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app.js');
const User = require('../../src/models/userModel.js');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller', () => {
  it('register a new user', async () => {
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'john@example.com',
        password: 'password123'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message', 'User registered successfully');

    const user = await User.findOne({ email: 'john@example.com' });
    expect(user).to.not.be.null;
    expect(user.name.firstName).to.equal('John');
    expect(user.name.lastName).to.equal('Doe');
  });

  it('login a user', async () => {
    await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: { firstName: 'Jane', lastName: 'Doe' },
        email: 'jane@example.com',
        password: 'password123'
      });

    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane@example.com',
        password: 'password123'
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');
  });

  it('fail login with wrong credentials', async () => {
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error', 'Invalid credentials');
  });
});
