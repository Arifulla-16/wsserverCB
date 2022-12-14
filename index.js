const express = require("express");
const bodyParser =require("body-parser");
const Mongoose = require("mongoose");

Mongoose.set('strictQuery', true);
const { urlencoded } = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(urlencoded({extended:true}));

Mongoose.connect("mongodb+srv://skarfistark:arifulla616@cluster0.6yfrdov.mongodb.net/chatDB",()=>{
    console.log("cntd");
});

const chatSchema = new Mongoose.Schema({
    name:String,
    text:String
});

const Chat = new Mongoose.model("Chat",chatSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.post("/",(req,res)=>{
  res.redirect(`/${req.body.uname}`);
});

app.get("/:client",(req,res)=>{
  Chat.find({},(err,ans)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render("client",{clientName:req.params.client,chats:ans});
    }
  });
});

app.get("/admin/CleArchat",(req,res)=>{
  Chat.deleteMany({},(err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send({status:"deleted"});
    }
  });
});


app.listen(process.env.PORT,()=>{
  console.log("strtd");
});