const mongo = require('mongoose')

const connection = async()=>{
    try {
        mongo.set("strictQuery", false);
        await mongo.connect("mongodb+srv://muki119:1sUvdLLr5Zk5eKoq@cluster0.y1dfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0") // try to connect to the database 
        console.log("Database connected") // display that it has connected
    } catch (error) { //otherwise
        throw error //throw an error
    }
}



module.exports = connection