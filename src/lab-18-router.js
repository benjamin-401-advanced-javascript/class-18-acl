'use strict';

const express = require('express');
const apiRouter = express.Router();

const User = require('./model/user.js');
const Article = require('./model/article.js');
const auth = require('./middleware/auth.js');
const oauth = require('./oauth/google.js');

apiRouter.get('/public-stuff', (req, res, next) => {
  req.send('get(/public-stuff)')
})

apiRouter.get('/hidden-stuff', auth(), (req, res, next) => {
  req.send('get(/hidden-stuff)')
})

apiRouter.get('/something-to-read', auth('read'), (req, res, next) => {
  req.send('get(/something-to-read)')
})

apiRouter.post('/create-a-thing', auth('create'), (req, res, next) => {
  req.send('post(/create-a-thing)')
})

apiRouter.put('/update', auth('update'), (req, res, next) => {
  req.send('put(/update)')
})

apiRouter.patch('/jp', auth('update'), (req, res, next) => {
  req.send('patch(/jp)')
})

apiRouter.delete('/bye-bye', auth('delete'), (req, res, next) => {
  req.send('delete(/bye-bye)')
})

apiRouter.get('/everything', auth('superuser'), (req, res, next) => {
  req.send('get(/everything)')
})

module.exports = apiRouter;