
var margin = {
  top: 20,
  right: 100,
  bottom: 100,
  left: 100
};

var svg_Width = 1200;
var svg_Height = 400;
var svg_Area = d3.select("scatter");
if (!svg_Area.empty()) {
    svg_Area.remove();
}
var chart_Height = svg_Height - margin.top - margin.bottom;
var chart_Width  = svg_Width - margin.left - margin.right;
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svg_Width)
    .attr('height', svg_Height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chartGroup = svg.append("g")

d3.csv("/assets/data/data.csv", function(err, csv_data) {
    if (err) throw err;
    console.log(csv_data)
    csv_data.forEach(function(data) {
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
      })
  
      var yLinearScale = d3.scaleLinear().range([chart_Height, 0]);
      var xLinearScale = d3.scaleLinear().range([0, chart_Width]);
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      xLinearScale.domain([20,
          d3.max(csv_data, function(data) {
          return +data.obesity * 1.05;
        }),
      ]);

      yLinearScale.domain([8,
          d3.max(csv_data, function(data) {
          return +data.smokes * 1.1;
        }),
      ]);
  
      var toolTip = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function(data) {
            var state = data.state;
            var obesity = +data.obesity;
            var smokes = +data.smokes;
            var healthcare = +data.healthcare;
            return (
            '<strong>' + state + '<br> Healthcare: ' + healthcare + '%' + '<br> Obesity: ' + obesity + '%' + '<br> Smoking: ' + smokes + "% </strong><span style='color:red'>"
            )
        });
      svg.call(toolTip);
  
      chartGroup.call(toolTip);
      chartGroup
      .selectAll('circle')
      .data(csv_data)
      .enter()
      .append('circle')
      .attr('cx', function(data, index) {
        return xLinearScale(data.obesity);
      })
      .attr('cy', function(data, index) {
        return yLinearScale(data.smokes);
      })
      .attr('r', '12')
      .attr('fill', 'skyblue')
      .attr('fill-opacity',0.6)
    
      .on('mouseover', function(data) {
        toolTip.show(data);
      })

      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${chart_Height})`)
        .call(bottomAxis);
  
      chartGroup.append('g').call(leftAxis);
  
      svg.selectAll(".dot")
      .data(csv_data)
      .enter()
      .append("text")
      .text(function(data) { return data.abbr; })
      .attr('x', function(data) {
        return xLinearScale(data.obesity);
      })
      .attr('y', function(data) {
        return yLinearScale(data.smokes);
      })
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("text-anchor", "middle");
  
      chartGroup
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - chart_Height / 2)
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Smoking (%)');
  
      chartGroup
        .append('text')
        .attr(
          'transform',
          'translate(' + chart_Width / 2 + ' ,' + (chart_Height + margin.top + 40) + ')',
        )
        .attr('class', 'axisText')
        .text('Obesity (%)');

})
