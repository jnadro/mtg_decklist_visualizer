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

      var svg = d3.select(this).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(data.map(function(d, i) { return i; }));
      y.domain([0, d3.max(data, function(d) { return d; })]);

/*
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
*/
      var bar = svg.selectAll("g")
          .data(data)
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(" + x(i) + ",0)"; });

      bar.append("rect")
          .attr("class", "bar")
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d); })
          .attr("height", function(d) { return height - y(d); });

      var padding = 4;
      bar.append("text")
            .attr("x", function(d, i) { return x.rangeBand() / 2; })
            .attr("y", function(d, i) { return y(d) - padding; })
            .text(function(d) { if (d !== 0) return d; });      
    });
  }

  return chart;
}
