var sim;
var nodes = [];
var log = [];
var routers = [];
var buses = [];
var linkUpdater;
var linkUpdated = new Sim.Event("LinkUpated");


function Simulate(){
    
    // clear
    clearResults();
    clearLog();
    sim = new Sim();
    clearNodes();
    clearRouters();    
    clearBuses();

    // simulate
    if(ChangeTopology)
        UpdateTopologyfromUI();
    SETTINGS.UpdatefromUI();
    createBuses();
    createNodes();
    createRouters();
    createLinkUpdater();
    initSim();
    sim.simulate(SETTINGS.SimTime);
        
    // display results
    displayResults();     
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

function createLinkUpdater(){
    linkUpdater = new LinkCostUpdater();
    linkUpdater = sim.addEntity(linkUpdater);
}

function createBuses(){

    var bus1 = new Bus("bus1", [0,1], [0,1]);
    bus1 = sim.addEntity(bus1);
    buses.push(bus1);

    var bus2 = new Bus("bus2", [2,3], [2,3]);
    bus2 = sim.addEntity(bus2);
    buses.push(bus2);
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

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}