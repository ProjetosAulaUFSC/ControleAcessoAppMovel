const {Key, Teacher} = require('../models/model');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');
const ObjectId = require('mongodb').ObjectId;

router.post('/login', async (req, res)=>{
    try{
        const data = await Teacher.aggregate([{$match:{name: req.body.name}}]);
        if(data.length == 0) return  res.status(404).json("Professor não cadastrado");
        else if(data[0].password == req.body.password){
            return res.status(202).json({professor: data[0].name, fechadura: data[0].key});
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
            for(i=0; i<req.body.key.length; i++) keys.push(req.body.key[i]);
            const user = new Teacher({
                name: name,
                password: req.body.password,
                key: keys
                });
            const dataToSave = await user.save()
            return res.status(200).json({status: "Cadastrado com sucesso"});
        }
        else return res.status(406).json("Docente já cadastrado");
    }
    catch(error){
        return res.status(400).json({message: error.message})
    }
})
router.post('/unlock', async (req,res)=>{
    try{
        var flag = false;
        const user = await Teacher.aggregate([{$match:{name: req.body.name}}]);
        for(i=0;i<user[0].key.length;i++){
            if(req.body.lockId == user[0].key[i]) flag = true; break;
        }
        if(flag) return res.status(200).json({message: "Sala aberta", lockId: req.body.lockId, professor: req.body.name});
        else return res.status(403).json({message: "Voce não tem autorizaçao para abrir essa sala"});
    }
    catch(error){
        return error;
    }
})

module.exports = router;