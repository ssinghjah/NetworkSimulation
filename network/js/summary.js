createSummary = function(){
    
    var statisticsCell = addStatisticsCell( "summary results");
    statisticsCell.append("label").text("Simulation Duration : " + ((sim.time()*SETTINGS.ConvertToSec).toFixed(1)) + " sec");

    var packetTransmissionTime = (SETTINGS.TransmissionTime)*SETTINGS.ConvertToSec;
    var simTime = (SETTINGS.SimTime * SETTINGS.ConvertToSec);
    var summary = [];
    var numNodes = nodes.length;
    var G = 0, S = 0, avgCollisionsPerPacket = 0, avgEndToEndDelay = 0, transmittedCount = 0, deliveredCount = 0, avgSuccessPercentage = 0;
    
    // Source nodes
    for(var i = 0; i < numNodes; i++)
    {
        
        var node = nodes[i];
        var details = [];
        // Inter Arrival Time
        var interArrivalTimeList = $.map(nodes[i].packets, function(packet){return packet.interArrivalTime; });
        interArrivalTime = getAverage(interArrivalTimeList).toFixed(3) + " msec";

        // destination nodes
        for(var j = 0; j < numNodes; j++)
        {
          if( j == i)
            continue;
          var destination = nodes[j];
          var queueDelay = 0, e2eDelay = 0, throughput = 0, collisionsPerPacket = 0, interArrivalTime = 0, numAttempts = 0;

          var packetsDeliveredList = $.grep(nodes[i].packets, function(packet){return packet.delivered && packet.dest == j ;});
          var packetsDelivered = packetsDeliveredList.length;

           // End to End Delay
          if(packetsDeliveredList.length > 0)
          {
             var e2eDelayList = $.map(packetsDeliveredList, function(packet){return packet.rxTime - packet.birthTime - nodes[i].maxPropagationDelay ;});
             var e2eDelay = getAverage(e2eDelayList);    
             avgEndToEndDelay += e2eDelay;
             deliveredCount++;
             e2eDelay = e2eDelay.toFixed(3) + " msec";
          }

          // Throughput
          if(packetsDeliveredList.length > 0)
          { 
            throughput = parseFloat( packetsDelivered * (SETTINGS.PacketSize * 8)/simTime).toFixed(3);
            throughput = bitsToSize(throughput); 
            S += (packetsDelivered / simTime ) * packetTransmissionTime;
          }
         
         //Number of Attempts and Collisions
         var packetsTransmittedList = $.grep(nodes[i].packets, function(packet){return packet.txTime > 0 && packet.dest == j;});
         if(packetsTransmittedList.length > 0)
         {
           // Attempts 
           transmittedCount ++;
           $.each(packetsTransmittedList, function(index, packet){numAttempts += packet.numCollisions + 1;}); 
           G += (numAttempts / simTime )* packetTransmissionTime;
           avgSuccessPercentage += packetsDeliveredList.length * 100 /numAttempts;
           
           // Collisions
           var collisionsList = $.map(packetsTransmittedList, function(packet){return packet.numCollisions;});
           collisionsPerPacket = getAverage(collisionsList)
           avgCollisionsPerPacket += collisionsPerPacket;
           collisionsPerPacket = collisionsPerPacket.toFixed(2);
        }


            details.push({
            "Desination": destination.name,
            "Throughput":throughput, 
            "Packets Delivered":packetsDelivered,
            "Number of Attempts":numAttempts,
            "Successful Attempts":((packetsDelivered/numAttempts)*100).toFixed(2) + " %",
            "Average End to End Delay" : e2eDelay, 
            "Collisions per packet":collisionsPerPacket });
        }

    

      var heading = "Node " + node.name + " Summary";
      columns = ["Desination", "Throughput", "Packets Delivered", "Number of Attempts", "Successful Attempts", "Collisions per packet", "Average End to End Delay"];
      createTable("summary", heading, columns, details);
    }
       /*// Add to Per Node Results
       var collisions = 0;
       summary.push({
        "Node":node.name, 
        "Throughput":throughput, 
        "Packets Delivered":packetsDelivered,
        "Number of Attempts":numAttempts,
        "Successful Attempts":((packetsDelivered/numAttempts)*100).toFixed(2) + " %",
        "Average End to End Delay" : e2eDelay,
        "Average Inter Arrival Time":interArrivalTime, 
        "Collisions per packet":collisionsPerPacket });
      }
    */

    // Display Overall Results
    /*avgCollisionsPerPacket = avgCollisionsPerPacket/transmittedCount;
    avgEndToEndDelay = avgEndToEndDelay/deliveredCount;
    avgSuccessPercentage = avgSuccessPercentage/transmittedCount;

    var heading = "Overall Summary";
    var columns = ["Traffic Load per Frame Time (G)","Throughput per Frame Time (S)","Successful Attempts","Average Collisions per Packet", "Average End to End Delay"];
    var overallSummary = [];
    overallSummary.push({
        "Traffic Load per Frame Time (G)":G.toFixed(2),
        "Throughput per Frame Time (S)":S.toFixed(2),
        "Average Collisions per Packet":avgCollisionsPerPacket.toFixed(2),
        "Successful Attempts":avgSuccessPercentage.toFixed(2) + " %",
        "Average End to End Delay":avgEndToEndDelay.toFixed(2) + " msec"
        });
    createTable("summary", heading, columns, overallSummary);
    */
    /*// Display Per Node Results
    heading = "Node Summary";
    columns = ["Node", "Throughput", "Packets Delivered", "Number of Attempts", "Successful Attempts", "Collisions per packet", "Average End to End Delay", "Average Inter Arrival Time"];
    createTable("summary", heading, columns, summary);
    */  
}
