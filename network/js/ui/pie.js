var createPie = function(values, label, className, id){

var numPacketsTransmitted = values.length;

var maxX = Math.max.apply(Math,values);
var x = d3.scale.linear()
    .domain([0, maxX])
    .range([0, width]);

// Generate a histogram 
var data = d3.layout.histogram()
    .bins(x.ticks(maxX))
    (values);

//data = $.map(data, function(value, index){return {"label" : index + " collisions", "value" : parseFloat(((value.length/numPacketsTransmitted)*100).toFixed(2)), "color": "#7c7e38"}}); 
var adjustedHistogram = [];
adjustedHistogram.push({"label" : "0 collisions", "value" : parseFloat(((data[0].length*100)/numPacketsTransmitted).toFixed(2)), "color": "green"})
var cumulativeFreq = 0;
var redCollisionsThreshold = maxX > SETTINGS.RedCollisionsThreshold ? SETTINGS.RedCollisionsThreshold:maxX;
for(var i = 1; i < redCollisionsThreshold; i++){
	if(data[i].length === 0 )
		continue;
	cumulativeFreq += (data[i].length*100)/numPacketsTransmitted;
}
adjustedHistogram.push({"label" :  " 1 - " + redCollisionsThreshold + " collisions", "value" : parseFloat(cumulativeFreq.toFixed(2)), "color": "orange"});

cumulativeFreq = 0;
if(maxX > SETTINGS.RedCollisionsThreshold)
{
	for(var i = SETTINGS.RedCollisionsThreshold; i < maxX; i++)
	{
		if(data[i].length === 0 )
			continue;
		cumulativeFreq += (data[i].length*100)/numPacketsTransmitted;
	}
	adjustedHistogram.push({"label" :  SETTINGS.RedCollisionsThreshold + " - " + maxX + " collisions", "value" : parseFloat(cumulativeFreq.toFixed(2)), "color": "red"});
}

var statisticsCell = addStatisticsCell(className, id);
var pie = new d3pie(id, {
	"size": {
		"canvasHeight": height + margin.top + margin.bottom,
		"canvasWidth": width + margin.left + margin.right,
		"pieOuterRadius": "100%"
	},
	"data": {
		"content": adjustedHistogram
	},
	"labels": {
		"outer": {
			"pieDistance": 32,
			"fontSize": 13
		},
		"inner": {
			"format": "value"
		},
		"mainLabel": {
			"font": "verdana",
			"fontSize": 13
		},
		"percentage": {
			"color": "#e1e1e1",
			"font": "verdana",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#ffffff",
			"font": "verdana",
			"fontSize": 13,
		},
		"lines": {
			"enabled": true,
			"color": "#cccccc"
		},
		"truncation": {
			"enabled": true
		}
	}
});
   
$("#" + id).prepend('<label class="boldFont pieHeading">' + label + '</label>');
}