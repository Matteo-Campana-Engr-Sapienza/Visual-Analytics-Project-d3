function drawScatterPlotPCA(data) {

  var data_pca = computePCA(data)

  d3.select("#scatterPlotPCA").select("*").remove().exit()
  var parentWidth = parseInt(d3.select("#scatterPlotPCA").style("width"))
  var parentHeigth = parseInt(d3.select("#scatterPlotPCA").style("height"))

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 30, left: 60 },
    width = parentWidth - 30 - margin.left - margin.right,
    height = parentHeigth - 30 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#scatterPlotPCA")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + parentWidth + " " + parentHeigth + "")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  // Define beautiful axis
  const pixelsPerTick = 30;
  var numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));


  var maxX = d3.max(data_pca.map((d) => { return d.pca_1 }))
  var minX = d3.min(data_pca.map((d) => { return d.pca_1 }))

  var maxY = d3.max(data_pca.map((d) => { return d.pca_2 }))
  var minY = d3.min(data_pca.map((d) => { return d.pca_2 }))

  // Add X axis
  var x = d3.scaleLinear()
    .domain([minX, maxX])
    .range([0, width])
    .nice();

  var xAxis = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3.axisBottom(x)
      .ticks(numberOfTicksTarget)
      //.tickFormat(d3.format(".2s"))
    );

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([minY, maxY])
    .range([height, 0])
    .nice();
  var yAxis = svg.append("g")
    .attr("class", "yAxis")
    .call(
      d3.axisLeft(y)
      .ticks(numberOfTicksTarget)
      //.tickFormat(d3.format(".2s"))
    );

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data_pca)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(minX) || 0; })
    .attr("cy", function(d) { return y(d.pca_2) || 0; })
    .attr("r", 5)
    .style("fill", "#B3697A")
    .attr("opacity", 0.5)

  // Update chart
  svg.selectAll("circle")
    .transition()
    .delay(function(d, i) { return (i * 3) })
    .duration(200)
    .attr("cx", function(d) { return x(d.pca_1) || 0; })
    .attr("cy", function(d) { return y(d.pca_2) || 0; })



  /* ---------------------------------------------------------------------------- */

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#scatterPlotPCA")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("color", "#000")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "Absolute")
    .style("left", "0") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", "0")

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip.style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("Title: " + d.label.name + "<br>Company: " + d.label.company + "<br>Director: " + d.label.director + "<br>Year: " + d.label.year + "")
      .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1] + parentHeigth * 0.9) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
      .style("left", "0") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", "0")
  }

  svg.selectAll("circle")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  /* ---------------------------------------------------------------------------- */

}

function reDrawScatterPlotPCA(data) {
  d3.select("#scatterPlotPCA").select("*").remove().exit()
  drawScatterPlotPCA(data)
}
