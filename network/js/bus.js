function Bus(name, routerIds){

    this.name = name;
    var routerIds = routerIds;

    this.stopTransmitting = function(packet)
    {

        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Stop message that the bus is free to each node after the corresponding propagation delay
        var numNodes = nodes.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            distance = Math.abs(srcNode.position - nodes[i].position);
            propagationTime = distance / SETTINGS.PropagationSpeed;
            this.send( {packet:packet, status:'free', src: src}, propagationTime, nodes[i]);
        }

        var numRouters = routerIds.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            var routerId = routerIds[i];
            var router = routers[routerId];
            distance = 2000;
            propagationTime = distance / SETTINGS.PropagationSpeed;
            this.send( {packet:packet, status:'free', src: src}, propagationTime, router);
        }
    }

    this.transmit = function(packet){

        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Send packet to each node after the corresponding propagation delay
        var numNodes = nodes.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            
            distance = Math.abs(srcNode.position - nodes[i].position);
            propagationTime = distance / SETTINGS.PropagationSpeed;
            this.send( {packet:packet, status:'busy', src:src}, propagationTime, nodes[i]);
        
        }    
    }
} 


Bus.prototype.start = function(){    
}


Bus.prototype
