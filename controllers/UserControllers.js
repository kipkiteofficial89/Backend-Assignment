const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createNewUser = await User({
            firstName,
            lastName,
            NIDNumber,
            phoneNumber,
            password: hashedPassword,
            bloodGroup,
        })
        const saveNewUser = await createNewUser.save();

        if (saveNewUser) {
            const token = jwt.sign({
                phoneNumber,
                userId: saveNewUser._id
            }, process.env.SECRET_KEY, {
                expiresIn: '7d'
            })
            res.cookie('_ru', token, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000 * 7
            })
            return res.status(200).json({
                msg: 'User registration successful.',
                token
            })
        }
        return res.status(500).json({
            msg: 'Server side error while registering.'
        })
    } catch (err) {
        console.log(err);
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const findUser = await User.findOne({ phoneNumber });
        const token = jwt.sign({
            phoneNumber,
            userId: findUser._id
        }, process.env.SECRET_KEY, {
            expiresIn: '7d'
        })
        res.cookie('_ru', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 * 7
        })
        return res.status(200).json({
            msg: 'User login successful.',
            token
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getUser = async (req, res) => {
    try {
        const getUser = await User.findById(req.userId);
        return res.status(200).json({
            user: getUser
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const getUsers = await User.find()
            .sort({ createdAt: -1 })
            .select({ password: 0 })

        return res.status(200).json({
            users: getUsers
        })
    } catch (err) {
        console.log(err);
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req;
        const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } = req.body;

        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(400).json({
                msg: 'User does not exist.'
            });
        }

        let hashedPassword = findUser.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        let fn = firstName || findUser.firstName;
        let ln = lastName || findUser.lastName;
        let nid = NIDNumber || findUser.NIDNumber;
        let ph = phoneNumber || findUser.phoneNumber;
        let bg = bloodGroup || findUser.bloodGroup;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    firstName: fn,
                    lastName: ln,
                    NIDNumber: nid,
                    phoneNumber: ph,
                    password: hashedPassword,
                    bloodGroup: bg
                }
            },
            { new: true }
        );

        if (updateUser) {
            return res.status(200).json({
                msg: 'User updated successfully.',
            });
        }

        return res.status(400).json({
            msg: 'Something went wrong when updating the user.'
        });
    } catch (err) {
        console.log(err);
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.userId);
        if (deleteUser) {
            return res.status(200).json({
                msg: 'User deleted successfully.'
            })
        }
        return res.status(400).json({
            msg: 'Something went to wrong when deleting the user.'
        })
    } catch (err) {
        console.log(err);
    }
}