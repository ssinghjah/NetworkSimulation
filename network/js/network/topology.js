var INFINITY = Number.MAX_VALUE;

// Backbone topology - Connectivity of routers with routers
var Topology = [];
Topology.push([0, INFINITY, 1, 1 ]);
Topology.push([INFINITY, 0, 1, 1 ]);
Topology.push([1, 1, 0, INFINITY ]);
Topology.push([1, 1, INFINITY, 0 ]);

// Backbone topology - Connectivity of routers with end terminals
var EdgeTopology = [];
EdgeTopology.push([]);
EdgeTopology.push([]);
EdgeTopology.push([]);
EdgeTopology.push([]);


var NewTopology = [];

function Connectivity( ipAdd, links ){
	this.IPAdd = ipAdd;
	this.links = links;
}

function Links( start, end, cost){
	this.start = start;
	this.end = end;
	this.cost = cost;
}