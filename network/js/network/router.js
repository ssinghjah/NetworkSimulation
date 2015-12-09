function Router( id, name, position, ignoreDest){

	var routerId = id;
	this.name = name;
	var busQueue = [];
	var ignoreList = RouterIgnoreList[routerId];
	var forwardingTable;
	this.packetsDelivered = 0;
	this.packetsProcessed = 0;
	this.inputQueueDelay = 0;
	this.busyTime = 0;
	var busPacket = null;
	var inputQueue = [];
	var busy = false;

	this.onMessage = function(sender,message)
	{

		forwardMessageToCSMACD.call(this, message);
		var isValid = validatePacket(message);
		if(!isValid)
			return
		
		inputQueue.push(message.packet);
		message.packet.routerInputQueueDelays.push({id: routerId, delay:this.sim.time()});
		if(!busy)
			processPacket.call(this, message);
	
	}


	var validatePacket = function(message)
	{
		if(message.status == "startTrans")
			return false;

		// If packet is from an end node
		if(message.status !== "fromRouter")
		{			
			// Return if the destination is in the ignore list
			if( $.inArray(message.packet.dest, ignoreList) !== -1 )
				return false;

			// Return if the router is not the default gateway of the source node 
			if( routerId !== NodeRouterMap[message.packet.src])
				return false;

		}

		// Entire packet not transmitted
		if( message.packet.rxTime <= 0)
			return false

	    return true;

	}

	var forwardMessageToCSMACD = function(message){
		
		// If packet is from an end node, forward the message to csma cd algo
		if(message.status !== "fromRouter")
		{
			this.send(message, 0, this.csmaCd);
		}
	}

	var processPacket = function(){

		if(inputQueue.length < 1 )
				return;
			
		var packet = inputQueue.shift();
		var dest = packet.dest;
		
		// update input queue delay
		var queueDelay = $.grep(packet.routerInputQueueDelays, function(value){ return value.id == routerId});
		if(queueDelay.length == 1)
		{
			queueDelay[0].delay = this.sim.time() - queueDelay[0].delay;
			this.inputQueueDelay += queueDelay[0].delay;
			this.packetsProcessed++;
		}
						 	

		// If the gateway router has been reached, push the packet to the busQueue so that it can be processed by csma cd 
		var destRouter = NodeRouterMap[dest];
		if( destRouter === routerId )
		{
			
		    busy = true;
			this.setTimer(SETTINGS.RouterProcessingTime).done(
				function(){
					sim.log(this.name + ": Forwarding packet using CSMA CD : From Node " + nodes[packet.src].name + ", To: Node " + nodes[packet.dest].name);
					this.busyTime += SETTINGS.RouterProcessingTime;
					busQueue.push(packet);
					busy = false;
					processPacket.call(this);
				});
		}
		// Else forward to the next hop router
		else 
		{
			// If Forwarding table has entry for the destination, then forward the packet
			var forwardingEntry = $.grep(forwardingTable.entries, function(entry){ return destRouter === entry.dest;});
	     	if(forwardingEntry.length === 1)
	     	{
	     		busy = true;
	     		this.setTimer(SETTINGS.RouterProcessingTime).done(
					function()
					{
						sim.log(this.name + ": Forwarding to next hop router " + routers[forwardingEntry[0].nextHop].name + " : From Node " + nodes[packet.src].name + ", To: Node " + nodes[packet.dest].name);
						this.busyTime += SETTINGS.RouterProcessingTime;
						packet.rxTime += SETTINGS.RouterProcessingTime;
						// send to router on the backhaul without csma cd
						this.send( {packet : packet, status:"fromRouter"}, SETTINGS.InfinitesimalDelay, routers[forwardingEntry[0].nextHop]);
						busy = false;
						processPacket.call(this);
				});
	     	}
	    }	
	}


	this.start = function(){

		forwardingTable = new DijikstrasAlgo().run(routerId, Topology);
	    this.csmaCd = new CSMACD( this.name, buses[RouterBusMap[routerId]], SETTINGS.InterNodeDistance / SETTINGS.PropagationSpeed, 
	    						  onPacketAttempt, onPacketSent, onBusFree, this);
	    this.csmaCd = sim.addEntity(this.csmaCd);

	    // Subscribe to "LinkUpdated" event and update forwarding table using dijikstra's algorithm.
	    this.onLinkUpdated();
	    
	}


	this.onLinkUpdated = function(){
		
	    this.waitEvent(linkUpdated).done( function()
	    {
	    	updateForwardingTable.call(this);
	    	this.setTimer(0).done(this.onLinkUpdated);
	    });
	}

	var updateForwardingTable = function(){
		sim.log(this.name + " : Link Updated");
	    forwardingTable = new DijikstrasAlgo().run(routerId, Topology);
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

		sim.log(this.name + " : Packet Delivered from " + busQueue[0].src + " to " + busQueue[0].dest)
		busQueue.shift();
	}

	var onBusFree = function(){

			if(busQueue.length < 1)
				return;
			busQueue[0].srcRouterId = routerId;
			this.csmaCd.attemptToTransmit.call(this.csmaCd, busQueue[0]);
	}
}

