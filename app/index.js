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
                const newStation  = new stationSchema({ // creates a new station document
                    station_id:station
                })
                newStation.save() // saves it to the database
                const newReading = new stationReadingsModel({ // creates a new readings document
                    station_id:station,
                    reading:quality
                })
                
                newReading.save() // daves it to the collection
            }
        } catch (error) {
            console.log(error)
        }
        const currentTime = new Date().toISOString()
        socket.stationID = station.toUpperCase()
        socket.broadcast.emit("newStation",socket.stationID,quality,currentTime) // broadcast to clientside
    })
    socket.on("qualityChange",async (station,quality)=>{ // when theres a change of quality
        let currentTime;
        try {
            const newReading = new stationReadingsModel({ // create a new station readings document with the new reading 
                station_id:station,
                reading:quality
            })
            newReading.save() // save it to the sdatabase
            currentTime = new Date().toISOString()
            await stationSchema.findOneAndUpdate({station_id:station},{last_Online:currentTime}) // updates the last time the sensors sent a reading
        } catch (error) {
            console.log(error)
        }
        socket.broadcast.emit("qualityChange",socket.stationID,quality,currentTime) // broadcast information to the  client sockets 
    })

    socket.on("disconnect",()=>{  // if a socket has disconnected 
        var stationID = socket.stationID // if its a station that has disconnected
        if (stationID){ // and the socket is a stations
            socket.broadcast.emit("stationDisconnect",stationID) // send a station disconnect event to the client side
        }
        
    })
})
app.use(express.static(path.join(__dirname,"public"))) // sets a static files path the the public folder 
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get("/",async(req,res)=>{ 
    try {
        const stations = await stationSchema.find({}) // get all stations
        res.render("pages/index/index",{"stations":stations}) // render page with station data
    } catch (error) {
        console.log(error)
    }

})

app.listen(port,async(err)=>{ // listen on the port 
    if (!err){  // if no error 
        console.log(`listening on port ${port}`) // notify that the server is now listening
    }else{
        console.log(err)
    }
})