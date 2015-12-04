var sim;
var nodes = [];
var log = [];
var routers = [];
var buses = [];

function Simulate(){
    
    // clear
    clearResults();
    clearLog();
    sim = new Sim();
    clearNodes();
    clearRouters();    
    clearBuses();

    // simulate
    SETTINGS.UpdatefromUI();
    createBuses();
    createNodes();
    createRouters();
    initSim();
    sim.simulate(SETTINGS.SimTime);

    alert("R3 delivered " + routers[2].packetsDelivered);
    alert("R4 delivered " + routers[3].packetsDelivered);

    alert("R1 delivered " + routers[0].packetsDelivered);
    alert("R2 delivered " + routers[1].packetsDelivered);
    
    // display results
    displayResults();     
}

function createBuses(){

    var bus1 = new Bus("bus1", [0,1], [0,1]);
    bus1 = sim.addEntity(bus1);
    buses.push(bus1);

    var bus2 = new Bus("bus2", [2,3], [2,3]);
    bus2 = sim.addEntity(bus2);
    buses.push(bus2);
}


function clearResults(){
    $("#results").hide();
    var element = document.getElementById("results");
    while (element.hasChildNodes()) 
    {
        element.removeChild(element.lastChild);
    }
    
}

function clearLog(){
    log = [];
}

function clearNodes(){
    nodes = [];
}


function clearBuses(){
    buses = [];
}


function clearRouters(){
    routers = [];
}

function createNodes(){

    var numNodes = SETTINGS.NumberOfNodes;
    var nodeId = 0;
    var nodeName ="A";
    var nodePosition = 0;
    for(var i = 0; i < numNodes; i++)
    {
        var node = new Node(nodeId, nodeName, nodePosition); 
        node = sim.addEntity(node);
        nodes.push(node);       
        nodeName = nextChar(nodeName);
        nodePosition += SETTINGS.InterNodeDistance;
        nodeId++;
    }
}

function createRouters(){
    var numRouters = 4;
    var routerId = 0;
    for(var i=0; i < numRouters; i++){
        var router = new Router(routerId, "R" + (i+1)); 
        router = sim.addEntity(router);
        routers.push(router);       
        routerId++;
    }
}

function initSim(){

    sim.setLogger(function (str) {
       log.push({"Time":sim.time(),"Message":str});
       console.log(str);
    });
}
