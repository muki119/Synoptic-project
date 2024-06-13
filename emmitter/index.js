const io= require("socket.io-client" );
const socket = io('http://localhost:3000');

var station = process.argv[2].toUpperCase()
var quality = process.argv[3]
var oscilate = process.argv[4]
// socket.on("connect",()=>{
    
// })
socket.emit("newStation",station,quality)
setInterval(()=>{
    socket.emit("qualityChange",station,quality)
}, 2000);

if (oscilate){
    setInterval(()=>{
        socket.emit("qualityChange",station,quality=='good'?'bad':'good')
    }, 2700);
}

socket.io.on("reconnect", (attempt) => { // if server restarts
    socket.emit("newStation",station,quality) // send=
});