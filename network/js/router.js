function Router( id, name, position, ignoreDest){

	var routerId = id;
	var name = name;
	var packetQueue = [];
	var ignoreList = RouterIgnoreList[routerId];
	var currentlyReceiving;
	var forwardingTable;
	var busy = false;
	this.packetsDelivered = 0;


	this.onMessage = function(sender,message)
	{
		// Entire packet not transmitted
		if( message.packet.rxTime <= 0)
			return

		var dest = message.packet.dest;
		
		// If packet is from an end node
		if(message.status !== "fromRouter")
		{
			// Check if the destination is in the ignore list
			if( $.inArray(dest, ignoreList) !== -1 )
				return;

			// Check if the router is the default gateway of the source node 
			if( routerId !== NodeRouterMap[message.packet.src])
				return;
		}

		// Has the destination been reached ?
		var destRouter = NodeRouterMap[dest];
		if(destRouter === routerId )
		{
			console.log(name + " Packet received : From Node" + nodes[message.packet.src].name + ", To: Node " + (message.packet.dest + 1));
			this.packetsDelivered ++;
			message.packet.delivered = true;
			return;
		}

		if( message.status === "stopTrans" || message.status === "fromRouter" ){

			// If Forwarding table has entry for the destination, add the packet to queue
			var forwardingEntry = $.grep(forwardingTable.entries, function(entry){
				return destRouter === entry.dest;});

	     	if(forwardingEntry.length === 1)
	     	{
	     		console.log(name + " Packet received : From Node" + nodes[message.packet.src].name + ", To: Node " +  (message.packet.dest + 1));
	     		// Add packet and next hop to queue.
	     		packetQueue.push({ packet: message.packet, nextHop: forwardingEntry[0].nextHop});
		     	// If router is not busy, forward
		     	if(!busy){
		     		this.forward();
		     	}
	     	}
	    }
	    
	}

	this.forward = function(){

			if(packetQueue.length < 1 )
				return;
			// remove top of queue
			var queueEntry = packetQueue.pop();
			busy = true;

			this.setTimer(SETTINGS.RouterProcessingTime).done(function(){
				
				queueEntry.packet.rxTime += SETTINGS.RouterProcessingTime;				
				// send packet to next hop after processing delay
				this.send( {packet : queueEntry.packet, status:"fromRouter"}, SETTINGS.InfinitesimalDelay, routers[queueEntry.nextHop]);
				
				// reset busy status
				busy = false;

				// check queue again
				this.forward();
			})			
	}

	this.start = function(){
		forwardingTable = new DijikstrasAlgo().run(routerId, Topology);
	}

}

