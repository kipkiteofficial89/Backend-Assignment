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


// ✔ Register Api -- /user/api/v1/register (POST),
// ✔ Login Api -- /user/api/v1/login (GET),
// ✔ Get User Api -- /user/api/v1/getUser (GET),
// ✔ Get All User Api -- /user/api/v1/getAllUser (GET),
// ✔ Update User Api -- /user/api/v1/updateUser (PUT),
// ✔ Delete User Api -- /user/api/v1/deleteUser (DELETE)