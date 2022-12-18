const {Key, Teacher, TeacherKey} = require('../models/model');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res)=>{
    try{
        const data = await Teacher.aggregate([{$match:{name: req.body.name}}]);
        if(data.length == 0) return  res.status(404).json("Professor não cadastrado");
        else if(data[0].password == req.body.password){
            console.log(data[0]);
            if(data[0].name == "Admin")  return res.status(202).json({professor: data[0].name, fechadura: await Key.find({}, {lockId: 1, _id:0})});
            else return res.status(202).json({professor: data[0].name, fechadura: await TeacherKey.find({teacherName: data[0].name}, {lockFID: 1, _id: 0, schedule: 1})});
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
            if(req.body.name == "Admin"){
                const user = new Teacher({
                    name: name,
                    password: req.body.password
                    });
                const dataToSave = await user.save();
                return res.status(200).json({status: "Bem-vindo adm"});  
            }
            var docs = [];
            const keysDB = await Key.find({},{lockId: 1, _id: 0});
            for(i=0; i<keysDB.length; i++){
                for(j=0; j<req.body.key.length; j++){
                    if(JSON.stringify(keysDB[i]).split('"')[3] == req.body.key[j].id){
                        const relation = new TeacherKey({
                            lockFID: req.body.key[j].id,
                            teacherName: req.body.name,
                            schedule: [
                                req.body.key[j].time.min, 
                                req.body.key[j].time.max
                            ],
                            accepted: false
                        });
                        docs.push(relation);
                    }
                }
            }
            const keySet = await TeacherKey.insertMany(docs);
            if(keySet) {
                return res.status(400).json({})
            }
            const user = new Teacher({
                name: name,
                password: req.body.password
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
        if(req.body.name == "Admin") return res.status(200).json({message: "Sala aberta", lockId: req.body.lockId, professor: "Admin"});
        const user = await TeacherKey.aggregate([{$match:{teacherName: req.body.name}}]);
        if(user.length==0) return res.status(400).json("Docente não encontrado");
        for(i=0;i<user.length;i++){
            console.log(user[i].lockFID);
            if(req.body.lockId == user[i].lockFID){
                flag = true;
                break;
            }
        }
        if(flag) return res.status(200).json({message: "Sala aberta", lockId: req.body.lockId, professor: req.body.name});
        else return res.status(403).json({message: "Voce não tem autorizaçao para abrir essa sala"});
    }
    catch(error){
        return error;
    }
})

router.post('/salas', async (req,res)=>{
    var docs = []
    var sala;
    for(i=101; i<121; i++){
        sala = new Key({lockId:"A"+i})
        docs.push(sala);
    }   
    for(i=201; i<211; i++){
        sala = new Key({lockId:"A"+i})
        docs.push(sala);
    }
    for(i=301; i<321; i++){
        sala = new Key({lockId:"A"+i})
        docs.push(sala);
    }
    for(i=101; i<121; i++){
        sala = new Key({lockId:"C"+i})
        docs.push(sala);
    }
    // const salas = await Key.insertMany(docs);
    return res.status(200).json("Salas cadastradas");
})

module.exports = router;