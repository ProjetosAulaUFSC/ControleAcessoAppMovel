const {Locker, Teacher} = require('../models/model');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');
const ObjectId = require('mongodb').ObjectId;

router.post('/login', async (req, res)=>{
    try{
        const data = await Teacher.aggregate([{$match:{name: req.body.name}}]);
        if(data.length == 0) return  res.status(404).json("Professor não cadastrado");
        else if(data[0].password == req.body.password){
            const list = await utils.retLogin(req.body.name);
            return res.status(202).json("Seja bem-vindo, ", data[0].username, "\nVocê tem acesso às fechaduras ", list);
        }
        else return  res.status(401).json("Senha incorreta");
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }
})
router.post('/register', async (req, res)=>{
    try{
        const name = req.body.name;
        const data = await Teacher.aggregate([{$match:{name: name}}]);
        if(data.length == 0){
            var keys = [];
            for(i=0; i<req.body.key.length; i++){
                var aux = await Locker.aggregate([{$match:{lockId:req.body.key[i]}}])
                if(aux.length>0) keys.push(aux[0]);
            }
            const user = new Teacher({
                name: name,
                password: req.body.password,
                key: keys
                });
            const dataToSave = await user.save()
            return res.status(200).json("Cadastrado com sucesso");
        }
        else return res.status(406).json("Docente já cadastrado");
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
})



module.exports = router;