var SETTINGS = {};

//Time is measured in milli seconds
SETTINGS.FrameSlot = 0.050; //milli seconds
SETTINGS.PacketSize = 1000; // In bytes
SETTINGS.TransmissionRate = 100 // In Mbps
SETTINGS.MeanInterPacket = 2;
SETTINGS.SimTime = 1000;
SETTINGS.InfinitesimalDelay = 0.000001;
SETTINGS.PropagationSpeed = 2*Math.pow(10,5);
SETTINGS.ConvertToSec = Math.pow(10,-3);
SETTINGS.ConvertToMilliSec = Math.pow(10,3);
SETTINGS.InterNodeDistance = 2000;
SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec; // In Milliseconds
SETTINGS.NumberOfNodes = 2;
SETTINGS.MaxPerNodeResultsToDisplay = 5;
SETTINGS.RedCollisionsThreshold = 8; // Collisions per packet greater than this value are considered to be "red" - in the danger zone. 
									 // Collisions per packet between 1 and this value are considered to be "orange" - bad but better than red. 

SETTINGS.UpdatefromUI = function(){

	SETTINGS.FrameSlot = parseFloat(document.getElementById('frameSlot').value); //milli seconds
	SETTINGS.InterNodeDistance = parseFloat(document.getElementById('simDuration').value); // In bytes
	SETTINGS.TransmissionRate = parseFloat(document.getElementById('transmissionRate').value); // In Mbps
	SETTINGS.MeanInterPacket = parseFloat(document.getElementById('packetInterArrival').value); // In Frame Slots
	SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec; 
	SETTINGS.NumberOfNodes = parseFloat(document.getElementById('numNodes').value);

}