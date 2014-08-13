var lineChart = function () {

  // default values for configurable input parameters

  var data = [];

  // var data = [
  //   {
  //     'date': new Date('2014-01-01T08:00:00Z'),
  //     'count': 26
  //   },
  //   {
  //     'date': new Date(2014-01-02T08:00:00Z'),
  //     'count': 43
  //   }, ...
  // ];

  var width = 422;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 };
  var axisLabels = { x: 'Date', y: 'Count' };
  var xAxisDateFormat = d3.time.format('%d %b');
  var color = '#1f77b4';


  var chart = function (container) {

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;


    // setup x-axis
    var xScale = d3.time.scale()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([20, width]);

    var xAxis = d3.svg.axis()
        .orient('bottom')
        .scale(xScale)
        .ticks(5)
        .tickFormat(xAxisDateFormat)
        .tickPadding(8)
        .tickSize(-height, 0);


    // setup y-axis
    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) { return d.count; })])
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .orient('left')
        .scale(yScale)
        .ticks(5)
        .tickFormat(d3.format('s'))
        .tickPadding(8)
        .tickSize(-width, 0);


    // setup line
    var line = d3.svg.line()
        .x(function (d) { return xScale(d.date); })
        .y(function (d) { return yScale(d.count); });


    // setup area
    var area = d3.svg.area()
        .x(function (d) { return xScale(d.date); })
        .y0(height)
        .y1(function (d) { return yScale(d.count); });


    // setup tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          return '<span class="heading">' + tooltipDateFormat(d.date) +
            '</span><br><span class="circle" style="background-color: ' + color + ';"></span>' +
            axisLabels.y + ': ' + d.count;
        });


    // set date format for tooltip
    var tooltipDateFormat = d3.time.format('%A, %B %e, %Y');


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
        .attr('x', -height / 2)
        .attr('y', margin.left / 4)
        .style('text-anchor', 'middle')
        .text(axisLabels.y);


    // create group for chart data
    var g = svg.append('g')
        .attr('class', 'chart-data')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    // draw line
    g.append('path')
        .attr('class', 'line')
        .attr('d', line(data))
        .style({ 'fill': 'none', 'stroke': color, 'stroke-width': 4 });


    // draw area
    g.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area)
        .style({ 'fill': color, 'fill-opacity': 0.1 });


    // invoke tooltip
    g.call(tip);


    // draw circles and add tooltip events
    g.selectAll('circle')
        .data(data)
      .enter().append('circle')
        .attr('class', 'circle')
        .attr('cx', function (d) { return xScale(d.date); })
        .attr('cy', function (d) { return yScale(d.count); })
        .attr('r', 5)
        .style({ 'fill': color, 'stroke': color })
        .on('mouseover', function (d) {
          tip.show(d);
          d3.select(this).classed('active', true);
        })
        .on('mouseout', function () {
          tip.hide();
          d3.select(this).classed('active', false);
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

  chart.xAxisDateFormat = function (value) {
    if (!arguments.length) return xAxisDateFormat;
    xAxisDateFormat = value;
    return chart;
  };

  chart.color = function (value) {
    if (!arguments.length) return color;
    color = value;
    return chart;
  };

  return chart;
};
