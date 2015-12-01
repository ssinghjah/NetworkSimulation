var bus = new Bus("bus1");
var sim;
var nodes = [];
var log = [];

function Simulate(){
    
  
    // clear
    clearResults();
    clearLog();
    sim = new Sim();
    clearNodes();    
    
    // simulate
    SETTINGS.UpdatefromUI();
    createNodes();
    createBus();
    initSim();
    sim.simulate(SETTINGS.SimTime);
    
    new DijikstrasAlgo().run(Topology,0);
    // display results
    displayResults(); 
    
}


function createBus(){
    bus = sim.addEntity(bus);
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


function createNodes(){

    var numNodes = SETTINGS.NumberOfNodes;
    var nodeId = 0;
    var nodeName ="A";
    var nodePosition = 0;
    for(var i=0; i < numNodes; i++){
        var node = new Node(nodeId, nodeName, nodePosition); 
        node = sim.addEntity(node);
        nodes.push(node);       
        nodeName = nextChar(nodeName);
        nodePosition += SETTINGS.InterNodeDistance;
        nodeId++;
    }
}




function initSim(){

    sim.setLogger(function (str) {
       log.push({"Time":sim.time(),"Message":str});
       console.log(str);
    });
}
