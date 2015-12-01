 function DijikstrasAlgo() {	
 	

 	var updateNeighbourCost = function ( currentRouter, routingTable, topology){
 		
		var srcToCurrCost = routingTable.entries[currentRouter].totalCost;

		// Compare cost from current router to its neighbours with existing costs of the current router's neoghbours.
		var neighbours = topology[currentRouter];
		var numNeighBours = neighbours.length; // Should be equal to the number of routers
		for(var i = 0; i < numNeighBours; i++){

			var currNode = routingTable.entries[i];

			// Existing Cost
			var currCost = currNode.totalCost;
			// New Cost
			var newCost = routingTable.entries[currentRouter].totalCost + neighbours[i];

			// Update Forwarding Table if the new cost is less than the existing cost
			if(newCost < currCost){
				currNode.totalCost = newCost;
				currNode.predecessor = currentRouter;

			}
		}	
 	}

 	var getRouterWithMinCost = function(routingTable, routersUsed){

 		var minCost = INFINITY;
 		var nextRouter = -1;
 		var numEntries = routingTable.entries.length;
 		for(var i=0; i < numEntries; i++){
 			var entry = routingTable.entries[i];
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

		var numRouters = topology.length;
		var routingTable = new ForwardingTable();	
		routingTable.initialize(topology.length);
		routingTable.entries[source].totalCost = 0;

		var routersUsed = [];
		routersUsed.push(source);
		updateNeighbourCost(source, routingTable, topology);
		while(routersUsed.length < numRouters){
			var nextRouter = getRouterWithMinCost(routingTable, routersUsed);
			updateNeighbourCost(nextRouter, routingTable, topology);
			routersUsed.push(nextRouter);
		}
		addNextHop(source,routingTable);
	}

	var addNextHop = function( source, routingTable){

		var numEntries = routingTable.length;
		for(var i = 0; i < numEntries; i++)
		{
			if(routingTable[i].entries.dest !== source)
			{
				// Move backwards from predecessor until we reach the source node.
				var predecessor = i;
				while(routingTable[predecessor].predecessor !== source){
					predecessor = routingTable[i].predecessor;
				}
				// Store the next hop.
				routingTable[i].nextHop = predecessor;
			}
		}
	}
}

