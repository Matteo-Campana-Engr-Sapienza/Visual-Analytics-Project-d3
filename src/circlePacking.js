function drawCirclePacking(data) {

  var parentHeight = parseInt(d3.select("#circle-packing-container").style("height"), 10)
  var parentWidth = parseInt(d3.select("#circle-packing-container").style("width"), 10)


  if (parentHeight < parentWidth) {
    diameter = parentHeight
  } else {
    diameter = parentWidth
  }


  var svg_offset_width = parseInt(Math.abs(parentWidth - diameter) / 2);
  var svg_offset_height = parseInt(Math.abs(parentHeight - diameter) / 2);


  var svg = d3.select("#circle-packing-container")
    .append("svg")
    .attr("width", parentWidth)
    .attr("height", parentHeight)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + diameter + " " + diameter + "")

  var margin = 20,
    g = svg.append("g").attr("transform", "translate(" + (diameter / 2 + svg_offset_width) + "," + (diameter / 2 + svg_offset_height) + ")");

  /* ---------------------------------------------------------------------- */


  var color = d3.scaleLinear()
    .domain([-1, 3])
    .range(["#69b3a2", "#388373"]) //69b3a2
    .interpolate(d3.interpolateHcl);

  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  var nested_data = d3.nest()
    .key(function(d) { return d.year; })
    .key(function(d) { return d.rating; })
    .key(function(d) { return d.genre; })
    .entries(data);

  var nested_data_JSON = JSON.stringify(nested_data);
  nested_data_JSON = nested_data_JSON.replaceAll('"key"', '"name"')
  nested_data_JSON = nested_data_JSON.replaceAll('"values"', '"children"')
  nested_data_JSON = JSON.parse(nested_data_JSON)
  nested_data = nested_data_JSON

  nested_data = { "name": "root", "children": nested_data }

  var root = d3.hierarchy(nested_data)

  root.sum(function(d) {
    return d.votes;
  });

  var focus = root,
    nodes = pack(root).descendants(),
    view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function(d) {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    })
    .style("fill", function(d) {
      return d.children ? color(d.depth) : null;
    })
    .on("click", function(d) {
      if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) {
      return d.parent === root ? 1 : 0;
    })
    .style("display", function(d) {
      return d.parent === root ? "inline" : "none";
    })
    .text(function(d) {
      return d.data.name;
    });

  var node = g.selectAll("circle,text");
  /*
    svg
      .style("background", color(-1))
      .on("click", function() {
        zoom(root);
      });
  */

  svg
    .style("background", color(-1))
    .on("click", function() {
      zoom(root);
    });

  zoomTo([root.x, root.y, root.r * 2 + margin]);



  var ancestors = []

  function setAncestors(d) {
    ancestors = []
    d.ancestors().map((parent) => {
      if (parent.data.name != "root") {
        ancestors.push(parent.data.name)
      }
    })

  }

  function zoom(d) {

    setAncestors(d)

    var data_to_update;

    if (ancestors.length == 3) {
      var year = ancestors[2]
      var rating = ancestors[1]
      var genre = ancestors[0]

      data_to_update = data.filter((d) => {
        return d.year == year && d.rating == rating && d.genre == genre
      })

    } else if (ancestors.length == 2) {
      var year = ancestors[1]
      var rating = ancestors[0]

      data_to_update = data.filter((d) => {
        return d.year == year && d.rating == rating
      })

    } else if (ancestors.length == 1) {
      var year = ancestors[0]

      data_to_update = data.filter((d) => {
        return d.year == year
      })
    }

    if (ancestors.length > 0) {
      updateTop10Movies(data_to_update, data)
      reDrawScatterPlotPCA(data_to_update)
    } else {
      data_to_update = data.filter((d) => {
        return +d.year > 0
      })
      updateTop10Movies(data_to_update, data)
      reDrawScatterPlotPCA(data_to_update)
    }

    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function(t) {
          zoomTo(i(t));
        };
      });

    transition.selectAll("text")
      .filter(function(d) {
        return d && (d.parent === focus || this.style.display === "inline");
      })
      .style("fill-opacity", function(d) {
        return d.parent === focus ? 1 : 0;
      })
      .on("start", function(d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function(d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  function zoomTo(v) {
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function(d) {
      return d.r * k;
    });
  }

}
