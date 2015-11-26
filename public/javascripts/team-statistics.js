var teamLineChart = function(data){
  var attribute;
  for (var key in data[0]) {
    if(key != "Date"){
      attribute= key;
    }
  }
  console.log("Date before sorting : ", data);
  data.sort(function(a, b){ return new Date(a.Date).getTime() - new Date(b.Date).getTime() });
  data.forEach(function(d){
    console.log("Date after sorting : ", d.Date);
  })
  var margin = {top: 50, right: 50, bottom: 100, left: 45},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%m/%d/%Y").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.Date); })
      .y(function(d) { return y(d[attribute]); });

  var svg = d3.select("#flot-line-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.Date = parseDate(d.Date);      
      d[attribute] = +d[attribute];

    });

    x.domain(d3.extent(data, function(d) { return d.Date; }));
    y.domain(d3.extent(data, function(d) { return d[attribute];}));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(attribute);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

};