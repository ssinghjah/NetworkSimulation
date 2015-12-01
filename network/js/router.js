function Router( id, name, position){

	var queue = [];
	var currentlyReceiving;
	var forwardingTable;
	var busy = false;

	this.onMessage = function(sender,message){
	if(message.status === "free"){

     	// If Forwarding table has entry, add to queue
     	// If router is not busy, forward
       
    }
    else if ( message.status === "busy")
    {
     	    
    }
	}

	var forward = function(){

		// remove top of queue
		// look up next hop in forwarding table
		// wait for Processing delay
		// send to output
	}
}
