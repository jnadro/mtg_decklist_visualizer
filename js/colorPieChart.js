function colorPieChart() {
  var width = 360,
      height = 187,
      radius = Math.min(width, height) / 2;

  var magicColors = ["#bab1ab", "#c1d7e9", "#a3c095", "#e49977", "#f8f6d8"];

  var color = d3.scale.ordinal()
      .range(magicColors);

  function chart(selection) {
    selection.each(function(data) {

      var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d; });

      var svg = d3.select(this).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var data = [25, 10, 5, 2, 1];

      var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); });

      g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data; });
    });
  }

  return chart;
}