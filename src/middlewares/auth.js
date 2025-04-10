const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // ✅ Capitalized to follow convention

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("token not found");
        }

        const decodedObject = jwt.verify(token, "Ankitkumarjha@123");
        const { _id } = decodedObject;

        const user = await User.findById(_id); // ✅ Now this is fine

        if (!user) {
            throw new Error("user not found");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized");
    }
};

module.exports = {
    userAuth
};
