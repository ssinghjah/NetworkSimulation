var SETTINGS = {};

//Time is measured in milli seconds

//Configurable by user

SETTINGS.PacketSize = 1000; // In bytes
SETTINGS.TransmissionRate = 100 // In Mbps
SETTINGS.MeanInterPacket = 2; // Number of packets
SETTINGS.SimTime = 500; // In milli seconds
SETTINGS.InterNodeDistance = 2000; // In meters
SETTINGS.RouterProcessingTime = 0.1; // In Milliseconds
SETTINGS.LinkCostUpdateInterval = 2; // In Milliseconds
SETTINGS.NumPathTrace = 20;
SETTINGS.NodePriority = [1,1,1,1];

// Not Configurable by user
SETTINGS.InfinitesimalDelay = 0.001;
SETTINGS.PropagationSpeed = 2*Math.pow(10,5); // In meters/millisec
SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec; // In Milliseconds
SETTINGS.ConvertToSec = Math.pow(10,-3);
SETTINGS.ConvertToMilliSec = Math.pow(10,3);
SETTINGS.MaxPerNodeResultsToDisplay = 5;
SETTINGS.RedCollisionsThreshold = 8; // Collisions per packet greater than this value are considered to be "red" - in the danger zone. 
SETTINGS.NumberOfNodes = 4;
SETTINGS.FrameSlot = 0.50; //milli seconds

SETTINGS.UpdateUI = function(){

	document.getElementById('interNode').value = SETTINGS.InterNodeDistance// In bytes
	document.getElementById('transmissionRate').value = SETTINGS.TransmissionRate; // In Mbps
	document.getElementById('packetInterArrival').value = SETTINGS.MeanInterPacket // In Frame Slots
	document.getElementById('simDuration').value = SETTINGS.SimTime / 1000; // In Seconds
	document.getElementById('routerProcTime').value = SETTINGS.RouterProcessingTime; // In milliseconds 
	document.getElementById('linkCostUpdateInterval').value = SETTINGS.LinkCostUpdateInterval; // In milliseconds 
	document.getElementById('numPathTrace').value = SETTINGS.NumPathTrace; 
	document.getElementById('frameSlot').value = SETTINGS.FrameSlot; 

}


SETTINGS.UpdatefromUI = function(){

	SETTINGS.InterNodeDistance = parseFloat(document.getElementById('interNode').value); // In bytes
	SETTINGS.TransmissionRate = parseFloat(document.getElementById('transmissionRate').value); // In Mbps
	SETTINGS.MeanInterPacket = parseFloat(document.getElementById('packetInterArrival').value); // In Frame Slots
	SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec; 
	SETTINGS.SimTime = parseFloat(document.getElementById('simDuration').value) * 1000; // In Milli Seconds
	SETTINGS.RouterProcessingTime = parseFloat(document.getElementById('routerProcTime').value); // In milliseconds 
	SETTINGS.LinkCostUpdateInterval = parseFloat(document.getElementById('linkCostUpdateInterval').value); // In milliseconds 
	SETTINGS.NumPathTrace = parseFloat(document.getElementById('numPathTrace').value);
	SETTINGS.FrameSlot = parseFloat(document.getElementById('frameSlot').value);
	SETTINGS.NodePriority[0] = $("#nodeAPriority .active input").data("priority");
	SETTINGS.NodePriority[1] = $("#nodeBPriority .active input").data("priority");
	SETTINGS.NodePriority[2] = $("#nodeCPriority .active input").data("priority");
	SETTINGS.NodePriority[3] = $("#nodeDPriority .active input").data("priority");
}

$(document).ready(function(){
		SETTINGS.UpdateUI();
});
