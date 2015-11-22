displayResults = function( nodeAPackets, nodeBPackets){

    createSummary();
    createPerNodeResults();
    createEventLog();

    $("a.results").show();
    $("#results").show();
    onSummary();  
}


createPerNodeResults = function(){

    var numNodes = nodes.length;
    numNodes = numNodes > SETTINGS.MaxPerNodeResultsToDisplay ? SETTINGS.MaxPerNodeResultsToDisplay : numNodes;
    var values,label;

    for(var i=0; i<numNodes; i++)
    {
        values = $.map(nodes[i].packets, function(packet){return packet.interArrivalTime;});
        label = "Node " + nodes[i].name + ": Packet Inter Arrival Times (ms)";
        createLinePlot(values,label, "interPacket results");
        createHistogram(values, label + " Histogram", "interPacket results", 20);
    }   


    for(var i=0; i<numNodes; i++)
    {
        var packetsDelivered = $.grep(nodes[i].packets, function( packet ) {return packet.rxTime > 0;});
        if(packetsDelivered.length > 0){
            values = $.map(packetsDelivered, function(packet){return packet.txTime - packet.birthTime;});
            label = "Node " + nodes[i].name + ": Queue Delay (ms)";
            createLinePlot(values, label, "queueDelay results");
            createHistogram(values, label + " Histogram", "queueDelay results", 20);
        }
    }   


    for(var i=0; i<numNodes; i++)
    {
        var packetsDelivered = $.grep(nodes[i].packets, function( packet ) {return packet.rxTime > 0;});
        if(packetsDelivered.length > 0){
            values = $.map(packetsDelivered, function(packet){return packet.rxTime - packet.birthTime;});
            createHistogram(values, "Node " + nodes[i].name + ": End to End Delay (ms)", "e2eDelay results", 20);
        }
    } 


    for(var i=0; i<numNodes; i++)
    {
       var packetsTransmittedList = $.grep(nodes[i].packets, function(packet){return packet.txTime > 0;});
       if(packetsTransmittedList.length > 0)
       {
            values = $.map(packetsTransmittedList, function(packet){return packet.numCollisions;}); 
            createHistogram(values, "Node " + nodes[i].name + ": Collisions Per Packet", "e2eDelay results", 20);
        }
    }
}

// Common Stuff

var addStatisticsCell = function(className){

 var statisticsArea = d3.select("#results");
 var statisticsCell = statisticsArea.append("div").attr({"class":"row paddingTop " + className}).append("div").attr({"class":"col-md-12"});
 return statisticsCell;
}

var margin = {top: 50, right: 30, bottom: 50, left: 70},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;