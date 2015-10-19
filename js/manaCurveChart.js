function manaCurveChart() {
  // defaults.
  var graphWidth = 300, graphHeight = 100;
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = graphWidth - margin.left - margin.right,
      height = graphHeight - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .05);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  function chart(selection) {
    selection.each(function(data) {

      // Create the svg element we will render into.
      var svg = d3.select(this).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("xmlns", "http://www.w3.org/2000/svg")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(data.map(function(d, i) { return i; }));
      y.domain([0, d3.max(data, function(d) { return d; })]);

      // Create a group for each bar in the dataset.
      // Must create a group that way we can later append 
      // the rect and text as a child.
      // svg text will not show up when appended to a rect.
      var bar = svg.selectAll("g")
          .data(data)
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(" + x(i) + ",0)"; });

      // Append the rect for each bar in the bar chart.
      bar.append("rect")
          .style("fill", "rgb(41, 128, 185)")
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d); })
          .attr("height", function(d) { return height - y(d); });

      // Append the count above each rectangle in the bar chart.
      var padding = 4;
      bar.append("text")
            .style("fill", "black")
            .style("font", "10px sans-serif")
            .style("text-anchor", "middle")
            .attr("x", function(d, i) { return x.rangeBand() / 2; })
            .attr("y", function(d, i) { return y(d) - padding; })
            .text(function(d) { if (d !== 0) return d; });

      // Append X-Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
    });
  }

  return chart;
}
