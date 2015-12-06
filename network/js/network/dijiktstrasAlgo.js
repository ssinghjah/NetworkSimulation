 function DijikstrasAlgo() {	
 	

 	var updateNeighbourCost = function ( currentRouter, forwardingTable, topology){
 		
		var srcToCurrCost = forwardingTable.entries[currentRouter].totalCost;

		// Compare cost from current router to its neighbours with existing costs of the current router's neoghbours.
		var neighbours = topology[currentRouter];
		var numNeighBours = neighbours.length; // Should be equal to the number of routers
		for(var i = 0; i < numNeighBours; i++){

			var currNode = forwardingTable.entries[i];

			// Existing Cost
			var currCost = currNode.totalCost;
			// New Cost
			var newCost = forwardingTable.entries[currentRouter].totalCost + neighbours[i];

			// Update Forwarding Table if the new cost is less than the existing cost
			if(newCost < currCost){
				currNode.totalCost = newCost;
				currNode.predecessor = currentRouter;

			}
		}	
 	}

 	var getRouterWithMinCost = function(forwardingTable, routersUsed){

 		var minCost = INFINITY;
 		var nextRouter = -1;
 		var numEntries = forwardingTable.entries.length;
 		for(var i=0; i < numEntries; i++){
 			var entry = forwardingTable.entries[i];
 			if($.inArray(entry.dest, routersUsed) === -1 && entry.totalCost < minCost )
 			{
 				minCost = entry.totalCost;
 				nextRouter = entry.dest;
 				break;
 			}		
 		}
 		return nextRouter;
 	}

	this.run = function( source, topology){

		// create empty forwarding table
		var numRouters = topology.length;
		var forwardingTable = new ForwardingTable();	
		forwardingTable.initialize(topology.length);


		// find least cost and predecessor to all nodes
		var routersUsed = [];
		routersUsed.push(source);
		forwardingTable.entries[source].totalCost = 0;
		updateNeighbourCost(source, forwardingTable, topology);
		while(routersUsed.length < numRouters){
			var nextRouter = getRouterWithMinCost(forwardingTable, routersUsed);
			updateNeighbourCost(nextRouter, forwardingTable, topology);
			routersUsed.push(nextRouter);
		}

		// add next hop using predecessors
		addNextHop(source,forwardingTable);

		return forwardingTable;
	}

	var addNextHop = function( source, forwardingTable){

		var numEntries = forwardingTable.entries.length;
		for(var i = 0; i < numEntries; i++)
		{
			if(forwardingTable.entries[i].dest !== source)
			{
				// Move backwards from predecessor until we reach the source node.
				var predecessor = i;
				while(forwardingTable.entries[predecessor].predecessor !== source){
					predecessor = forwardingTable.entries[predecessor].predecessor;
				}
				// Store the next hop.
				forwardingTable.entries[i].nextHop = predecessor;
			}
		}
	}
}

