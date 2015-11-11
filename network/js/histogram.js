createHistogram = function( values, label, className, numBins){


// A formatter for counts.
var formatCount = d3.format(",.0f");

var maxX = Math.max.apply(Math,values);

var x = d3.scale.linear()
    .domain([0, maxX])
    .range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(numBins))
    (values);

if(data.length === 0)
    return;

var maxY = d3.max(data, function(d) { return d.y; });

var y = d3.scale.linear()
    .domain([0, maxY])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var statisticsCell = addStatisticsCell(className);

var svg = statisticsCell.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });


bar.append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function(d) { return height - y(d.y); });

var text = bar.append("text")
    .attr("dy", ".75em")
    .attr("x", x(data[0].dx) / 2)
    .attr("y", function(d){ return height - y(d.y) <= 20 ? -12 : 6})
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("y", margin.bottom)
    .attr("x", width)
    .attr("dy", "-0.71em")
    .style("text-anchor", "end")
    .text("Time (msec)");;

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 2)
    .attr("x", 0)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Packets");

 svg.append("text")
    .attr("y", 16)
    .attr("x", 480)
    .attr("text-anchor", "middle")
    .text(label);
}