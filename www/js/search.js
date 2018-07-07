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
      var node=d3.select("#node-"+targetNode);
          node.classed("red",true);
          node.classed("visited",false);
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

      function hasPath(graph, current, goal) {
        var stack = [];
        var visited = [];
        var node;
        stack.push(current);
        visited[current] = true;
        while (stack.length) {
          node = stack.pop();
          if (node === goal) {
            return true;
          }
          for (var i = 0; i < graph[node].length; i += 1) {
            if (graph[node][i] && !visited[i]) {
              stack.push(i);
              visited[i] = true;
            }
          }
        }
        return false;
      } 

    var dfs = (function () {
      return function (graph, start, goal) {
        return hasPath(graph, start, goal);
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
                var node=d3.select("#node-"+i);
                node.classed("visited",true);
                //sleep(2000);
               
              }
            }
          }
          return null;
        };
      }());

    search.dfs = dfs;
    search.bfs = bfs;
  }(typeof search === 'undefined' ? window : search));