function top10Movies(data) {

  var parentWidth = parseInt(d3.select("#top10Movies").style("width"))
  var parentHeigth = parseInt(d3.select("#top10Movies").style("height"))

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 70 },
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


  const pixelsPerTick = 30;
  const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
  //console.log("numberOfTicksTarget : ", numberOfTicksTarget);


  var processedData = d3.nest()
    .key(function(d) { return d.name; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.votes; }); })
    .entries(data);


  processedData.sort(function(a, b) { return d3.descending(a.value, b.value); });

  processedData = processedData.slice(0, 10)

  processedData.slice().sort((a, b) => d3.descending(+a.value, +b.value))

  processedData = processedData.slice(0, 10)

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
    .attr("transform", "translate(30,0)rotate(-20)")
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


  var myColor = d3.scaleOrdinal()
    .domain(color_range)
    .range(d3.schemeTableau10);

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

}



function updateTop10Movies(new_data) {

  var parentWidth = parseInt(d3.select("#top10Movies").style("width"))
  var parentHeigth = parseInt(d3.select("#top10Movies").style("height"))

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 70 },
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

  new_data.sort(function(a, b) { return d3.descending(+a.value, +b.value); });
  new_data = new_data.slice(0, 10)

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
    .attr("transform", "translate(30,0)rotate(-20)")
    .style("text-anchor", "end");

  // Bars
  svg.selectAll("mybar")
    .data(new_data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.bandwidth())
    .attr("fill", "#B3697A")
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
