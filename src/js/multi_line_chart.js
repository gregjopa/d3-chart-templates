var multiLineChart = function () {

  // default values for configurable input parameters

  var data = [];

  // var data = [
  //   [
  //     { 'date': new Date('2014-01-01T08:00:00Z'), 'count': 25 },
  //     { 'date': new Date(2014-01-01T08:00:00Z'), 'count': 26 }
  //   ],
  //   [
  //     { 'date': new Date('2014-01-02T08:00:00Z'), 'count': 37 },
  //     { 'date': new Date(2014-01-02T08:00:00Z'), 'count': 41 }
  //   ],
  //   ...
  // ];

  var width = 422;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 50, left: 50 };
  var axisLabels = { x: 'Date', y: 'Count' };
  var xAxisDateFormat = d3.time.format('%d %b');
  var colorScale = d3.scale.category20();
  var legendLabels = ['Count 1', 'Count 2'];
  var legendHeight = 60;


  var chart = function (container) {

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom - legendHeight;


    // setup x-axis
    var xScale = d3.time.scale()
        .domain(d3.extent(data, function (d) { return d[0].date; }))
        .range([20, width]);

    var xAxis = d3.svg.axis()
        .orient('bottom')
        .scale(xScale)
        .ticks(5)
        .tickFormat(xAxisDateFormat)
        .tickPadding(6)
        .tickSize(-height, 0);


    // setup y-axis
    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
          var counts = d.map(function (point) { return point.count; });
          return Math.max.apply(Math, counts);
        })])
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
          return '<span class="date">' + tooltipDateFormat(d.date) +
            '</span><br><span class="circle" style="background-color: ' + d.color +
            ';"></span>Clicks: ' + d.count;
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
    data[0].forEach(function (point, i) {

      var lines = {};
      lines['line' + i] = d3.svg.line()
          .x(function (d) { return xScale(d[i].date); })
          .y(function (d) { return yScale(d[i].count); });

      g.append('path')
          .attr('class', 'line')
          .attr('d', lines['line' + i](data))
          .style({ 'fill': 'none', 'stroke': colorScale(i), 'stroke-width': 4 });

    });


    // invoke tooltip
    g.call(tip);


    // format data for drawing circles
    var circleData = [];

    data.forEach(function (points) {
      points.forEach(function (point, i) {
        point.color = colorScale(i);
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
        .data(legendLabels)
      .enter().append('g')
        .attr('transform', function (d, i) {
          var pixelWidth = previousTextLength * 12;
          previousTextLength = d.length;
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
        .text(function (d) { return d; });

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

  chart.legendLabels = function (value) {
    if (!arguments.length) return legendLabels;
    legendLabels = value;
    return chart;
  };

  chart.legendHeight = function (value) {
    if (!arguments.length) return legendHeight;
    legendHeight = value;
    return chart;
  };

  return chart;
};
