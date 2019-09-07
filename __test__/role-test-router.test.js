'use strict';

process.env.SECRET = 'test';

const jwt = require('jsonwebtoken');

const Roles = require('../src/model/role.js');
const server = require('../src/app.js').server;
const supergoose = require('cf-supergoose');

const mockRequest = supergoose.server(server);

let users = {
  superuser: { username: 'superuser', password: 'password', role: 'superuser', email: 'test@test.com' },
  admin: { username: 'admin', password: 'password', role: 'admin', email: 'test@test.com' },
  editor: { username: 'editor', password: 'password', role: 'editor', email: 'test@test.com' },
  user: { username: 'user', password: 'password', role: 'user', email: 'test@test.com' },
};

let roles = {
  superuser: { role: 'superuser', capabilities: ['create', 'read', 'update', 'delete', 'superuser'] },
  admin: { role: 'admin', capabilities: ['create', 'read', 'update', 'delete'] },
  editor: { role: 'editor', capabilities: ['create', 'read', 'update'] },
  user: { role: 'user', capabilities: ['read'] },
};

beforeAll(async (done) => {
  await supergoose.startDB();
  const admin = await new Roles(roles.admin).save();
  const editor = await new Roles(roles.editor).save();
  const user = await new Roles(roles.user).save();
  done()
});


afterAll(supergoose.stopDB);

describe(`Limited Access Routes`, () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} user`, () => {

      let encodedToken;
      let id;

      it(`can create ${userType} user`, () => {
        return mockRequest.post('/signup')
          .send(users[userType])
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            id = token.id;
            encodedToken = results.text;
            expect(token.id).toBeDefined();
            expect(token.capabilities).toBeDefined();
          });
      });

      it(`can control ${userType} GET access to /public-stuff`, () => {
        return mockRequest.get('/public-stuff')
          .then(results => {
            expect(results.text).toBe('success');
          });
      });

      it(`can control ${userType} GET access to /hidden-stuff`, () => {
        return mockRequest.get('/hidden-stuff')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            expect(results.text).toBe('success');
          });
      });

      it(`can control ${userType} GET access to /something-to-read`, () => {
        return mockRequest.get('/something-to-read')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            const hasCapability = roles[users[userType].role].capabilities.includes('read');
            expect(results.text).toBe(hasCapability.toString());
          });
      });

      it(`can control ${userType} POST access to /create-a-thing`, () => {
        return mockRequest.post('/create-a-thing')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            const hasCapability = roles[users[userType].role].capabilities.includes('create');
            if (hasCapability) {
              expect(results.text).toBe(hasCapability.toString());
            } else {
              const error = JSON.parse(results.text);
              expect(error.error).toBe("Invalid User ID / Password");
            }
          });
      });

      it(`can control ${userType} PUT access to /update`, () => {
        return mockRequest.put('/update')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            const hasCapability = roles[users[userType].role].capabilities.includes('update');
            if (hasCapability) {
              expect(results.text).toBe(hasCapability.toString());
            } else {
              const error = JSON.parse(results.text);
              expect(error.error).toBe("Invalid User ID / Password");
            }
          });
      });

      it(`can control ${userType} PATCH access to /jp`, () => {
        return mockRequest.patch('/jp')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            const hasCapability = roles[users[userType].role].capabilities.includes('update');
            if (hasCapability) {
              expect(results.text).toBe(hasCapability.toString());
            } else {
              const error = JSON.parse(results.text);
              expect(error.error).toBe("Invalid User ID / Password");
            }
          });
      });

      it(`can control ${userType} DELETE access to /bye-bye`, () => {
        return mockRequest.delete('/bye-bye')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            const hasCapability = roles[users[userType].role].capabilities.includes('delete');
            if (hasCapability) {
              expect(results.text).toBe(hasCapability.toString());
            } else {
              const error = JSON.parse(results.text);
              expect(error.error).toBe("Invalid User ID / Password");
            }
          });
      });

      it(`can control ${userType} GET access to /everything`, () => {
        return mockRequest.get('/everything')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            const hasCapability = roles[users[userType].role].capabilities.includes('superuser');
            if (hasCapability) {
              expect(results.text).toBe(hasCapability.toString());
            } else {
              const error = JSON.parse(results.text);
              expect(error.error).toBe("Invalid User ID / Password");
            }
          });
      });

    });
  });

});
