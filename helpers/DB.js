const mongoose = require('mongoose');

const DB = async (MONGO_URI) => {
    try {
        mongoose.connect(MONGO_URI)
        console.log('DATABASE CONNECTED!');
    } catch (err) {
        console.log(`Error while connecting database! ${err}`);
        process.exit(1);
    }
}

module.exports = DB;