const bodyParser = require("body-parser")
const express = require("express")
const ejs = require("ejs")
const path = require("path")
const app = express()
const port = 8080
const { Server } = require("socket.io");
const fs = require("fs")

const io = new Server(3000,{ // creates socket server 
    cors:{
        origin: "http://localhost:8080",
        credentials: true
    },
    transports:["websocket","polling"]
})

io.on("connection", (socket) => {
    socket.on('newStation',(station,quality)=>{ // when theres a new station 
        console.log(station,quality)
        socket.broadcast.emit("newStation",station.toUpperCase(),quality) // broadcast to clientside
    })
    socket.on("qualityChange",(station,quality)=>{ // when theres a change of quality
        socket.broadcast.emit("qualityChange",station.toUpperCase(),quality) // broadcast to client side 
    })
})
app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get("/",(req,res)=>{ 
    res.render("pages/index/index")
})

app.listen(port,async(err)=>{
    if (!err){
        console.log(`listening on port ${port}`)
    }
})