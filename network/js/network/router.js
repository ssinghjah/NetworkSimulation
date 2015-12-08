function Router( id, name, position, ignoreDest){

	var routerId = id;
	this.name = name;
	var backhaulQueue = [];
	var busQueue = [];
	var ignoreList = RouterIgnoreList[routerId];
	var currentlyReceiving;
	var forwardingTable;
	var busySendingToBackHaul = false;
	this.packetsDelivered = 0;
	var busPacket = null;
	this.busyTime = 0;
	var inputQueue = [];

	this.onMessage = function(sender,message)
	{

		forwardMessageToCSMACD.call(this, message);

		var isValid = validatePacket(message);
		if(!isValid)
			return
		
		inputQueue.push(message.packet);
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

	var processPacket = function(message){

		
		var dest = message.packet.dest;
		// Has the destination been reached ?
		var destRouter = NodeRouterMap[dest];
		if( destRouter === routerId )
		{
			sim.log(this.name + " Packet received : From Node" + nodes[message.packet.src].name + ", To: Node " + (message.packet.dest + 1));
			
			this.setTimer(SETTINGS.RouterProcessingTime).done(
				
				function(){
					this.busyTime += SETTINGS.RouterProcessingTime;
					busQueue.push(message.packet);
				});
			
		}

		else 
		{

			// If Forwarding table has entry for the destination, add the packet to queue
			var forwardingEntry = $.grep(forwardingTable.entries, function(entry){
				return destRouter === entry.dest;});

	     	if(forwardingEntry.length === 1)
	     	{
	     		sim.log(this.name + " Packet received : From Node" + nodes[message.packet.src].name + ", To: Node " +  (message.packet.dest + 1));
	     		// Add packet and next hop to queue.
	     		backhaulQueue.push({ packet: message.packet, nextHop: forwardingEntry[0].nextHop});
		     	// If router is not busy, forward
		     	if(!busySendingToBackHaul){
		     		forwardOnBackhaul.call(this);
		     	}
	     	}
	    }	
	}


	var forwardOnBackhaul = function(){

			if(backhaulQueue.length < 1 )
				return;
			// remove top of queue
			var queueEntry = backhaulQueue.shift();
			busySendingToBackHaul = true;

			this.setTimer(SETTINGS.RouterProcessingTime).done(function(){
				
				this.busyTime += SETTINGS.RouterProcessingTime;

				sim.log(this.name + ": Forwarding packet from " + queueEntry.packet.src + " to "  + queueEntry.packet.dest);

				queueEntry.packet.rxTime += SETTINGS.RouterProcessingTime;

				// send to router on the backhaul without csma cd
				this.send( {packet : queueEntry.packet, status:"fromRouter"}, SETTINGS.InfinitesimalDelay, routers[queueEntry.nextHop]);
				
				// reset busy status
				busySendingToBackHaul = false;

				// check queue again
				forwardOnBackhaul.call(this);
			})			
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
	    	updateForwardingTable();
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

