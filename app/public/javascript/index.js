const socket = io('http://localhost:3000');

function addTableRow(station,quality){ // new station 
    const elem = `
             <tr data-station='${station}' >
                <td>${station}</td>
                <td id="Quality">${quality}</td>
            </tr>
    `
    $("#stationTable").append(elem)
}

function changeQuality(station,quality){
    var elem  = $(`tr[data-station="${station}"]`)
    if (elem.length == 0){
        addTableRow(station,quality)
    }else{
        //console.log($(`tr[data-station='${station}']>td#Quality`).text())
        $(`tr[data-station='${station}']>td#Quality`).text(quality);
    }
}

socket.emit("newStation","bbw","eagle")
socket.on('newStation',(station,quality)=>{
    addTableRow(station,quality)
})
socket.on("qualityChange",(station,quality)=>{
    changeQuality(station,quality)
})


addTableRow("D","Poor")
changeQuality("D","Great")