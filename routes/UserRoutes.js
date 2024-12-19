const express = require('express');
const UserRouter = express.Router();
const {
    registerUser,
    loginUser,
    getUser,
    getAllUser,
    updateUser,
    deleteUser
} = require('../controllers/UserControllers');
const {
    registerValidation,
    loginValidation
} = require('../validators/UserValidators');
const { validationResults } = require('../helpers/ValidationResults');
const { VerifyUserMiddleware } = require('../middlewares/VerifyUserMiddleware');

UserRouter.post('/register', registerValidation, validationResults, registerUser);
UserRouter.get('/login', loginValidation, validationResults, loginUser);
UserRouter.get('/getUser', VerifyUserMiddleware, getUser);
UserRouter.get('/getAllUser', getAllUser);
UserRouter.put('/updateUser', VerifyUserMiddleware, updateUser);
UserRouter.delete('/deleteUser', VerifyUserMiddleware, deleteUser);

module.exports = UserRouter;