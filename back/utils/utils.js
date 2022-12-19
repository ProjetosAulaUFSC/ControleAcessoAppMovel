require('dotenv').config();
const JWT = require('jose');

module.exports = {
    setToken(name, password){
        const payload = {
            "name" : name,
            "password" : password
        }
        return HMACSHA256("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."+base64UrlEncode(payload),process.env.SECRET);
    }
}