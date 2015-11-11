function PacketGenerator(){

    var selectDestination = function(src)
    {
        // have a list of nodes and pick one at random
        var numNodes = nodes.length;
        var destination = Math.round(CustomRandom.get(1, numNodes - 1));
        destination = src + destination;
        destination = destination > ( numNodes - 1 ) ? ( numNodes - 1 ) % destination : destination;
        if(src === 0)
            return 1;
        else return 0;
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