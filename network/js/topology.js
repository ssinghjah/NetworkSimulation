var Topology = [];
var INFINITY = Number.MAX_VALUE;
Topology.push([0, INFINITY, 1, 1 ]);
Topology.push([INFINITY, 0, 1, 1 ]);
Topology.push([1, 1, 0, INFINITY ]);
Topology.push([1, 1, INFINITY, 0 ]);