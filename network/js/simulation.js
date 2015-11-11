var bus = new Bus("bus1");
var sim;
var nodes = [];
var log = [];

function Simulate(){
    
    clearResults();
    clearLog();
    sim = new Sim();
    clearNodes();    
    createNodes();
    createBus();
    initSim();
    sim.simulate(SETTINGS.SimTime);
    console.log(sim.time());
    displayResults(); 
    //new RandomTester().run();
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

    var numNodes = 2;

    var nodeA = new Node(0, "A", 0);
    var nodeB = new Node(1, "B", SETTINGS.InterNodeDistance);

    nodes.push(nodeA);
    nodes.push(nodeB);
    //nodes.push(nodeC);
    //nodes.push(nodeD);

    for(var i = 0; i < numNodes; i++)
    {
        nodes[i] = sim.addEntity(nodes[i]);
    }
}


function initSim(){

    sim.setLogger(function (str) {
       log.push({"Time":sim.time(),"Message":str});
    });
}
