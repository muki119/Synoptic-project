const socket = io('http://localhost:3000');

function addTableRow(station,quality){ // new station 
    if ($(`tr[data-station="${station}"]`).length != 0 ){
        changeQuality(station,quality)
        return
    }
    const elem = `
             <tr data-station='${station}' >
                <td>${station}</td>
                <td id="Quality">${quality}</td>
            </tr>
    `
    $("#stationTable>tbody").append(elem)
}

function changeQuality(station,quality){
    var elem  = $(`tr[data-station="${station}"]`)
    if (elem.length == 0){ // if the row dosent exist
        addTableRow(station,quality) // create it 
    }else{
        //console.log($(`tr[data-station='${station}']>td#Quality`).text())
        $(`tr[data-station='${station}']>td#Quality`).text(quality);
    }
}

socket.on('newStation',(station,quality)=>{ // when a newstation comes in
    addTableRow(station,quality) //add to table
})
socket.on("qualityChange",(station,quality)=>{ // on station qualioty change
    changeQuality(station,quality) // change the quality of station
})


// addTableRow("D","Poor") // tests
// changeQuality("D","Great")