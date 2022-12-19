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
    },
    async dealLock(name){
        const coisas = await TeacherKey.find({teacherName: name}, {lockFID: 1, _id: 0, schedule: 1});
        console.log(JSON.stringify(coisas[0]).split('"')[7]);
        console.log(JSON.stringify(coisas[0]).split('"')[9]);
        var salas = []
        for(var i=0;i<coisas.length;i++){
            const aux = JSON.stringify(coisas[i]).split('"');
            const sala = 
                "lockID|"+
                aux[3]+
                "|schedule|"+
                aux[7].split(":")[0]+"|"+
                aux[9].split(":")[0];
            salas.push(sala);
        }
        return salas;
    }
}