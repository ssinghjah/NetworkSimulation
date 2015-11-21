createSummary = function(){
    
    var statisticsCell = addStatisticsCell("summary results");

    var panel = statisticsCell.append("div").attr("class","panel panel-default");
    var heading = panel.append("div").attr({"class":"panel-heading"});
    heading.text("Summary ( Simulation Duration : " + ((sim.time()*SETTINGS.ConvertToSec).toFixed(1)) + " sec)");

    var columns = ["Node","Number of Attempts","Packets Delivered","Throughput", "Collisions per packet", "Average End to End Delay", "Average Inter Arrival Time"]
    
    var summary = [];
    var numNodes = nodes.length;
    for(var i = 0; i < numNodes; i++)
    {
       var node = nodes[i];
       var queueDelay = 0, e2eDelay = 0, throughput = 0, collisionsPerPacket = 0, interArrivalTime = 0, numAttempts = 0;

       var packetsDeliveredList = $.grep(nodes[i].packets, function(packet){return packet.rxTime > 0;});
       var packetsDelivered = packetsDeliveredList.length;

       if(packetsDeliveredList.length > 0){
         
         var e2eDelayList = $.map(packetsDeliveredList, function(packet){return packet.rxTime - packet.birthTime - nodes[i].maxPropagationDelay ;});
         var e2eDelay = getAverage(e2eDelayList);
                 
         throughput = parseFloat( packetsDelivered * (SETTINGS.PacketSize * 8)/(SETTINGS.SimTime * SETTINGS.ConvertToSec)).toFixed(3);
         throughput = bitsToSize(throughput);
        
         e2eDelay = e2eDelay.toFixed(3) + " msec";
       }


       var interArrivalTimeList = $.map(nodes[i].packets, function(packet){return packet.interArrivalTime; });
       interArrivalTime = getAverage(interArrivalTimeList).toFixed(3) + " msec";

       var packetsTransmittedList = $.grep(nodes[i].packets, function(packet){return packet.txTime > 0;});
       if(packetsTransmittedList.length > 0){
         $.each(packetsTransmittedList, function(index, packet){numAttempts += packet.numCollisions + 1;}); 
         var collisionsList = $.map(packetsTransmittedList, function(packet){return packet.numCollisions;});
         collisionsPerPacket = getAverage(collisionsList).toFixed(3);
      }


       var collisions = 0;
       summary.push({
        "Node":node.name,
        "Number of Attempts":numAttempts, 
        "Packets Delivered":packetsDelivered,
        "Throughput":throughput, 
        "Average End to End Delay" : e2eDelay,
        "Average Inter Arrival Time":interArrivalTime, 
        "Collisions per packet":collisionsPerPacket });
       
    }


    var table = panel.append("table").attr("class","table table-striped table-bordered");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

   
    // create a row for each object in the summary
    var rows = tbody.selectAll("tr")
        .data(summary)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td").html(function(d) { return d.value; });

}

function bitsToSize(bits) {
   var sizes = ['Bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
   if (bits == 0) return '0 Bps';
   var i = parseInt(Math.floor(Math.log(bits) / Math.log(1000)));
   return Math.round(bits / Math.pow(1000, i), 2) + ' ' + sizes[i];
};

function getAverage(array){
    var total = 0;
    var length = array.length;
    for (var i = 0; i < length; i++) {
        total += array[i];
    }
    return total / length;
}