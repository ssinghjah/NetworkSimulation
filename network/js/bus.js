function Bus(name){

    this.name = name;
  

} 

Bus.prototype.stopTransmitting= function(packet){


        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Stop message that the bus is free to each node after the corresponding propagation delay
        var numNodes = nodes.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            
            distance = Math.abs(srcNode.position - nodes[i].position);
            propagationTime = distance / SETTINGS.PropagationSpeed;
            this.send( {status:'free', src: src}, propagationTime, nodes[i]);
        
        }

}

Bus.prototype.start = function(){
      this.numNodesTransmitting = 0;    
}


Bus.prototype.transmit = function(packet){

        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Send packet to each node after the corresponding propagation delay
        var numNodes = nodes.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            
            distance = Math.abs(srcNode.position - nodes[i].position);
            propagationTime = distance / SETTINGS.PropagationSpeed;
            this.send( {packet, status:'busy', src:src}, propagationTime, nodes[i]);
        
        }    
}
