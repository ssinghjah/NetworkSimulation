function Router( id, name, position, ignoreDest){

	var routerId = id;
	var name = name;
	var backhaulQueue = [];
	var busQueue = [];
	var ignoreList = RouterIgnoreList[routerId];
	var currentlyReceiving;
	var forwardingTable;
	var busySendingToBackHaul = false;
	this.packetsDelivered = 0;
	var busPacket = null;

	this.onMessage = function(sender,message)
	{

		// If packet is from an end node
		if(message.status !== "fromRouter")
		{

			// Forward the message to csma cd algo
			this.send(message, 0, this.csmaCd);
			
			// Return if the destination is in the ignore list
			if( $.inArray(message.packet.dest, ignoreList) !== -1 )
				return;

			// Return if the router is not the default gateway of the source node 
			if( routerId !== NodeRouterMap[message.packet.src])
				return;
		}


		// Entire packet not transmitted
		if( message.packet.rxTime <= 0)
			return

		var dest = message.packet.dest;
		
		
		// Has the destination been reached ?
		var destRouter = NodeRouterMap[dest];
		if(destRouter === routerId )
		{
			sim.log(name + " Packet received : From Node" + nodes[message.packet.src].name + ", To: Node " + (message.packet.dest + 1));
			busQueue.push(message.packet);
		}

		else if( message.status === "stopTrans" || message.status === "fromRouter" ){

			// If Forwarding table has entry for the destination, add the packet to queue
			var forwardingEntry = $.grep(forwardingTable.entries, function(entry){
				return destRouter === entry.dest;});

	     	if(forwardingEntry.length === 1)
	     	{
	     		sim.log(name + " Packet received : From Node" + nodes[message.packet.src].name + ", To: Node " +  (message.packet.dest + 1));
	     		// Add packet and next hop to queue.
	     		backhaulQueue.push({ packet: message.packet, nextHop: forwardingEntry[0].nextHop});
		     	// If router is not busy, forward
		     	if(!busySendingToBackHaul){
		     		this.forwardOnBackhaul();
		     	}
	     	}
	    }
	}

	this.forwardOnBackhaul = function(){

			if(backhaulQueue.length < 1 )
				return;
			// remove top of queue
			var queueEntry = backhaulQueue.shift();
			busySendingToBackHaul = true;

			this.setTimer(SETTINGS.RouterProcessingTime).done(function(){
				
				sim.log(name + ": Forwarding packet from " + queueEntry.packet.src + " to "  + queueEntry.packet.dest);

				queueEntry.packet.rxTime += SETTINGS.RouterProcessingTime;

				// send to router on the backhaul without csma cd
				this.send( {packet : queueEntry.packet, status:"fromRouter"}, SETTINGS.InfinitesimalDelay, routers[queueEntry.nextHop]);
				
				// reset busy status
				busySendingToBackHaul = false;

				// check queue again
				this.forwardOnBackhaul();
			})			
	}

	this.start = function(){

		forwardingTable = new DijikstrasAlgo().run(routerId, Topology);
	    this.csmaCd = new CSMACD( name, buses[RouterBusMap[routerId]], SETTINGS.InterNodeDistance / SETTINGS.PropagationSpeed, 
	    						  onPacketAttempt, onPacketSent, onBusFree, this);
	    this.csmaCd = sim.addEntity(this.csmaCd);

	}

	var onPacketAttempt = function(){
		
		if(busQueue.length < 1 )
			return;
		
		busQueue[0].rxTime = this.sim.time(); 
	}

	var onPacketSent = function(){

		if(busQueue.length < 1 )
			return;

		// Remove and update the transmitted packet
		busQueue[0].delivered = true;
		this.packetsDelivered++;
		busQueue[0].rxTime += SETTINGS.InterNodeDistance / SETTINGS.PropagationSpeed + SETTINGS.TransmissionTime;
		// Update the rx time of the packet here

		sim.log(name + " : Packet Delivered from " + busQueue[0].src + " to " + busQueue[0].dest)
		busQueue.shift();
	}

	var onBusFree = function(){

			if(busQueue.length < 1)
				return;
			busQueue[0].srcRouterId = routerId;
			this.csmaCd.attemptToTransmit.call(this.csmaCd, busQueue[0]);
	}

}

