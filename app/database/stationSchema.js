
const mongo = require('mongoose')
const {Schema} = require("mongoose")

const stationSchema = Schema({
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