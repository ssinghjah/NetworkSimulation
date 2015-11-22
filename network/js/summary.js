createSummary = function(){
    
     
    var packetTransmissionTime = (SETTINGS.TransmissionTime)*SETTINGS.ConvertToSec;
    var simTime = (SETTINGS.SimTime * SETTINGS.ConvertToSec);
    var summary = [];
    var numNodes = nodes.length;
    var G = 0, S = 0, avgCollisionsPerPacket = 0, transmittedCount = 0;
    for(var i = 0; i < numNodes; i++)
    {
       var node = nodes[i];
       var queueDelay = 0, e2eDelay = 0, throughput = 0, collisionsPerPacket = 0, interArrivalTime = 0, numAttempts = 0;
      var packetsDeliveredList = $.grep(nodes[i].packets, function(packet){return packet.rxTime > 0;});
       var packetsDelivered = packetsDeliveredList.length;

       if(packetsDeliveredList.length > 0){
         
         var e2eDelayList = $.map(packetsDeliveredList, function(packet){return packet.rxTime - packet.birthTime - nodes[i].maxPropagationDelay ;});
         var e2eDelay = getAverage(e2eDelayList);
          
         throughput = parseFloat( packetsDelivered * (SETTINGS.PacketSize * 8)/simTime).toFixed(3);
         throughput = bitsToSize(throughput);
         S += (packetsDelivered / simTime )* packetTransmissionTime;
         e2eDelay = e2eDelay.toFixed(3) + " msec";
       }


       var interArrivalTimeList = $.map(nodes[i].packets, function(packet){return packet.interArrivalTime; });
       interArrivalTime = getAverage(interArrivalTimeList).toFixed(3) + " msec";

       var packetsTransmittedList = $.grep(nodes[i].packets, function(packet){return packet.txTime > 0;});
       if(packetsTransmittedList.length > 0){
         transmittedCount ++;
         $.each(packetsTransmittedList, function(index, packet){numAttempts += packet.numCollisions + 1;}); 
         G += (numAttempts / simTime )* packetTransmissionTime;
         var collisionsList = $.map(packetsTransmittedList, function(packet){return packet.numCollisions;});
         collisionsPerPacket = getAverage(collisionsList)
         avgCollisionsPerPacket += collisionsPerPacket;
         collisionsPerPacket = collisionsPerPacket.toFixed(3);
      }


       var collisions = 0;
       summary.push({
        "Node":node.name, 
        "Packets Delivered":packetsDelivered,
        "Throughput":throughput, 
        "Average End to End Delay" : e2eDelay,
        "Average Inter Arrival Time":interArrivalTime, 
        "Collisions per packet":collisionsPerPacket });
    }

    avgCollisionsPerPacket = avgCollisionsPerPacket/transmittedCount;
    var heading = "Overall Results ( Simulation Duration : " + ((sim.time()*SETTINGS.ConvertToSec).toFixed(1)) + " sec)";
    var columns = ["Traffic Load per Frame Time (G)","Throughput per Frame Time (S)","Average Collisions per Packet"];
    var overallSummary = [];
    overallSummary.push({
        "Traffic Load per Frame Time (G)":G.toFixed(3),
        "Throughput per Frame Time (S)":S.toFixed(3),
        "Average Collisions per Packet":avgCollisionsPerPacket.toFixed(3)
        });
    createTable("summary", heading, columns, overallSummary);
    
    heading = "Per Node Results ( Simulation Duration : " + ((sim.time()*SETTINGS.ConvertToSec).toFixed(1)) + " sec)";
    columns = ["Node", "Packets Delivered","Throughput", "Collisions per packet", "Average End to End Delay", "Average Inter Arrival Time"];
    createTable("summary", heading, columns, summary);
      
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