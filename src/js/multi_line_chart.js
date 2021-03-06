var multiLineChart = function () {

  // default values for configurable input parameters

  var data = [];

  // var data = [
  //   {
  //     name: 'Line 1',
  //     points: [
  //       { 'date': new Date('2014-01-01T08:00:00Z'), count: 25 },
  //       { 'date': new Date('2014-02-01T08:00:00Z'), count: 37 },
  //       ...
  //     ]
  //   },
  //   {
  //     name: 'Line 2',
  //     points: [
  //       { 'date': new Date('2014-01-01T08:00:00Z'), count: 26 },
  //       { 'date': new Date('2014-02-01T08:00:00Z'), count: 41 },
  //       ...
  //     ]
  //   },
  //   ...
  // ];

  var width = 422;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 };
  var axisLabels = { x: 'Date', y: 'Count' };
  var xAxisDateFormat = d3.time.format('%d %b');
  var colorScale = d3.scale.category20();
  var legendHeight = 60;


  var chart = function (container) {

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom - legendHeight;


    // setup x-axis
    var xScale = d3.time.scale()
        .domain(d3.extent(data[0].points, function (d) { return d.date; }))
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
        .domain([0, d3.max(data, function (d) {
          var counts = d.points.map(function (point) { return point.count; });
          return Math.max.apply(Math, counts);
        })])
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5)
        .tickSize(-width, 0)
        .tickPadding(8)
        .tickFormat(d3.format('s'));


    // setup tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
          return '<span class="heading">' + tooltipDateFormat(d.date) +
            '</span><br><span class="circle" style="background-color: ' + d.color +
            ';"></span>' + d.lineName + ': ' + d.count;
        });


    // set date format for tooltip
    var tooltipDateFormat = d3.time.format('%A, %B %e, %Y');


    // draw svg container
    var svg = container.append('svg')
        .attr('class', 'svg-chart line-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + legendHeight);


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


    // setup and draw lines
    data.forEach(function (line, i) {

      var lines = {};
      lines['line' + i] = d3.svg.line()
          .x(function (d) { return xScale(d.date); })
          .y(function (d) { return yScale(d.count); });

      g.append('path')
          .attr('class', 'line')
          .attr('d', lines['line' + i](data[i].points))
          .style({ 'fill': 'none', 'stroke': colorScale(i), 'stroke-width': 4 });

    });


    // invoke tooltip
    g.call(tip);


    // format data for drawing circles
    var circleData = [];

    data.forEach(function (line, i) {
      line.points.forEach(function (point) {
        point.color = colorScale(i);
        point.lineName = line.name;
        circleData.push(point);
      });
    });


    // draw circles and add tooltip events
    g.selectAll('circle')
        .data(circleData)
      .enter().append('circle')
        .attr('class', 'circle')
        .attr('cx', function (d) { return xScale(d.date); })
        .attr('cy', function (d) { return yScale(d.count); })
        .attr('r', 5)
        .style('fill', function (d) { return d.color; })
        .style('stroke', function (d) { return d.color; })
        .on('mouseover', function (d) {
          tip.show(d);
          d3.select(this).classed('active', true);
        })
        .on('mouseout', function () {
          tip.hide();
          d3.select(this).classed('active', false);
        });


    // setup and draw legend
    var legend = svg.append('g').attr('class', 'legend');

    var previousTextLength = 0;
    var legendGroup = legend.selectAll('circle')
        .data(data)
      .enter().append('g')
        .attr('transform', function (d, i) {
          var pixelWidth = previousTextLength * 12;
          previousTextLength = d.name.length;
          return 'translate(' + pixelWidth + ', 0)';
        });

    legendGroup.append('circle')
        .attr('class', 'circle')
        .attr('cx', 0)
        .attr('cy', 5)
        .attr('r', 5)
        .style('fill', function (d, i) { return colorScale(i); });

    legendGroup.append('text')
        .attr('class', 'legend text')
        .attr('x', 10)
        .attr('y', 10)
        .text(function (d) { return d.name; });

    legend.attr('transform', function () {
          var x = margin.left + width / 2 - this.getBBox().width / 2;
          var y = height + margin.top + margin.bottom + legendHeight / 2;
          return 'translate(' + x + ',' + y + ')';
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

  chart.colorScale = function (value) {
    if (!arguments.length) return colorScale;
    colorScale = value;
    return chart;
  };

  chart.legendHeight = function (value) {
    if (!arguments.length) return legendHeight;
    legendHeight = value;
    return chart;
  };

  return chart;
};
