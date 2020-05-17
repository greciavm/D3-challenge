var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(journalismdata) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    journalismdata.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(journalismdata, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(journalismdata, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(12);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("cicrle")
    .data(journalismdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("class", "stateCircle")

    var circletextGroup = chartGroup.selectAll()
    .data(journalismdata)
    .enter()
    .append("text")
    .text(d => (d.abbr))
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class", "stateText")

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      //.offset([60, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    /* Invoke the tip in the context of your visualization */
    chartGroup.call(toolTip)

    circlesGroup.selectAll('circle')
    .data(journalismdata)
    .enter()
    .append('circle')
    .attr('width', function() { return x.rangeBand() })
    .attr('height', function(d) { return h - y(d) })
    .attr('y', function(d) { return y(d) })
    .attr('x', function(d, i) { return x(i) })
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide)


    // // Step 7: Create tooltip in the chart
    // // ==============================
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("click", function(data) {
    //     toolTip.show(data, this);
    //   })
    //     // onmouseout event
    //     .on("mouseout", function(data, index) {
    //       toolTip.hide(data);
    //     });  

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
