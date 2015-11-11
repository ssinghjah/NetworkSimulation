var SETTINGS = {};

//Time is measured in milli seconds
SETTINGS.FrameSlot = 0.050; //milli seconds
SETTINGS.PacketSize = 1000; // In bytes
SETTINGS.TransmissionRate = 100 // In Mbps
SETTINGS.MeanInterPacket = 2;
SETTINGS.SimTime = 1000;
SETTINGS.InfinitesimalDelay = 0.001;
SETTINGS.PropagationSpeed = 2*Math.pow(10,5);
SETTINGS.ConvertToSec = Math.pow(10,-3);
SETTINGS.ConvertToMilliSec = Math.pow(10,3);
SETTINGS.InterNodeDistance = 2000;
SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec;


