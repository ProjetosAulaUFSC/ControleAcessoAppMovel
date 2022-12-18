const {json} = require('body-parser');
const {key, Teacher} = require('../models/model');

module.exports = {
    async retLogin(name){
        try{
            const data = await Teacher.aggregate([{$match:{name: name}}]);
            return data.key;            
        }
        catch(error){
            console.log(error);
            return "nenhuma sala, pois tivemos erro no sistema";
        }
    }
}