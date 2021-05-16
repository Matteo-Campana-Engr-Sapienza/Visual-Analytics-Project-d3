function top10Movies(data) {

  var parentWidth = parseInt(d3.select("#top10Movies").style("width"))
  var parentHeigth = parseInt(d3.select("#top10Movies").style("height"))

  // set the dimensions and margins of the graph
  var margin = { top: 60, right: 135, bottom: 70, left: 80 },
    width = parentWidth - 30 - margin.left - margin.right,
    height = parentHeigth - 30 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#top10Movies")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + parentWidth + " " + parentHeigth + "")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Votes");


  var processedData = d3.nest()
    .key(function(d) { return d.name; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.votes; }); })
    .entries(data);

  // Define beautiful axis
  const pixelsPerTick = 30;
  var numberOfTicksTargetX = Math.max(1, Math.floor(width / pixelsPerTick));
  if (numberOfTicksTargetX > 10) {
    numberOfTicksTargetX = 10;
  }

  processedData.sort(function(a, b) { return d3.descending(a.value, b.value); });
  processedData = processedData.slice(0, numberOfTicksTargetX)
  processedData.slice().sort((a, b) => d3.descending(+a.value, +b.value))
  processedData = processedData.slice(0, numberOfTicksTargetX)

  const maxGross = d3.max(processedData.map((d) => +d.value));

  // X axis
  var x = d3.scaleBand()
    .range([0, width])
    .domain(processedData.map(function(d) { return d.key; }))
    .padding(0.2);
  svg.append("g")
    .attr("class", "myXaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(20,0)rotate(-20)")
    .style("text-anchor", "end");


  // Add Y axis
  var y = d3.scalePow()
    .domain([0, maxGross])
    .range([height, 0]).nice();
  svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y)
      .tickFormat(d3.format(".2s"))
    );

  var nested_data = d3.nest()
    .key(function(d) { return d.rating; })
    .entries(data);

  var color_range = nested_data.map((d) => { return d.key })
  var colors_number = color_range.length

  /*
    var myColor = d3.scaleOrdinal()
      .domain(color_range)
      .range(d3.schemeTableau10);
      */

  myColor = d3.scaleOrdinal()
    .domain(color_range)
    .range(d3.schemePaired);


  // Bars
  svg.selectAll("mybar")
    .data(processedData)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.bandwidth())
    .attr("fill", function(d) {
      return myColor(data.filter(function(c) { return c.name == d.key })[0].rating)
    })
    // no bar at the beginning thus:
    .attr("height", function(d) { return height - y(0); }) // always equal to 0
    .attr("y", function(d) { return y(0); })

  // Animation
  svg.selectAll("rect")
    .transition()
    .delay(function(d, i) { return (i * 3) })
    .duration(2000)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .delay(function(d, i) { return (i * 100) })

  svg.selectAll("rect").attr("class", "bar")

  /*************************************************************************/
  /*******************************   Legend  *******************************/
  /*************************************************************************/


  // Add one dot in the legend for each name.
  svg.selectAll("legendDots")
    .data(color_range)
    .enter()
    .append("circle")
    .attr("cx", (width + margin.left / 2))
    .attr("cy", function(d, i) { return parentHeigth * 0.05 + i * 18 })
    .attr("r", 3.5)
    .style("fill", function(d) { return myColor(d) })
    .style("stroke", "#000")
    .style("stroke-opacity", 0.3)

  // Add one dot in the legend for each name.
  svg.selectAll("legendLabels")
    .data(color_range)
    .enter()
    .append("text")
    .attr("x", (width + 9 + margin.left / 2))
    .attr("y", function(d, i) { return parentHeigth * 0.05 + i * 18 })
    .style("fill", function(d) { return myColor(d) })
    .text(function(d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-size", "100%")
    .style("stroke", "#000")
    .style("stroke-opacity", 0.3)

  /*************************************************************************/
  /*************************************************************************/

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "130%")
    .text("Top Movies");

}



function updateTop10Movies(new_data, old_data) {

  /*
    var nested_data = d3.nest()
      .key(function(d) { return d.rating; })
      .entries(old_data);

    var color_range = nested_data.map((d) => { return d.key })
    var colors_number = color_range.length


    var myColor = d3.scaleOrdinal()
      .domain(color_range)
      .range(d3.schemeTableau10);
      */


  var parentWidth = parseInt(d3.select("#top10Movies").style("width"))
  var parentHeigth = parseInt(d3.select("#top10Movies").style("height"))

  // set the dimensions and margins of the graph
  var margin = { top: 60, right: 135, bottom: 70, left: 80 },
    width = parentWidth - 30 - margin.left - margin.right,
    height = parentHeigth - 30 - margin.top - margin.bottom;


  var svg = d3.select("#top10Movies").select("svg").select("g")

  svg.selectAll("rect")
    .remove()
    .exit()

  new_data = d3.nest()
    .key(function(d) { return d.name; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.votes; }); })
    .entries(new_data);


  // Define beautiful axis
  const pixelsPerTick = 30;
  var numberOfTicksTargetX = Math.max(1, Math.floor(width / pixelsPerTick));
  if (numberOfTicksTargetX > 10) {
    numberOfTicksTargetX = 10;
  }

  new_data.sort(function(a, b) { return d3.descending(+a.value, +b.value); });
  new_data = new_data.slice(0, numberOfTicksTargetX)

  // update X axis
  // X axis
  var x = d3.scaleBand()
    .range([0, width])
    .domain(new_data.map(function(d) { return d.key; }))
    .padding(0.2);

  const maxGross = d3.max(new_data.map((d) => +d.value));

  var y = d3.scalePow()
    .domain([0, maxGross])
    .range([height, 0]).nice();
  svg.select(".myYaxis")
    .call(d3.axisLeft(y)
      .tickFormat(d3.format(".2s")));

  svg.select(".myXaxis")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(20,0)rotate(-20)")
    .style("text-anchor", "end");

  // Bars
  svg.selectAll("mybar")
    .data(new_data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.bandwidth())
    .attr("fill", function(d) {
      return myColor(old_data.filter(function(c) { return c.name == d.key })[0].rating)
    })
    // no bar at the beginning thus:
    .attr("height", function(d) { return height - y(0); }) // always equal to 0
    .attr("y", function(d) { return y(0); })

  // Animation
  svg.selectAll("rect")
    .transition()
    .delay(function(d, i) { return (i * 3) })
    .duration(2000)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .delay(function(d, i) { return (i * 100) })
}
