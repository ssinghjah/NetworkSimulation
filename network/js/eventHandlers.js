var onSaveParameters = function(){
	
	SETTINGS.FrameSlot = parseFloat(document.getElementById('frameSlot').value); //milli seconds
	SETTINGS.InterNodeDistance = parseFloat(document.getElementById('simDuration').value); // In bytes
	SETTINGS.TransmissionRate = parseFloat(document.getElementById('transmissionRate').value); // In Mbps
	SETTINGS.MeanInterPacket = parseFloat(document.getElementById('packetInterArrival').value); // In Frame Slots
	SETTINGS.TransmissionTime = ((SETTINGS.PacketSize*8)/(SETTINGS.TransmissionRate*Math.pow(10,6)))*SETTINGS.ConvertToMilliSec; 

}

var onEdit = function(){
		hideResultsAndEditor();
		$('.links').removeClass('active');
		$('#editLink').addClass('active');
		$('#editor').show();
}

var hideResultsAndEditor = function(){
	$('div.results').hide();
	$('#editor').hide();
}

var onSummary = function(){
		hideResultsAndEditor();
		$('.summary').show();
		$('.links').removeClass('active');
		$('#summaryLink').addClass('active');
	
}


var onInterPacket = function(){
		hideResultsAndEditor();
		$('.interPacket').show();
		$('.links').removeClass('active');
		$('#interPacketLink').addClass('active');
}


var onQueueDelay = function(){
		hideResultsAndEditor();
		$('.queueDelay').show();
		$('.links').removeClass('active');
		$('#queueDelayLink').addClass('active');
}


var onE2EDelay = function(){
		hideResultsAndEditor();
		$('.e2eDelay').show();
		$('.links').removeClass('active');
		$('#e2eDelayLink').addClass('active');
}


var onEventLog = function(){	
		hideResultsAndEditor();
		$('.eventLog').show();
		$('.links').removeClass('active');
		$('#eventLogLink').addClass('active');
}