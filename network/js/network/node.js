function Node(id, name, position){

    this.position = position;
    this.name = name;
    this.nodeId = id;
    this.packets = [];
    this.currentPacket = 0;
    this.maxPropagationDelay;

 this.setMaxPropagationDelay = function(){
        var maxDistance = SETTINGS.InterNodeDistance;
        var currentDistance = 0;
        var numNodes = nodes.length;
        for(var i = 0; i < numNodes; i++)
        {
            if(i !== this.nodeId)
            {
                currentDistance = Math.abs(this.position - nodes[i].position);
                if(currentDistance > maxDistance)
                {
                    maxDistance = currentDistance;
                }   
            }
        }
        this.maxPropagationDelay = maxDistance / SETTINGS.PropagationSpeed;
    }
}                  

Node.prototype.start = function(){

    this.packets = new PacketGenerator().generate(this.nodeId, new Random((Math.random(1,800))*150));
    this.setMaxPropagationDelay();
    this.csmaCd = new CSMACD( this.name, buses[NodeBusMap[this.nodeId]], this.maxPropagationDelay, this.onPacketAttempt, this.onPacketSent, this.onBusFree, this);
    this.csmaCd = sim.addEntity(this.csmaCd);
    this.setTimer(0).done(this.csmaCd.attemptToTransmit,this.csmaCd).setData(this.packets[this.currentPacket])
}

Node.prototype.onPacketSent = function(){
        
        // If there is not collision yet, packet has been delivered 
        this.packets[this.currentPacket].rxTime =  this.packets[this.currentPacket].txTime + this.maxPropagationDelay + SETTINGS.TransmissionTime;
        if($.inArray(this.packets[this.currentPacket].dest, NodeSubnetMap[this.nodeId]) !== -1) {
            this.packets[this.currentPacket].delivered = true;
        }
        this.currentPacket++;
}

Node.prototype.onBusFree = function(){
        
        // Transmit next packet
        this.setTimer(0).done(this.csmaCd.attemptToTransmit,this.csmaCd).setData(this.packets[this.currentPacket]);
}


Node.prototype.onPacketAttempt = function(packet){
        
        packet.txTime = this.sim.time();
        // Update the transmitted time 
}


