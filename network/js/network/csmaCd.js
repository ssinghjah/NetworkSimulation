function CSMACD( name, bus, maxPropagationDelay, packetAttemptCallback, packetSentCallback, busFreeCallback, context){

	var transmitting = false;
    var context = context;
	var name = name;
	var bus = bus;
	var onPacketSentReq;
	var nextAttemptReq;
	var maxPropagationDelay = maxPropagationDelay;
	var nodesTransmittingOnTheBus = [];
	var packet;
	var packetAttemptCallback = packetAttemptCallback;
    var packetSentCallback = packetSentCallback;
	var busFreeCallback = busFreeCallback;
	
    // Needed for Sim.js
	this.start = function(){
	}

	// Attempt to transmit "packet"
	this.attemptToTransmit = function(iPacket){
    	packet = iPacket;
        if(!packet)
            packet = this.callbackData;

	    if(!isBusBusy())
	    {
	        var now = this.sim.time();
	        if(packet.nextAttemptTime <= now)
	        {
	            sim.log(name + " : Transmitting Packet");
	            transmitting = true;
	            // Let node update txTime
	            packetAttemptCallback.call(context, packet);          
	            bus.transmit(packet);
	            // If the Node does not detect collision till 2*Max Tp, it assumes that the packet is sent successfully.
	            onPacketSentReq = this.setTimer((2*maxPropagationDelay + SETTINGS.TransmissionTime)).done(onPacketSent);
	        }
	        else 
	        {
	            transmitting = false;
	            sim.log(name + " : Attempting. Attempt after " + (packet.nextAttemptTime - now));
                if(typeof nextAttemptReq !== 'undefined')
                    nextAttemptReq.cancel();
	            nextAttemptReq = this.setTimer(packet.nextAttemptTime - now).done(this.attemptToTransmit).setData(packet);
	        }
	    }
	    else{
	        sim.log(name + " : Attempting. Bus Busy ");
	    }
	}

	var onPacketSent = function(){
		// Call user's on packet sent successfully
		transmitting = false;
        bus.stopTransmitting(packet);
        sim.log(name + " : Packet sent successfully");
        packetSentCallback.call(context);;
        
	}


    var recordNodeTransmissionStart = function(id){
        if($.inArray(id, nodesTransmittingOnTheBus) === -1){
            nodesTransmittingOnTheBus.push(id);
        }
    }

    var recordNodeTransmissionStop = function (id) {
        nodesTransmittingOnTheBus = $.grep(nodesTransmittingOnTheBus, function(value) {
            return value != id;
        });
    }

    var isBusBusy = function(){
        return nodesTransmittingOnTheBus.length !== 0;
    }

    var backoffDelay = function(numCollisions){

        var maxBackoff = Math.pow(2,numCollisions) - 1;
        maxBackoff = maxBackoff > 8 ? 8 : maxBackoff;
        var backoffFrameSlot = Math.round(CustomRandom.get(0, maxBackoff));
        var backoffTimeDelay = backoffFrameSlot * SETTINGS.FrameSlot;
        return backoffTimeDelay;
    }

    var nextFrameSlotDelay = function(){

        var now = this.sim.time();
        var delay =  (SETTINGS.FrameSlot - now % SETTINGS.FrameSlot);
        return delay;
    }

    var adjustToNextFrameSlot = function(timeDelay){

        var now = this.sim.time();
        var nextFrameSlot = (now + timeDelay);
        var adjustNextFrameSlot =  nextFrameSlot + (SETTINGS.FrameSlot - nextFrameSlot % SETTINGS.FrameSlot);
        var adjustedDelay = adjustNextFrameSlot - now;
        return adjustedDelay;
    }

    this.onMessage = function(sender, message){
        if(message.status === "stopTrans"){
        
        // A node has stopped transmitting
        recordNodeTransmissionStop(message.src);

        var now = this.sim.time();

        // If the bus is free and we have not scheduled a message for transmission, then inform user that the bus is available for transmission.
       if(!isBusBusy() && (typeof packet === 'undefined' || packet.nextAttemptTime < now))  
        {  
        	// inform user that the bus is available 
        	busFreeCallback.call(context);
        }
    }
    else if ( message.status === "startTrans")
    {
        // The bus is busy and the node has received a packet
        recordNodeTransmissionStart(message.src);
        
        if(transmitting && message.src != packet.src)
        {
            // A packet is received while the node is transmitting.
            // So a collision has happened.
            // Back off 
            transmitting = false;
            onPacketSentReq.cancel();
            bus.stopTransmitting(packet);
            packet.numCollisions++;
            var delay = backoffDelay(packet.numCollisions); 
            packet.nextAttemptTime = this.sim.time() + delay;
            nextAttemptReq = this.setTimer(delay).done(this.attemptToTransmit).setData(packet);   
            sim.log("Node " + name + " : Collision ! Next attempt after " +  delay);
        }  
        
    }
}
}

