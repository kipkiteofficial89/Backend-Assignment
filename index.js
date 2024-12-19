// import all the required packages
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const DB = require('./helpers/DB');
const UserRouter = require('./routes/UserRoutes');

// app initialization
const application = express();

// all the middlewares used by the app
application.use(cookieParser());
application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(helmet());
application.use(morgan('dev'));
application.use(cors());

// routes connection
application.use('/user/api/v1/', UserRouter);

// home router
application.get('/', (req, res) => {
    res.status(200).json({
        msg: "SERVER IS RUNNING! Type /user/api/v1/getAllUser to get all the users."
    })
})

// error handler middleware
application.use((err, req, res, next) => {
    res.status(500).send(err);
    next();
})

// connection utils
const PORT = process.env.PORT || 9090;
const MONGO_URI = process.env.MONGO_URI;

// database connection
DB(MONGO_URI).then(() => {
    application.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
    })
})