const jwt = require("jsonwebtoken");

exports.VerifyUserMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const { phoneNumber, userId } = decode;
        req.phoneNumber = phoneNumber;
        req.userId = userId;
        next();
    } catch (err) {
        next("Authentication failed!");
    }
};
