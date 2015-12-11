function Packet( src, dest, birthTime, interArrivalTime){

    this.birthTime = birthTime;
    this.src = src;
    this.dest = dest;
    this.numCollisions = 0;
    this.txTime = 0;
    this.rxTime = 0;
    this.path = [];
    this.linkState = [];
    this.nextAttemptTime = birthTime;
    this.interArrivalTime = interArrivalTime;
    this.routerInputQueueDelays = [];
    this.routerOutputQueueDelays = [];
    this.srcRouterId = -1;
} 

function PacketUtils(){
}

PacketUtils.UpdateInputQueueDelay = function( packet, routerId, now){

		var delay = -1;
		// update input queue delay faced at the given router
		var queueDelay = $.grep(packet.routerInputQueueDelays, function(value){ return value.id == routerId});
		if(queueDelay.length == 1)
		{
			queueDelay[0].delay = now - queueDelay[0].delay;
			delay = queueDelay[0].delay;
		}
		return delay;
}

PacketUtils.UpdateOutputQueueDelay = function( packet, routerId, now){

		var delay = -1;
		// update output queue delay faced at the given router
		var queueDelay = $.grep(packet.routerOutputQueueDelays, function(value){ return value.id == routerId});
		if(queueDelay.length == 1)
		{
			queueDelay[0].delay = now - queueDelay[0].delay;
			delay = queueDelay[0].delay;
			if(delay < 0)
				alert("Error");
		}
		return delay;
}