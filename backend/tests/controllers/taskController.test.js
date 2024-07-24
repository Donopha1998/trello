const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app.js');
const User = require('../../src/models/userModel.js');
const Task = require('../../src/models/taskModel.js');

chai.use(chaiHttp);
const { expect } = chai;

describe('Task Controller', () => {
  let token;
  let userId;

  before(async () => {

    // Register a new user
    await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: { firstName: 'Task', lastName: 'User' },
        email: 'taskuser@example.com',
        password: 'password123'
      });


    userId = (await User.findOne({ email: 'taskuser@example.com' }))._id;

    // login to  get a token
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'taskuser@example.com',
        password: 'password123'
      });

    token = loginRes.body.token;
  });

  it('should create a new task', async () => {
    const res = await chai.request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'TODO'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('title', 'Test Task');

    const task = await Task.findOne({ title: 'Test Task' });
    expect(task).to.not.be.null;
  });

  it('all tasks', async () => {
    // Create a task
    await chai.request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Another Task',
        description: 'Another test task',
        status: 'TODO'
      });

    // get all tasks
    const res = await chai.request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object').that.has.all.keys('TODO', 'IN_PROGRESS', 'DONE');
    expect(res.body.TODO).to.be.an('array').that.is.not.empty;
  });

  it('should update a task', async () => {
    // Create a task 
    const task = await Task.create({
      title: 'Task to Update',
      description: 'Update me',
      status: 'TODO',
      userId
    });

    // Update the task's status
    const res = await chai.request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'IN_PROGRESS'
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status', 'IN_PROGRESS');
  });

  it('should delete a task', async () => {
    // Create a task to delete
    const task = await Task.create({
      title: 'Task to Delete',
      description: 'Delete ',
      status: 'TODO',
      userId
    });

    // Delete the task
    const res = await chai.request(app)
      .delete(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Task deleted successfully');
  });
});
