(function (search) {
    'use strict';

    function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

    function colorNode(targetNode){
      var node=d3.select("#node-"+targetNode).transition()
      .style("stroke", "red")
      .delay(8000)
      .duration(1000)
    }

    function colorVisitedNode(i){
      d3.select("#node-"+i)
                .transition()
                .style("stroke", "yellowgreen")
                .delay(function(){return 1000*i})
                .duration(1000)
    }

    function buildPath(parents, targetNode) {
        var result = [targetNode];   
        colorNode(targetNode);
        while (parents[targetNode] !== null) {
          targetNode = parents[targetNode];
          result.push(targetNode);
          colorNode(targetNode);
        }
        return result.reverse();
      }

    var dfs = (function () {
      return function (graph, startNode, targetNode) {
        var parents = [];
        var stack = [];
        var visited = [];
        var current;
        stack.push(startNode);
        parents[startNode] = null;
        visited[current] = true;
        while (stack.length) {
          current = stack.shift();
          if (current === targetNode) {
            return buildPath(parents, targetNode);
          }
          for (var i = 0; i < graph[current].length; i += 1) {
            if (i !== current && graph[current][i] && !visited[i]) {
              parents[i] = current;
              stack.push(i);
              visited[i] = true;
              colorVisitedNode(i);
            }
          }

        }
        return null;
      };
    }());

    var bfs = (function () {
        return function (graph, startNode, targetNode) {
          var parents = [];
          var queue = [];
          var visited = [];
          var current;
          queue.push(startNode);
          parents[startNode] = null;
          visited[startNode] = true;
          while (queue.length) {
            current = queue.shift();
            if (current === targetNode) {
              return buildPath(parents, targetNode);
            }
            for (var i = 0; i < graph.length; i += 1) {
              if (i !== current && graph[current][i] && !visited[i]) {
                parents[i] = current;
                visited[i] = true;
                queue.push(i);
                colorVisitedNode(i);
                
              }
            }
          }
          return null;
        };
      }());

    search.dfs = dfs;
    search.bfs = bfs;
  }(typeof search === 'undefined' ? window : search));