var SETTINGS = {};

//Time is measured in milli seconds

//Configurable by user
SETTINGS.FrameSlot = 0.50; //milli seconds
SETTINGS.PacketSize = 1000; // In bytes
SETTINGS.TransmissionRate = 100 // In Mbps
SETTINGS.MeanInterPacket = 2; // Number of packets
SETTINGS.SimTime = 500; // In milli seconds
SETTINGS.InterNodeDistance = 2000; // In meters
SETTINGS.RouterProcessingTime = 5; // In Milliseconds

// Not Configurable by user
SETTINGS.InfinitesimalDelay = 0.000001;
SETTINGS.PropagationSpeed = 2*Math.pow(10,5);
SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec; // In Milliseconds
SETTINGS.ConvertToSec = Math.pow(10,-3);
SETTINGS.ConvertToMilliSec = Math.pow(10,3);
SETTINGS.MaxPerNodeResultsToDisplay = 5;
SETTINGS.RedCollisionsThreshold = 8; // Collisions per packet greater than this value are considered to be "red" - in the danger zone. 
SETTINGS.NumberOfNodes = 4;  									 

SETTINGS.UpdateUI = function(){

	document.getElementById('frameSlot').value = SETTINGS.FrameSlot; //milli seconds
	document.getElementById('interNode').value = SETTINGS.InterNodeDistance// In bytes
	document.getElementById('transmissionRate').value = SETTINGS.TransmissionRate; // In Mbps
	document.getElementById('packetInterArrival').value = SETTINGS.MeanInterPacket // In Frame Slots
	document.getElementById('simDuration').value = SETTINGS.SimTime / 1000; // In Seconds
	document.getElementById('routerProcTime').value = SETTINGS.RouterProcessingTime // In milliseconds 

}


SETTINGS.UpdatefromUI = function(){

	SETTINGS.FrameSlot = parseFloat(document.getElementById('frameSlot').value); //milli seconds
	SETTINGS.InterNodeDistance = parseFloat(document.getElementById('interNode').value); // In bytes
	SETTINGS.TransmissionRate = parseFloat(document.getElementById('transmissionRate').value); // In Mbps
	SETTINGS.MeanInterPacket = parseFloat(document.getElementById('packetInterArrival').value); // In Frame Slots
	SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec; 
	SETTINGS.SimTime = parseFloat(document.getElementById('simDuration').value) * 1000; // In Milli Seconds
	SETTINGS.RouterProcessingTime = parseFloat(document.getElementById('routerProcTime').value) // In milliseconds 

}

$(document).ready(function(){
		SETTINGS.UpdateUI();
	});
