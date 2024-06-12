const mongo = require('mongoose')
const {Schema} = require("mongoose")

const stationReadingsSchema = Schema({
    station_id:{
        type:String,
        required:true
    },
    reading:{
        type:String,
        required:true,
    },
    time:{
        type:Date,
        default:Date.now
    }
})

const stationReadingsModel = mongo.model("stationReadings",stationReadingsSchema)

module.exports =stationReadingsModel;