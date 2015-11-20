function Node(id, name, position){

    this.position = position;
    this.name = name;
    this.nodeId = id;
    this.busBusy = false;   
    this.transmitting = false;
    this.packets = [];
    this.currentPacket = 0;
    this.transmitting = false;
    this.transmitWhenIdle = false;
    this.maxPropagationDelay;
    this.random = new Random((Math.random(1,800))*150);
    this.onPacketSentSuccessfullyReq;
    this.nextAttemptReq;
    this.nodesTransmittingOnTheBus = [];

    this.recordNodeTransmissionStart = function(id){
        if($.inArray(id, this.nodesTransmittingOnTheBus) === -1){
            this.nodesTransmittingOnTheBus.push(id);
        }
    }

    this.recordNodeTransmissionStop = function (id) {
        this.nodesTransmittingOnTheBus = $.grep(this.nodesTransmittingOnTheBus, function(value) {
            return value != id;
        });
    }

    this.isBusBusy = function(){
        return this.nodesTransmittingOnTheBus.length !== 0;
    }

    this.setMaxPropagationDelay = function(){
        var maxDistance = 0;
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


    this.backoffDelay = function(numCollisions){
        
        // implement exponential backoff time here
        var maxBackoff = Math.pow(2,numCollisions) - 1;
        maxBackoff = maxBackoff > 8 ? 8 : maxBackoff;
        var backoffFrameSlot = Math.round(CustomRandom.get(0, maxBackoff));
        var backoffTimeDelay = backoffFrameSlot * SETTINGS.FrameSlot;
        // wait atleast till transmission time
        //backoffTimeDelay = backoffTimeDelay < SETTINGS.TransmissionTime ? SETTINGS.TransmissionTime + SETTINGS.InfinitesimalDelay : backoffTimeDelay;
       return backoffTimeDelay;
    }

    this.nextFrameSlotDelay = function(){

        var now = this.sim.time();
        var delay =  (SETTINGS.FrameSlot - now % SETTINGS.FrameSlot);
        return delay;
    }

    this.adjustToNextFrameSlot = function(timeDelay){

        var now = this.sim.time();
        var nextFrameSlot = (now + timeDelay);
        var adjustNextFrameSlot =  nextFrameSlot + (SETTINGS.FrameSlot - nextFrameSlot % SETTINGS.FrameSlot);
        var adjustedDelay = adjustNextFrameSlot - now;
        return adjustedDelay;
    }

} 

Node.prototype.getTransmissionTime = function(){
    return SETTINGS.TransmissionTime;
}
                  

Node.prototype.start = function(){

    this.packets = new PacketGenerator().generate(this.nodeId, this.random);
    this.setMaxPropagationDelay();
    this.nextAttemptReq = this.setTimer(this.packets[0].nextAttemptTime).done(this.attemptToTransmit);

}



Node.prototype.attemptToTransmit = function(){
    
     if(this.currentPacket > this.packets.length)
        sim.log("Node " + this.name + " : No Packets in Queue");
    else if(!this.isBusBusy())
    {

        var currentPacket = this.packets[this.currentPacket];
        var now = this.sim.time();
        if(currentPacket.nextAttemptTime <= now)
        {
            sim.log("Node " + this.name + " : Transmitting Packet");
            this.transmitting = true;
            this.busBusy = true;
            currentPacket.txTime = this.sim.time();          
            bus.transmit(currentPacket);
            // If the Node does not detect collision till 2*Max Tp, it assumes that the packet is sent successfully.
            this.onPacketSentSuccessfullyReq = this.setTimer((2*this.maxPropagationDelay + SETTINGS.TransmissionTime)).done(this.onPacketSentSuccessfully);
        }
        else 
        {
            this.transmitting = false;
            sim.log("Node " + this.name + " : Attempting. Attempt after " + (this.packets[this.currentPacket].nextAttemptTime - now));
            this.nextAttemptReq = this.setTimer(this.packets[this.currentPacket].nextAttemptTime - now).done(this.attemptToTransmit);
        }
    }
    else{
        sim.log("Node " + this.name + " : Attempting. Bus Busy ");
    }
}

Node.prototype.onPacketSentSuccessfully = function(){
        // If there is not collision yet, packet has been delivered 
        sim.log("Node " + this.name + " : Packet Sent Successfully");
        this.transmitting = false;
        this.busBusy = false;
        bus.stopTransmitting(this.packets[this.currentPacket]);
        this.packets[this.currentPacket].rxTime =  this.packets[this.currentPacket].txTime + this.maxPropagationDelay + SETTINGS.TransmissionTime;
        this.currentPacket++;
    
}

Node.prototype.onMessage = function(sender, message){
        if(message.status === "free"){
        
        // A node has stopped transmitting
        sim.log("Node " + this.name + " : Bus Free. Node " + message.src);
        this.recordNodeTransmissionStop(message.src);

        // If the bus is free and we have not scheduled a message for transmission, then do so.
       if(!this.isBusBusy() && this.nextAttemptReq.deliverAt < this.sim.time())  
        {  
            this.attemptToTransmit();
        }
    }
    else if ( message.status === "busy")
    {
         sim.log("Node " + this.name + " : Bus Busy - Packet Received from node " + message.src);
        // The bus is busy and the node has received a packet
        this.recordNodeTransmissionStart(message.src);
        
        if(this.transmitting && message.src != this.nodeId)
        {
            // A packet is received while the node is transmitting.
            // So a collision has happened.
            // Back off 
            var currPacket = this.packets[this.currentPacket];
            this.transmitting = false;
            this.onPacketSentSuccessfullyReq.cancel();
            bus.stopTransmitting(currPacket);
            currPacket.numCollisions++;
            var backoffDelay = this.backoffDelay(currPacket.numCollisions); 
            currPacket.nextAttemptTime = this.sim.time() + backoffDelay;
            this.nextAttemptReq = this.setTimer(backoffDelay).done(this.attemptToTransmit);
           
            sim.log("Node " + this.name + " : Stopping Transmission");
            sim.log("Node " + this.name + " : Collision ! Next attempt after " +  backoffDelay);
        }  
        
    }
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}
