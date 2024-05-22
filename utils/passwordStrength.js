// utils/passwordStrength.js
const passwordValidator = require('password-validator');

const schema = new passwordValidator();
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

const validatePassword = (password) => {
    return schema.validate(password, { list:true });
};
module.exports = { validatePassword };