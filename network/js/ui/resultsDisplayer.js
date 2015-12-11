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

    createPathSummary();
    createPacketDelayDetails();
}




createPacketDelayDetails = function(){

    var numNodes = nodes.length;
    
    // Source nodes
    for(var i = 0; i < numNodes; i++)
    {

        // Inter Arrival Time
       var details = [];
        // destination nodes
        for(var j = 0; j < numNodes; j++)
        {
            if( j == i)
            {
              continue;
            }
            else
            {

                var simTime = (SETTINGS.SimTime * SETTINGS.ConvertToSec);
              
                var destination = nodes[j];
            
                var packetsDeliveredList = packetsDeliveredGlobal[i][j];
                var packetsDelivered = packetsDeliveredList.length;

                 // End to End Delay
                if(packetsDeliveredList.length > 0)
                {
                   var e2eDelayList = $.map(packetsDeliveredList, function(packet){return packet.rxTime - packet.birthTime;});
                   var e2eDelay = getAverage(e2eDelayList);   
                   e2eDelay = e2eDelay.toFixed(3) + " msec";
                }


                // Router Input Queue Delay
                if(packetsDeliveredList.length > 0)
                {
                   var routerInputDelayList = $.map(packetsDeliveredList, function(packet)
                   {
                      var numDelays = packet.routerInputQueueDelays.length;
                      var totalDelay = 0;
                      for( var i = 0; i < numDelays; i++)
                      {
                        totalDelay += packet.routerInputQueueDelays[i].delay;
                      }
                      return totalDelay;
                   });
                   var routerInputQueueDelay = getAverage(routerInputDelayList);   
                   routerInputQueueDelay = routerInputQueueDelay.toFixed(3) + " msec";
                }

                // Node Output Queue Delay
                if(packetsDeliveredList.length > 0)
                {
                   var nodeOutputDelayList = $.map(packetsDeliveredList, function(packet)
                   {
                      return packet.txTime - packet.birthTime;
                   });
                   var nodeOutputDelay = getAverage(nodeOutputDelayList);   
                   nodeOutputDelay = nodeOutputDelay.toFixed(3) + " msec";
                }

                // Router Output Queue Delay
                if(packetsDeliveredList.length > 0)
                {
                   var routerOutputDelayList = $.map(packetsDeliveredList, function(packet)
                   {
                      var numDelays = packet.routerOutputQueueDelays.length;
                      var totalDelay = 0;
                      for( var i = 0; i < numDelays; i++)
                      {
                        totalDelay += packet.routerOutputQueueDelays[i].delay;
                      }
                      return totalDelay;
                   });
                   var routerOutputQueueDelay = getAverage(routerOutputDelayList);   
                   routerOutputQueueDelay = routerOutputQueueDelay.toFixed(3) + " msec";
                }

                // Router Processing Delay
                if(packetsDeliveredList.length > 0)
                {
                   var routerProcessingDelayList = $.map(packetsDeliveredList, function(packet)
                   {
                      var numDelays = packet.routerProcessingDelays.length;
                      var totalDelay = 0;
                      for( var i = 0; i < numDelays; i++)
                      {
                        totalDelay += packet.routerProcessingDelays[i];
                      }
                      return totalDelay;
                   });
                   var routerProcessingDelay = getAverage(routerProcessingDelayList);   
                   routerProcessingDelay = routerProcessingDelay.toFixed(3) + " msec";
                }


                 // Transmission Delays
                if(packetsDeliveredList.length > 0)
                {
                   var transmissionDelayList = $.map(packetsDeliveredList, function(packet){return packet.transmissionDelays;});
                   var transmissionDelay = getAverage(transmissionDelayList);   
                   transmissionDelay = transmissionDelay.toFixed(3) + " msec";
                }


                // Propagation Delays
                if(packetsDeliveredList.length > 0)
                {
                   var propagationDelayList = $.map(packetsDeliveredList, function(packet){return packet.propagationDelays;});
                   var propagationDelay = getAverage(propagationDelayList);   
                   propagationDelay = propagationDelay.toFixed(3) + " msec";
                }


                  
                  var detail = {
                  "Destination": destination.name,
                  "Node Output Queue": nodeOutputDelay,
                  "Router Input Queue":routerInputQueueDelay,
                  "Router Output Queue":routerOutputQueueDelay,
                  "Router Processing" : routerProcessingDelay,
                  "Transmission":transmissionDelay,
                  "Propagation":propagationDelay,
                  "End to End" : e2eDelay, 
                };

                details.push(detail);
    
            }
        }

        var heading = "Node " + nodes[i].name + " Delays";
        columns = ["Destination", "Node Output Queue", "Router Input Queue", "Router Processing", "Router Output Queue", "Propagation", "Transmission", "End to End"];
        createTable("results packetDelays", heading, columns, details);
        
    }

}



createPathSummary = function()
{
    var numNodes = nodes.length;  
    for (var i = 0; i < numNodes; i++) 
    {
        for(var j =0; j < numNodes; j++)
        {
          if( j == i)
            continue;

          var path = $.map(packetsDeliveredGlobal[i][j].slice(1,SETTINGS.NumPathTrace), 
            function(packet){ 
            if(packet.path.length > 1) 
            {
                var path = "";
                for( var l = 0; l < packet.path.length; l++)
                {
                    path += routers[packet.path[l]].name + "-";
                }
                path = path.substring(0, path.length - 1);

                var pathDetails = 
                  {
                      "Path": path,
                      "Time Instant":packet.linkState.time.toFixed(1) + " msec"
                  };
                var connectedRouters = NodeRouterMap[i];
                for( var k = 0; k < connectedRouters.length; k++)
                {
                    var routerId = connectedRouters[k];
                    var linkState = packet.linkState.values[routerId];
                    var columnName = "R" + (routerId + 1) + " Link Costs";
                    pathDetails[columnName] = linkState;
                }
                return pathDetails;
           }

          });

           if(path.length === 0)
            continue;

           var heading = "Path traced by packets from " + nodes[i].name + " to " + nodes[j].name;
           columns = ["Time Instant", "Path"];
           var connectedRouters = NodeRouterMap[i];
            for( var k = 0; k < connectedRouters.length; k++)
            {
                var routerId = connectedRouters[k];
                var columnName = "R" + (routerId + 1) + " Link Costs";
                columns.push(columnName)
            }

          createTable("pathTrace results", heading, columns, path);  

      }
    };
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