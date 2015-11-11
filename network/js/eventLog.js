createEventLog = function(){
    
    var statisticsCell = addStatisticsCell("eventLog results");

    var panel = statisticsCell.append("div").attr("class","panel panel-default");
    var heading = panel.append("div").attr({"class":"panel-heading"});
    heading.text("Event Log");

    var columns = ["Message"];

    var table = panel.append("table").attr("class","table table-striped table-bordered");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

   
    // create a row for each object in the summary
    var rows = tbody.selectAll("tr")
        .data(log)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td").html(function(d) { return d.value; });

}
