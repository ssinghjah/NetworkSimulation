packetsDeliveredGlobal = [];
packetsTransmittedGlobal = [];

displayResults = function( nodeAPackets, nodeBPackets){

    createSummary();
    createPerNodeResults();
    //createEventLog();
    $("a.results").show();
    $("#results").show();
    onSummary();  
}


createPerNodeResults = function(){

    var numNodes = nodes.length;
    numNodes = numNodes > SETTINGS.MaxPerNodeResultsToDisplay ? SETTINGS.MaxPerNodeResultsToDisplay : numNodes;
    var values,label;

    // Inter Arrival Times
    for(var i=0; i<numNodes; i++)
    {
        values = $.map(nodes[i].packets, function(packet){return packet.interArrivalTime;});
        label = "Node " + nodes[i].name + ": Packet Inter Arrival Times (ms)";
        createLinePlot(values,label, "interPacket linePlot results");
        createHistogram(values, label + " Histogram", "interPacket results", 20);
    }   

     // Queue Delays
    for(var i=0; i<numNodes; i++)
    {
        var packetsDelivered = $.grep(nodes[i].packets, function( packet ) {return packet.delivered;});
        if(packetsDelivered.length > 0){
            values = $.map(packetsDelivered, function(packet){return packet.nextAttemptTime - packet.birthTime;});
            label = "Node " + nodes[i].name + ": Queue Delay (ms)";
            createLinePlot(values, label, "queueDelay linePlot results");
            createHistogram(values, label + " Histogram", "queueDelay results", 20);
        }
    }   

    // End to End Delays
    for(var i=0; i<numNodes; i++)
    {
        var packetsDelivered = $.grep(nodes[i].packets, function( packet ) {return packet.rxTime > 0;});
        if(packetsDelivered.length > 0){
            values = $.map(packetsDelivered, function(packet){return packet.rxTime - packet.birthTime;});
            createHistogram(values, "Node " + nodes[i].name + ": End to End Delay (ms)", "e2eDelay results", 20);
        }
    } 

    // Collisions per packets from node i to node j
    for(var i=0; i<numNodes; i++)
    {
        for(var j=0; j<numNodes; j++)
        {
            if(j == i)
                continue;
           var packetsTransmittedList = $.grep(nodes[i].packets, function(packet){return (packet.txTime > 0 && packet.dest == j);});
           if(packetsTransmittedList.length > 0)
           {
                values = $.map(packetsTransmittedList, function(packet){return packet.numCollisions;}); 
                createPie(values, "Node " + nodes[i].name + " to " + nodes[j].name + " : Collisions Per Packet", "collisions results", "collisionsPie" + i + j);
            }
        }
    }
}

// Common Stuff
var addStatisticsCell = function(className, id){

 var statisticsArea = d3.select("#results");
 var statisticsCell = statisticsArea.append("div").attr({"class":"row paddingTop " + className}).append("div").attr({"class":"col-md-12"});
 if(id !== null)
    statisticsCell.attr("id",id);
 return statisticsCell;
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

var margin = {top: 50, right: 30, bottom: 50, left: 70},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;