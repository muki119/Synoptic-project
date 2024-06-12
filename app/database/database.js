const mongo = require('mongoose')

const connection = async()=>{
    try {
        mongo.set("strictQuery", false);
        await mongo.connect("mongodb+srv://muki119:1sUvdLLr5Zk5eKoq@cluster0.y1dfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Database connected")
    } catch (error) {
        throw error
    }
}



module.exports = connection