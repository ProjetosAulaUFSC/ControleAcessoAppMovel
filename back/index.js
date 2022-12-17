require('dotenv').config();

const routes = require('./routes/routes');
const utils = require('./utils/utils');
const mongoString = process.env.DATABASE_URL;
const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
// app.use('/img', express.static('static'));

mongoose.connect(mongoString);

const database = mongoose.connection;
database.on('error', (error) =>{console.log(error);})
database.once('connected', ()=>{console.log('Banco de Dados conectado');})

const wss = new WebSocket.Server(
    {port: 8000},
    function () {console.log("WebSocker = 8000");}
);
var clientesOnline = [];
var waitingMatch = [];
wss.on("connection", function connection(ws) {
    ws.on('message', async function incoming(message){
        var m = JSON.parse(message);
        console.log(m);
        switch (m.tipo){
            case 'login':
                var flag = false;
                clientesOnline.forEach(user =>{
                    if(JSON.stringify(user) == JSON.stringify(m.data)){
                        flag = true;
                    }
                })
                if(!flag) clientesOnline.push(m.data);
                console.log('Cliente aceito. Atualmente existem '+clientesOnline.length+' cliente(s) online');
                for(var i=0;i<waitingMatch.length;i++){
                    if(waitingMatch[i].SUser == m.data[0]){
                        const match = waitingMatch[i];
                        const mail = await utils.getMail(match.FUser);
                        ws.send(JSON.stringify({
                            tipo: "match",
                            data: match,
                            Email: mail
                        }));
                    }
                }
                break;
            case 'logout':
                clientesOnline.pop(m.data);
                console.log('Até mais. Atualmente existem '+clientesOnline.length+' cliente(s) online');
                break;
            case 'toMatch':
                for(var i=0;i<waitingMatch.length;i++){
                    if(JSON.stringify(m.data) == JSON.stringify(waitingMatch[i])){return;}
                }
                waitingMatch.push(m.data);
                console.log(waitingMatch);
                break;
            case 'matched':
                waitingMatch.forEach(match =>{
                    if(JSON.stringify(match)==JSON.stringify(m.data)){
                        waitingMatch.pop(match);
                    }
                })
                console.log("Match concluído");
                break;  
        }
    });
})

app.listen(3000, "0.0.0.0");