
const mongo = require('mongoose')
const {Schema} = require("mongoose")

const stationSchema = Schema({ // creates a new schema  for the stations
    station_id :{
        type:String,
        unique:true,
    },
    last_Online:{
        type:Date,
        default:Date.now
    }
    
})

const stationsModel = mongo.model("Stations",stationSchema)

module.exports =stationsModel;