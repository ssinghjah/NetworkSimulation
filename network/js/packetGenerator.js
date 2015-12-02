function PacketGenerator(){

    var selectDestination = function(src)
    {
        // pick one node at random
        var numNodes = TotalNumNodes;
        var destination = Math.round(CustomRandom.get(1, numNodes - 1));
        var srcNodeNumber = src - NodeIdStart;
        destination = srcNodeNumber + destination;
        destination = destination > ( numNodes - 1 ) ?  destination %  numNodes : destination;
        destination += NodeIdStart;
        // If destination is in the same subnet, assign the destination's MAC address, else router will take care of the packet.
        return destination;        

}
    
this.generate = function(src, random)
{    
    var totalTime = 0;
    var packets = [];
    
    while(totalTime < SETTINGS.SimTime ){
       
        var nextFrameNum = random.exponential( 1 / SETTINGS.MeanInterPacket);
        var nextTimeInterval = nextFrameNum * SETTINGS.FrameSlot;
        var birthTime = totalTime + nextTimeInterval;
        var dest = selectDestination(src);
        packets.push(new Packet(src, dest, birthTime, nextTimeInterval));
        totalTime += nextTimeInterval;    
    }
    return packets;
}
} 