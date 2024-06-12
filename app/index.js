const bodyParser = require("body-parser")
const express = require("express")
const ejs = require("ejs")
const path = require("path")
const app = express()
const port = 8080
const { Server } = require("socket.io");
const fs = require("fs")
const database = require('./database/database')()
const stationSchema = require("./database/stationSchema")
const stationReadingsModel = require("./database/stationRecords")

const io = new Server(3000,{ // creates socket server 
    cors:{
        origin: "http://localhost:8080",
        credentials: true
    },
    transports:["websocket","polling"]
})

io.on("connection", (socket) => {
    socket.on('newStation',async(station,quality)=>{ // when theres a new station 
        try {
            const e = await stationSchema.exists({station_id:`${station}`})
            if (!e){
                const newstation  = new stationSchema({
                    station_id:station
                })
                newstation.save()
                const newReading = new stationReadingsModel({
                    station_id:station,
                    reading:quality
                })
                newReading.save()
            }
        } catch (error) {
            console.log(error)
        }
        socket.stationID = station.toUpperCase()
        socket.broadcast.emit("newStation",socket.stationID,quality) // broadcast to clientside
    })
    socket.on("qualityChange",(station,quality)=>{ // when theres a change of quality
        try {
            const newReading = new stationReadingsModel({
                station_id:station,
                reading:quality
            })
            newReading.save()
        } catch (error) {
            console.log(error)
        }
        socket.broadcast.emit("qualityChange",socket.stationID,quality) // broadcast to client side 
    })
    socket.on("disconnect",()=>{
        var stationID = socket.stationID // if its a station
        if (stationID){
            socket.broadcast.emit("stationDisconnect",stationID)
        }
        
    })
})
app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get("/",async(req,res)=>{ 
    const stations = await stationSchema.find({},"station_id")
    res.render("pages/index/index",{"stations":stations})
})

app.listen(port,async(err)=>{
    if (!err){
        console.log(`listening on port ${port}`)
    }
})