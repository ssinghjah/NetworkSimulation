function Router( id, name, position, ignoreDest){

	var routerId = id;
	this.name = name;
	var busQueue = [];
	var ignoreList = RouterIgnoreList[routerId];
	var forwardingTable;
	this.packetsDelivered = 0;
	this.packetsProcessed = 0;
	this.inputQueueDelay = [];
	this.outputQueueDelay = [];
	this.busyTime = 0;
	var busPacket = null;
	var highInputQueue = [];
	var mediumInputQueue = [];
	var lowInputQueue = [];
	var highOutputQueue = [];
	var mediumOutputQueue = [];
	var lowOutputQueue = [];
	var busy = false;
	var maxQueueSize = 3;
	this.packetsDropped = 0;

	this.onMessage = function(sender,message)
	{

		forwardMessageToCSMACD.call(this, message);
		var isValid = validatePacket(message);
		if(!isValid)
			return

		putPacketinQueue(message.packet);
		//DropPacketsIfInputQueueFull.call(this);
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
			if( routerId !== NodeGatewayMap[message.packet.src])
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

	var updateInputQueueDelay = function(packet){

		var delay = PacketUtils.UpdateInputQueueDelay(packet, routerId, this.sim.time());	
		if(delay != -1)
		{
			this.inputQueueDelay.push(delay);
			
		}
	}


	var updateOutputQueueDelay = function(packet, txTime){

		var delay = PacketUtils.UpdateOutputQueueDelay(packet, routerId, txTime);	
		if(delay > 0)
		{
			this.outputQueueDelay.push(delay);
		}
	}

	var forwardToEndNode = function(packet){
		busy = true;
		this.setTimer(SETTINGS.RouterProcessingTime).done(
			function(){
				sim.log(this.name + ": Forwarding packet using CSMA CD : From Node " + nodes[packet.src].name + ", To: Node " + nodes[packet.dest].name);
				this.busyTime += SETTINGS.RouterProcessingTime;
				packet.routerOutputQueueDelays.push({id: routerId, delay:this.sim.time()});
				packet.routerProcessingDelays.push(SETTINGS.RouterProcessingTime);
				putPacketInOutputQueue(packet);
				//DropPacketsIfOutputQueueFull.call(this);
				busy = false;
				processPacket.call(this);
			});
	}

	var forwardToNextHopRouter = function( destRouters, packet){

	
		// Compare cost to destinations in the Forwarding table and forward to least cost.
		var forwardingEntries = $.grep(forwardingTable.entries, function(entry){ return $.inArray(entry.dest, destRouters) != -1;});

     	if(forwardingEntries.length > 1)
     	{
     		forwardingEntries.sort(function(a,b) {return a.totalCost - b.totalCost;});
     		var leastCostEntry = forwardingEntries[0];
     		// No path to the next hop
     		if(leastCostEntry.totalCost == INFINITY || leastCostEntry.nextHop == -1)
     			return;
     		packet.linkState = GetLinkCosts(this.sim.time());
     		busy = true;
     		this.setTimer(SETTINGS.RouterProcessingTime).done(
				function()
				{
					sim.log(this.name + ": Cost to " + routers[leastCostEntry.nextHop].name + " : " + leastCostEntry.totalCost);
					// If the other router has a path to next hop
					if(forwardingEntries[1].nextHop !== -1){
						sim.log(this.name + ": Cost to " + routers[forwardingEntries[1].nextHop].name + " : " + forwardingEntries[1].totalCost);
					}
					sim.log(this.name + ": Forwarding to next hop router " + routers[leastCostEntry.nextHop].name + " : From Node " + nodes[packet.src].name + ", To: Node " + nodes[packet.dest].name);
					this.busyTime += SETTINGS.RouterProcessingTime;
					packet.rxTime += SETTINGS.RouterProcessingTime;
					packet.routerProcessingDelays.push(SETTINGS.RouterProcessingTime);
					this.packetsProcessed++;
					// send to router on the backhaul without csma cd
					this.send( {packet : packet, status:"fromRouter"}, SETTINGS.InfinitesimalDelay, routers[leastCostEntry.nextHop]);
					busy = false;
					processPacket.call(this);
			});
     	}
	}

	var DropPacketsFromQueue = function(queueToFlush, queue1, queue2){
		var totalLength = queueToFlush.length + queue1.length + queue2.length;
		if( totalLength > maxQueueSize)
		{
			var excess = totalLength - maxQueueSize;
			if(queueToFlush.length > 0)
			{
				alert("Dropping packets");
				if(queueToFlush.length < excess )
				{
					this.packetsDropped += queueToFlush.length;
					queueToFlush = [];
					$.each(queueToFlush, function(packet){
						packet.dropped = true;
					})
				}
				else
				{
					var toRetain = queueToFlush.length - excess;
					this.packetsDropped += excess;
				
					for(var i = toRetain; i < excess; i++){
						queueToFlush[i].dropped = true;
					}
					queueToFlush = queueToFlush.slice(0 , toRetain);
				}
			}
		}
	}

	var DropPacketsIfInputQueueFull = function(queue){
		
		DropPacketsFromQueue.call(this, lowInputQueue, mediumInputQueue, highInputQueue);
		DropPacketsFromQueue.call(this, mediumInputQueue, lowInputQueue, highInputQueue);
		DropPacketsFromQueue.call(this, highInputQueue, lowInputQueue, mediumInputQueue);
		
	}


	var DropPacketsIfOutputQueueFull = function(){

		DropPacketsFromQueue.call(this,lowOutputQueue, highOutputQueue, mediumOutputQueue);
		DropPacketsFromQueue.call(this,mediumOutputQueue, lowOutputQueue, highOutputQueue);
		DropPacketsFromQueue.call(this, highOutputQueue, mediumOutputQueue, lowOutputQueue);
		
	}


	var getPacketFromQueue = function(){

		if(highInputQueue.length > 0)
			return highInputQueue.shift();
		else if(mediumInputQueue.length > 0)
			return mediumInputQueue.shift();
		else if(lowInputQueue.length > 0)
			return lowInputQueue.shift();
		else
			return null;
	}

	var putPacketinQueue = function(packet){
		
		switch(packet.priority)
		{
			case 1:
			{
				lowInputQueue.push(packet);
				break;
			}

			case 2:
			{
				mediumInputQueue.push(packet);
				break;
			}

			case 3:
			{
				highInputQueue.push(packet);
				break;
			}
		}		
	}


	var putPacketInOutputQueue = function(packet){
		
		switch(packet.priority)
		{
			case 1:
			{
				lowOutputQueue.push(packet);
				break;
			}

			case 2:
			{
				mediumOutputQueue.push(packet);
				break;
			}

			case 3:
			{
				highOutputQueue.push(packet);
				break;
			}
		}		
	}

	var getPacketFromOutputQueue = function(){

		if(highOutputQueue.length > 0)
			return highOutputQueue.shift();
		else if(mediumOutputQueue.length > 0)
			return mediumOutputQueue.shift();
		else if(lowOutputQueue.length > 0)
			return lowOutputQueue.shift();
		else
			return null;
	}


	var processPacket = function(){

		var packet = getPacketFromQueue();
		if(packet == null)
			return;

		var dest = packet.dest;
		updateInputQueueDelay.call(this, packet, routerId);
		packet.path.push(routerId);					 	
		// If the destination router has been reached, push the packet to the busQueue so that it can be processed by csma cd 
		var destRouters = NodeRouterMap[dest];
		if( $.inArray( routerId, destRouters) !== -1)
		{
		   forwardToEndNode.call(this,packet);
		}
		// Else forward to the next hop router
		else 
		{
			forwardToNextHopRouter.call(this, destRouters, packet);
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
		
		if(null == busPacket)
			return;

		busPacket.rxTime = this.sim.time(); 
	}

	var onPacketSent = function(){

		if(null == busPacket)
			return;

		// Remove and update the transmitted packet
		busPacket.delivered = true;
		this.packetsDelivered++;

		// Rx time contains txTime from router. Calculate Output Queue Delay before updating Rx time.
		updateOutputQueueDelay.call(this, busPacket, busPacket.rxTime);
		
		// Update Rx time
		busPacket.rxTime += SETTINGS.InterNodeDistance / SETTINGS.PropagationSpeed + SETTINGS.TransmissionTime;
		busPacket.transmissionDelays += SETTINGS.TransmissionTime;
		busPacket.propagationDelays += SETTINGS.InterNodeDistance / SETTINGS.PropagationSpeed;

		sim.log(this.name + " : Packet Delivered from " + busPacket.src + " to " + busPacket.dest)
	}

	var onBusFree = function(){

		busPacket = getPacketFromOutputQueue();
		if(null == busPacket)
			return;

		busPacket.srcRouterId = routerId;
		this.csmaCd.attemptToTransmit( busPacket);
	}
}

