const express = require('express');
const userRouter = express.Router();

const { logIn } = require('./userController')
const { signUp } = require('./userController')
const { checkAdminRole } = require('./userController')

const { errorHandler } = require('../middlewares')

userRouter.post('/signUp', signUp)
userRouter.post('/logIn', logIn)
userRouter.get('/check-admin', checkAdminRole)
userRouter.use(errorHandler)


module.exports = userRouter;