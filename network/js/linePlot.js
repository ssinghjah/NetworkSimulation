var createLinePlot = function(data, label, className){
  
    
    var maxY = d3.max(data, function(d) { return d; });

    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
    // Y scale will fit values from 0-maxY within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    var y = d3.scale.linear().domain([0, maxY]).range([height, 0]);
      // automatically determining max range can work something like this
      // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

    // create a line function that can convert data[] into x and y points
    var line = d3.svg.line()
      // assign the X function to plot our line as we wish
      .x(function(d,i) { 
        // return the X coordinate where we want to plot this datapoint
        return x(i); 
      })
      .y(function(d) { 
        // return the Y coordinate where we want to plot this datapoint
        return y(d); 
      })


      
      var statisticsCell = addStatisticsCell(className);

      var svg = statisticsCell.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // create yAxis
      var xAxis = d3.svg.axis().scale(x).tickSize(5).tickSubdivide(true);
      
      // Add the x-axis.
      svg.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", margin.bottom)
            .attr("x", width)
            .attr("dy", "-0.71em")
            .style("text-anchor", "end")
            .text("Packet Sequence Number");
;


      // create left yAxis
      var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
      // Add the y-axis to the left
      svg.append("svg:g")
            .attr("class", "y axis")
            .call(yAxisLeft)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 2)
            .attr("x", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Time (msec)");
  
      
      // Add the line by appending an svg:path element with the data line we created above
      // do this AFTER the axes above so that the line is above the tick-lines
        svg.append("svg:path").attr("d", line(data));

          
       svg.append("text")
          .attr("y", -20)
          .attr("x", 480)
          .attr("text-anchor", "middle")
          .attr("class","bolderFont")
          .text(label);



}