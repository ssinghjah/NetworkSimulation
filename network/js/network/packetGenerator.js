function PacketGenerator(){

    var selectDestination = function(src)
    {
        // pick one node at random
        var numNodes = TotalNumNodes;
        var destination = Math.round(CustomRandom.get(1, numNodes - 1));
        destination = src + destination;
        destination = destination > ( numNodes - 1 ) ?  destination %  numNodes : destination;
        // If destination is in the same subnet, assign the destination's MAC address, else router will take care of the packet.
        return destination;        

}
    
this.generate = function(src, random)
{    
    var totalTime = 0;
    var packets = [];
    var priority = SETTINGS.NodePriority[src];
    
    while(totalTime < SETTINGS.SimTime ){
       
        var nextFrameNum = random.exponential( 1 / SETTINGS.MeanInterPacket);
        var nextTimeInterval = nextFrameNum * SETTINGS.FrameSlot;
        var birthTime = totalTime + nextTimeInterval;
        var dest = selectDestination(src);
        packets.push(new Packet(src, dest, birthTime, nextTimeInterval, priority));
        totalTime += nextTimeInterval;    
    }
    return packets;
}
} 