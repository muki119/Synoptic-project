const io= require("socket.io-client" );
const socket = io('http://localhost:3000');

var station = process.argv[2].toUpperCase()
var quality = process.argv[3]
// socket.on("connect",()=>{
    
// })
socket.emit("newStation",station,quality)
setInterval(()=>{
    socket.emit("qualityChange",quality)

    
}, 2000);

socket.io.on("reconnect", (attempt) => { // if server restarts
    socket.emit("newStation",station,quality) // send=
});