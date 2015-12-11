createSummary = function(){
    
    var statisticsCell = addStatisticsCell( "summary results");
    statisticsCell.append("label").text("Simulation Duration : " + ((sim.time()*SETTINGS.ConvertToSec).toFixed(1)) + " sec");
    createRouterSummary();
    createPerNodeSummary();    
    createPathSummary();
}

createPerDestinationNodeDetails = function( srcId, destId ){

        var G = 0, S = 0;

        var simTime = (SETTINGS.SimTime * SETTINGS.ConvertToSec);
        var packetTransmissionTime = (SETTINGS.TransmissionTime)*SETTINGS.ConvertToSec;

        var destination = nodes[destId];
        var e2eDelay = 0, throughput = 0, collisionsPerPacket = 0, interArrivalTime = 0, numAttempts = 0;

        var packetsDeliveredList = $.grep(nodes[srcId].packets, function(packet){return packet.delivered && packet.dest == destId ;});
       
        packetsDeliveredGlobal[srcId][destId] = packetsDeliveredList;
        var packetsDelivered = packetsDeliveredList.length;

         // End to End Delay
        if(packetsDeliveredList.length > 0)
        {
           var e2eDelayList = $.map(packetsDeliveredList, function(packet){return packet.rxTime - packet.birthTime;});
           var e2eDelay = getAverage(e2eDelayList);   
           e2eDelay = e2eDelay.toFixed(3) + " msec";
        }

        // Throughput
        if(packetsDeliveredList.length > 0)
        { 
          throughput = calculateThroughput(packetsDelivered); 
          S += (packetsDelivered / simTime ) * packetTransmissionTime;
        }
       
       //Number of Attempts and Collisions
       var packetsTransmittedList = $.grep(nodes[srcId].packets, function(packet){return packet.txTime > 0 && packet.dest == destId;});
       packetsTransmittedGlobal[srcId][destId] = packetsDeliveredList;
       if(packetsTransmittedList.length > 0)
       {
         // Attempts 
         $.each(packetsTransmittedList, function(index, packet){numAttempts += packet.numCollisions + 1;}); 
         G += (numAttempts / simTime )* packetTransmissionTime;
         
         // Collisions
         var collisionsList = $.map(packetsTransmittedList, function(packet){return packet.numCollisions;});
         collisionsPerPacket = getAverage(collisionsList)
         collisionsPerPacket = collisionsPerPacket.toFixed(2);
      }


      var details = {
      "Desination": destination.name,
      "Throughput":throughput, 
      "Packets Delivered":packetsDelivered,
      "Number of Attempts":numAttempts,
      "Successful Attempts":((packetsDelivered/numAttempts)*100).toFixed(2) + " %",
      "Average End to End Delay" : e2eDelay, 
      "Collisions per packet":collisionsPerPacket
    };
    
      return details;

        
}


createPerNodeSummary = function(){

    var numNodes = nodes.length;
    // Source nodes
    for(var i = 0; i < numNodes; i++)
    {

        // Inter Arrival Time
       var interArrivalTimeList = $.map(nodes[i].packets, function(packet){return packet.interArrivalTime; });
       interArrivalTime = getAverage(interArrivalTimeList).toFixed(3) + " msec";
       packetsDeliveredGlobal[i] = [];
       packetsTransmittedGlobal[i] = [];
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
               var detail = createPerDestinationNodeDetails(i, j);
               details.push(detail);
            }
        }

        var heading = "Node " + nodes[i].name + " Summary";
        columns = ["Desination", "Throughput", "Packets Delivered", "Number of Attempts", "Successful Attempts", "Collisions per packet", "Average End to End Delay"];
        createTable("summary", heading, columns, details);
        
    }
}


createRouterSummary = function(){

    var numRouters = routers.length;
    var routerSummary = [];
    for(var i = 0; i < numRouters; i++)
    {
      var router = routers[i];
      var name = router.name;
      var utilization = (router.busyTime/SETTINGS.SimTime)*100;
      utilization = utilization.toFixed(2) + " %";
      
      var inputQueueDelay = router.inputQueueDelay / router.packetsProcessed;
      inputQueueDelay = inputQueueDelay.toFixed(3) + " msec";
      
      var packetsDelivered = router.packetsDelivered;
      
      var outputQueueDelay = router.outputQueueDelay / packetsDelivered;
      outputQueueDelay = outputQueueDelay.toFixed(3) + " msec";
      
      routerSummary.push(
       {
          "Name": routers[i].name,
          "Utilization":utilization,
          "Input Queue Delay": inputQueueDelay,
          "Output Queue Delay":outputQueueDelay,
          "Throughput": calculateThroughput(packetsDelivered)
       }
     ); 
        
    }

    var heading = "Router Summary";
    columns = ["Name", "Utilization", "Input Queue Delay","Output Queue Delay", "Throughput"];
    createTable("summary", heading, columns, routerSummary);          
}


calculateThroughput = function(packetsDelivered){
    var simTime = (SETTINGS.SimTime * SETTINGS.ConvertToSec);
    var throughput = parseFloat( packetsDelivered * (SETTINGS.PacketSize * 8)/simTime).toFixed(3);
    throughput = bitsToSize(throughput);
    return throughput; 
}