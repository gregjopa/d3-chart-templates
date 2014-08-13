var barChart = function () {

  // default values for configurable input parameters

  var data = [];

  // var data = [
  //   {
  //     'name': 'January',
  //     'count': 26
  //   },
  //   {
  //     'name': 'February',
  //     'count': 43
  //   }, ...
  // ];

  var width = 422;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 };
  var axisLabels = { x: 'Date', y: 'Count' };
  var color = '#1f77b4';


  var chart = function (container) {

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;


    // setup x-axis
    var xScale = d3.scale.ordinal()
        .domain(data.map(function (d) { return d.name; }))
        .rangeRoundBands([0, width], 0.25);

    var xAxis = d3.svg.axis()
        .orient('bottom')
        .scale(xScale)
        .tickPadding(8)
        .tickSize(-height, 0);


    // setup y-axis
    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) { return d.count; })])
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5)
        .tickSize(-width, 0)
        .tickPadding(6)
        .tickFormat(d3.format('s'));


    // setup tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          return '<span class="heading">' + d.name + '</span><br/> ' +
            axisLabels.y + ': ' + d.count;
        });


    // draw svg container
    var svg = container.append('svg')
        .attr('class', 'svg-chart line-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);


    // draw x-axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
        .call(xAxis);


    // draw x-axis label
    svg.append('text')
        .attr('class', 'x axis-label')
        .attr('x', margin.left + width / 2)
        .attr('y', height + margin.top + margin.bottom - 2)
        .style('text-anchor', 'middle')
        .text(axisLabels.x);


    // draw y-axis
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(yAxis);


    // draw y-axis label
    svg.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', margin.left / 4)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text(axisLabels.y);


    // create group for chart data
    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    // invoke tooltip
    g.call(tip);


    // draw bars and add tooltip events
    g.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) { return xScale(d.name); })
        .attr('y', function (d) { return yScale(d.count); })
        .attr('width', xScale.rangeBand())
        .attr('height', function (d) { return height - yScale(d.count); })
        .style('fill', color)
        .on('mouseover', function (d) {
          tip.show(d);
          var self = d3.select(this);
          self.classed('active', true);
          self.style('fill', d3.rgb(color).brighter(0.6).toString());
        })
        .on('mouseout', function () {
          tip.hide();
          var self = d3.select(this);
          self.classed('active', false);
          self.style('fill', color);
        });

  };


  chart.data = function (value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };

  chart.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.margin = function (value) {
    if (!arguments.length) return margin;
    margin = value;
    return chart;
  };

  chart.axisLabels = function (value) {
    if (!arguments.length) return axisLabels;
    axisLabels = value;
    return chart;
  };

  chart.color = function (value) {
    if (!arguments.length) return color;
    color = value;
    return chart;
  };

  return chart;
};
