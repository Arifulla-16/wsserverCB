const express = require("express");
const bodyParser =require("body-parser");
const WebSocket = require("ws");
const Mongoose = require("mongoose");

Mongoose.set('strictQuery', true);
const { urlencoded } = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(urlencoded({extended:true}));

Mongoose.connect("mongodb+srv://skarfistark:arifulla616@cluster0.6yfrdov.mongodb.net/chatDB",()=>{
    console.log("cntd");
});

const chatSchema = new Mongoose.Schema({
    name:String,
    text:String
});

const Chat = new Mongoose.model("Chat",chatSchema);

const server = require("http").createServer(app);

const wss = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws,req) {
  console.log("new connection");
  
  ws.on('message', function message(message) {
    var msg = message+"";
    if(msg.slice(0,5)===".;:--"){
      var chat = new Chat({
        name: ws.id,
        text:" has left."
      });
      chat.save();
      wss.clients.forEach((client)=>{
        if(client.readyState === WebSocket.OPEN){
          client.send(JSON.stringify({name:ws.id,msg:" has left."}));
        }
      });
    }
    else if(msg.slice(-5)==="*&#@%"){
      ws.id=msg.slice(0,-5);
      var chat = new Chat({
        name: ws.id,
        text:" has joined!!"
      });
      chat.save();
      wss.clients.forEach((client)=>{
        if(client.readyState === WebSocket.OPEN){
          client.send(JSON.stringify({name:ws.id,msg:" has joined!!"}));
        }
      });
    }
    else{
      var chat = new Chat({
        name: ws.id,
        text:message+""
      });
      chat.save();
      wss.clients.forEach((client)=>{
        if(client.readyState === WebSocket.OPEN){
          client.send(JSON.stringify({name:ws.id,msg:message+""}));
        }
      });
    }
  });

});


server.listen(process.env.PORT,()=>console.log("ws on 3000"));
