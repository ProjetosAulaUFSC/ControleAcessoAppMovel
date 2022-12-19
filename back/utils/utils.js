require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
    async setToken(name, password){
        const payload = {
            "name" : name,
            "password" : password
        }
        const token = jwt.sign(payload, process.env.SECRET, {"algorithm":"HS256"});
        return token;
    }
}