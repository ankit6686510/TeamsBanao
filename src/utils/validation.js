const validator = require("validator");

const validateSignUpData = (data) => {
    const { firstName, lastName, emailId, password } = data;

    if (!firstName || !lastName) {
        throw new Error("Write valid name");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!!");
    }
};

module.exports = {
    validateSignUpData,
};
