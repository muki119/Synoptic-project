const socket = io('http://localhost:3000'); // connect to the server on port 3000

function addTableRow(station,quality,currentTime){ // 
    if ($(`tr[data-station="${station}"]`).length != 0 ){ // if the station is already present on the table 
        changeQuality(station,quality) // just change the quality
        return
    }
    const newElement =  //  otherwise create a new row 
    `
             <tr data-station='${station}' >
                <td>${station}</td>
                <td id="Quality">${quality}</td>
                <td id="colourDisplay" class="${quality}"></td>
                <td id="lastOnline">${new Date(currentTime).toUTCString()}</td>

            </tr>
    `
    $("#stationTable>tbody").append(newElement) // add the row at the end of the table
}

function changeQuality(station,quality,currentTime){
    var rowElement  = $(`tr[data-station="${station}"]`) 

    if (rowElement.length == 0){ // if the row dosent exist
        addTableRow(station,quality,currentTime) // create it 
    }else{ // otherwise 
        $(`tr[data-station='${station}']>td#Quality`).text(quality); // change the quality of the station 
        $(`tr[data-station='${station}']>td#colourDisplay`).attr('class', `${quality}`); // change the status color
        if (currentTime){
            $(`tr[data-station='${station}']>td#lastOnline`).text(new Date(currentTime).toUTCString());// set the last online to the new time
        } 
    }
}

socket.on('newStation',(station,quality,currentTime)=>{ // when a newstation comes in
    addTableRow(station,quality,currentTime) //add to table
})
socket.on("qualityChange",(station,quality,currentTime)=>{ // on station quality change
    if (station == null){
        return
    }
    changeQuality(station,quality,currentTime) // change the quality of station
})
socket.on("stationDisconnect",(stationID)=>{
    changeQuality(stationID,"disconnected")
})
