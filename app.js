const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { sent } = require('./sent');
const { recieve } = require('./recieve');
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let wsArr = [];
wss.on('connection', async (ws) => {
    wsArr.push(ws);
    //connection is up, let's add a simple simple event
    ws.on('message', async (message) => {

        //log the received message and send it back to the client
        if (message === 'Send') {
            ws.send(`Executing the command!! -> ${message}`);
            // let res = Promise.all(sent, recieve);
            // console.log(res)
            let time = await sent();
            ws.send(`Message sent at -> ${JSON.stringify(time)}`);
        }
        if (message === 'Recieve') {
            ws.send(`Executing the command!! -> ${message}`);
            let time = await recieve();
            ws.send(`Message recieved at -> ${JSON.stringify(time)}`);
        }
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

setInterval(() => {
    wsArr = wsArr.filter(el => el.readyState !== WebSocket.CLOSED);
    console.log('Length of active ws sockets:', wsArr.length)
}, 10000);
server.listen(3000, () => {
    console.log('Server is up')
});