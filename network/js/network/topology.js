var INFINITY = Number.MAX_VALUE;

var Topology = [];
Topology.push([0, INFINITY, 1, 1 ]);
Topology.push([INFINITY, 0, 1, 1 ]);
Topology.push([1, 1, 0, INFINITY ]);
Topology.push([1, 1, INFINITY, 0 ]);

var GetLinkCosts = function  (time) {
	
	var costs = {};
	costs.time = time;
	costs.values = [];
	var numRouters = Topology.length;
	for( var i = 0; i < numRouters; i++)
	{
		var sourceName = routers[i].name;
		var sourceCosts = "";
		var numLinks = Topology[i].length;
		for(var j = 0; j < numLinks; j++)
		{
			if(Topology[i][j] != 0 && Topology[i][j] != INFINITY){

				var destName = routers[j].name;
				sourceCosts += sourceName + " - " + destName + " : " + Topology[i][j] + ", ";
			}
		}
		sourceCosts = sourceCosts.substring(0, sourceCosts.length - 2);
		costs.values.push(sourceCosts);
	}
	return costs;
}