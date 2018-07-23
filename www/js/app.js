(function (draw) {
  'use strict';

 var graph = (function () {


    function matrix(rows, cols, defaultValue) {
      var arr = [];
      for (var i = 0; i < rows; i++) {
        arr.push([]);
        arr[i].push(new Array(cols));
        for (var j = 0; j < cols; j++) {
          arr[i][j] = defaultValue;
        }
      }

      return arr;
    }

    function adjMatrix(nodes) {
      var count = nodes.data().length;
      var m = matrix(count, count, 0);

      d3.selectAll('.node')
        .each(function (d) {
          var row = d.data.name;
          for (var c in d.data.children) {
            var column = d.data.children[c].name;
            m[row][column] = 1;
          }

        });
      return m;
    }


    return function (treeData) {
      // set the dimensions and margins of the diagram
      var margin = { top: 40, right: 90, bottom: 50, left: 90 },
        width = 660 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // declares a tree layout and assigns the size
      var treemap = d3.tree()
        .size([width, height]);

      //  assigns the data to a hierarchy using parent-child relationships
      var nodes = d3.hierarchy(treeData);

      // maps the node data to the tree layout
      nodes = treemap(nodes);

      var svg = d3.select("#graph").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 660 500"),
        g = svg.append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      // adds the links between the nodes
      var link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
          return "M" + d.x + "," + d.y
            + "C" + d.x + "," + (d.y + d.parent.y) / 2
            + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
            + " " + d.parent.x + "," + d.parent.y;
        });

        link.append("text")
            .text(function (d) {return "d.type";});

       

      // adds each node as a group
      var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function (d) {
          return "node" +
            (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      // adds the circle to the node
      node.append("circle")
        .attr("id", function (d) { return "node-" + d.data.name })
        .attr("r", 25);

      // adds the text to the node
      node.append("text")
        .attr("dy", ".35em")
        .attr("y", function (d) { return d.children ? 0 : 0; })
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.name; });

      return adjMatrix(node);
    };
  })();

  draw.graph = graph;

}(typeof draw === 'undefined' ? window : draw));
