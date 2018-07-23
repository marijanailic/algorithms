(function (draw) {
  'use strict';

  var graph = (function () {

    function filterNodesById(nodes, id) {
      return nodes.filter(function (n) { return n.id === id; });
    }

    function triplesToGraph(triples) {



      //svg.html("");
      //Graph
      var graph = { nodes: [], links: [] };

      //Initial Graph from triples
      triples.forEach(function (triple) {
        var subjId = triple.subject;
        var predId = triple.predicate;
        var objId = triple.object;
        var weightValue = triple.predicate * 10;

        var subjNode = filterNodesById(graph.nodes, subjId)[0];
        var objNode = filterNodesById(graph.nodes, objId)[0];

        if (subjNode == null) {
          subjNode = { id: subjId, label: subjId, weight: weightValue };
          graph.nodes.push(subjNode);
        }

        if (objNode == null) {
          objNode = { id: objId, label: objId, weight: weightValue };
          graph.nodes.push(objNode);
        }


        graph.links.push({ source: subjNode, target: objNode, predicate: predId, weight: weightValue });
      });

      return graph;
    }


    function update(graph, svg) {

      svg.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 30)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:polyline")
        .attr("points", "0,-5 10,0 0,5")
        ;

      var links = svg.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("marker-end", "url(#end)")
        .attr("class", "end-link")
        .attr("stroke-width", 1)
        ;//links

      var linkTexts = svg.selectAll(".link-text")
        .data(graph.links)
        .enter()
        .append("text")
        .attr("class", "link-text")
        .text(function (d) { return d.predicate; })
        ;


      var nodeTexts = svg.selectAll(".node-text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .attr("class", "node-text")
        .attr("dy", ".35em")
        .attr("y", function (d) { return d.children ? 0 : 0; })
        .style("text-anchor", "middle")
        .text(function (d) { return d.label; })
        ;

      //nodeTexts.append("title")
      //		.text(function(d) { return d.label; });
      var force = d3.forceSimulation().nodes(graph.nodes);

      var charge_force = d3.forceManyBody().strength(-100);
      var center_force = d3.forceCenter(300, 300);
      var link_force = d3.forceLink(graph.links)
        .id(function (d) {
          return d.weight;
        })
        .distance(function (d) {
          return d.weight;
        });
      force
        .force("center_force", center_force)
        .force("charge_force", charge_force)
        .force("links", link_force);

      var nodes = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .style("stroke", "#4ABDAC")
        .style("fill", "#4ABDAC")
        .attr("r", 8);


      force.on("tick", function () {
        nodes
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; })
          ;

        links
          .attr("x1", function (d) { return d.source.x; })
          .attr("y1", function (d) { return d.source.y; })
          .attr("x2", function (d) { return d.target.x; })
          .attr("y2", function (d) { return d.target.y; })
          ;

        nodeTexts
          .attr("x", function (d) { return d.x + 12; })
          .attr("y", function (d) { return d.y + 3; })
          ;


        linkTexts
          .attr("x", function (d) { return 4 + (d.source.x + d.target.x) / 2; })
          .attr("y", function (d) { return 4 + (d.source.y + d.target.y) / 2; })
          ;
      });

      force
        .nodes(graph.nodes)

      d3.forceLink(graph.links)
        .distance(100);

    }

    return function (triples) {
      // set the dimensions and margins of the diagram
      var margin = { top: 40, right: 90, bottom: 50, left: 90 };

      var svg = d3.select("#graph").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 660 500");



      var graph = triplesToGraph(triples);

      update(graph, svg);
    };

  })();
  draw.directedgraph = graph;

}(typeof draw === 'undefined' ? window : draw));
