
function Bus(name, nodeIds, routerIds){

    this.name = name;
    var routerIds = routerIds;
    var nodeIds = nodeIds;


    this.stopTransmitting = function(packet)
    {

        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Send message that the transmission of the packet has stopped to each node after the corresponding propagation delay
        var numNodes = nodeIds.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            var nodeId = nodeIds[i];
            if(srcNode == nodeId)
            {
                propagationTime = 0;
            }
            else
            {
                distance = SETTINGS.InterNodeDistance;
                propagationTime = distance / SETTINGS.PropagationSpeed;
            }
            this.send( {packet:packet, status:'stopTrans', src: src}, propagationTime, nodes[nodeId]);
        }

        // Inform routers
        var numRouters = routerIds.length;
        var distance, propagationTime;
        for(i = 0; i < numRouters; i++)
        {
            var routerId = routerIds[i];
            var router = routers[routerId];
            if(packet.srcRouterId == routerId)
            {
                propagationTime = 0;
            }
            else
            {
                distance = SETTINGS.InterNodeDistance;
                propagationTime = distance / SETTINGS.PropagationSpeed;
            }
            this.send( {packet:packet, status:'stopTrans', src: src}, propagationTime, router);
        }
    }

    this.transmit = function(packet){

        var src = packet.src;
        var srcNode = nodes[packet.src];

        // Send packet to each node after the corresponding propagation delay
        var numNodes = nodeIds.length;
        var distance, propagationTime;
        for(var i = 0; i < numNodes; i++)
        {
            var nodeId = nodeIds[i];
            if( nodeId == src){
                propagationTime = 0;
            }
            else{
            distance = SETTINGS.InterNodeDistance;
            propagationTime = distance / SETTINGS.PropagationSpeed;
            }
            this.send( {packet:packet, status:'startTrans', src:src}, propagationTime, nodes[nodeId]);
        }

        // Inform routers
        var numRouters = routerIds.length;
        var distance, propagationTime;
        for(i = 0; i < numRouters; i++)
        {
            var routerId = routerIds[i];
            var router = routers[routerId];
            if(packet.srcRouterId == routerId)
            {
                propagationTime = 0;
            }
            else
            {
                distance = SETTINGS.InterNodeDistance;
                propagationTime = distance / SETTINGS.PropagationSpeed;
            }
            this.send( {packet:packet, status:'startTrans', src: src}, propagationTime, router);
        }    
    }
} 


Bus.prototype.start = function(){    
}
