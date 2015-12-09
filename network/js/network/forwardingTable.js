function ForwardingTable(){
	this.entries = [];
	this.initialize = function(numEntries){

		for(var i = 0; i < numEntries; i++){
			var entry = new ForwardingEntry();
			entry.dest = i;
			this.entries.push(entry);
		}
	}
} 	


function ForwardingEntry(){
	this.dest = -1;
	this.predecessor = -1;
	this.totalCost = INFINITY;
	this.nextHop = -1;
} 	