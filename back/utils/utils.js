const {json} = require('body-parser');
const {Locker, Teacher} = require('../models/model');

module.exports = {
    async retLogin(name){
        try{
            const data = await Teacher.find({name: name});
            var aux = "";
            for(i=0; i<data[0].keys.length; i++){
                aux += data[0].keys[i];
            }
            console.log(aux);
            return aux
            
        }
        catch(error){
            return 0;
        }
    }
}