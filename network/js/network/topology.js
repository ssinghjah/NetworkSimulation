var INFINITY = Number.MAX_VALUE;

var DefaultTopology = [];
DefaultTopology.push([0, INFINITY, 1, 1 ]);
DefaultTopology.push([INFINITY, 0, 1, 1 ]);
DefaultTopology.push([1, 1, 0, INFINITY ]);
DefaultTopology.push([1, 1, INFINITY, 0 ]);

var Topology = DefaultTopology;

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

UpdateTopologyfromUI = function(){

	var newTopology = [];
	var numRouters = Topology.length;
	for(var i = 0; i < numRouters; i++)
	{
		newTopology[i] = [];
		for(var j = 0; j < numRouters; j++)
		{	
			if(j == i)
			{
				newTopology[i][j] = 0;
			}
			else
			{	
				var id = "R" + (i+1) + "R" + (j+1);
				var newCost = parseFloat(document.getElementById(id).value);
				if( isNaN(newCost))
				{
					newTopology[i][j] = INFINITY;
				}
				else
				{
					newTopology[i][j] = newCost;
				}
			}
		}		
	}
	Topology = newTopology;
}


