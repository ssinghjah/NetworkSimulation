function Bus(name){

    this.name = name;
    this.numNodesTransmitting = 0;

} 

Bus.prototype.stopTransmitting= function(packet){

        this.numNodesTransmitting--;
        if(this.numNodesTransmitting !== 0)
            return;

        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Stop message that the bus is free to each node after the corresponding propagation delay
        var numNodes = nodes.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            
            distance = Math.abs(srcNode.position - nodes[i].position);
            propagationTime = distance / SETTINGS.PropagationSpeed;
            this.send( {status:'free'}, propagationTime, nodes[i]);
        
        }

}

Bus.prototype.start = function(){
      this.numNodesTransmitting = 0;    
}


Bus.prototype.transmit = function(packet){

        this.numNodesTransmitting++;
        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Send packet to each node after the corresponding propagation delay
        var numNodes = nodes.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            if(i != src)
            {
                distance = Math.abs(srcNode.position - nodes[i].position);
                propagationTime = distance / SETTINGS.PropagationSpeed;
                this.send( {packet, status:'busy'}, propagationTime, nodes[i]);
            }
        }    
}
