const { body } = require('express-validator');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

exports.registerValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('Firstname should not be empty.')
        .isLength({ min: 4, max: 18 })
        .withMessage('Firstname should be between 4 to 18 chars.'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Lastname should not be empty.')
        .isLength({ max: 18 })
        .withMessage('Lastname should be maximum 18 chars.'),
    body('NIDNumber')
        .trim()
        .notEmpty().withMessage('NID number should not be empty.')
        .custom(async (NIDNumber) => {
            try {
                if (NIDNumber.length !== 10 && NIDNumber.length !== 17) {
                    return Promise.reject('NID number must be 10 digits or 17 digits.');
                }
                const findUser = await User.findOne({ NIDNumber });
                if (findUser) {
                    return Promise.reject('NID number already used.');
                }
            } catch (err) {
                console.log(err.message);
            }
        }),
    body('phoneNumber')
        .trim()
        .notEmpty().withMessage('Phone number should not be empty.')
        .custom(async (phoneNumber) => {
            try {
                const findUser = await User.findOne({ phoneNumber });
                if (findUser) {
                    return Promise.reject('Phone number already used.');
                }
            } catch (err) {
                console.log(err.message);
            }
        }),
    body('password')
        .notEmpty().withMessage('Password should not be empty.')
        .isLength({ min: 4 }).withMessage('Password must be minimum 4 chars.'),
    body('bloodGroup')
        .trim()
        .notEmpty().withMessage('What\'s your blood group?')

]

exports.loginValidation = [
    body('phoneNumber')
        .trim()
        .notEmpty().withMessage("Phone number should not be empty.")
        .custom(async (phoneNumber) => {
            try {
                const isPhoneNumber = await User.findOne({ phoneNumber });
                if (!isPhoneNumber) {
                    return Promise.reject("Invalid credentials.")
                }
            } catch (err) {
                console.log(err);
            }
        }),
    body('password')
        .notEmpty().withMessage("Password should not be empty.")
        .custom(async (password, { req }) => {
            try {
                const { phoneNumber } = req.body;
                const findUser = await User.findOne({ phoneNumber });
                if (!findUser) {
                    return Promise.reject("Invalid credentials.");
                } else {
                    const matchPassword = await bcrypt.compare(password, findUser.password);
                    if (!matchPassword) {
                        return Promise.reject("Invalid credentials.");
                    }
                }
            } catch (err) {
                console.log(err);
            }
        })
]