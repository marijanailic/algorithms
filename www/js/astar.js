(function (exports) {
  'use strict';

  function Node(x,y, distance) {
    this.x = x;
    this.y=y;
    this.f;
    this.g = distance;
    this.h;
    this.cost = 1;
    this.visited = false;
    this.closed = false;
    this.parent = null;
  }

  var astar = (function () {
    function init(graph) {
      var grid=[];
      var count=graph[0].length;
      for (var x = 0; x < count; x++) {
        grid.push([]);
        grid[x].push(new Array(count));
        for (var y = 0; y < count; y++) {
          var node = new Node(x,y,graph[x][y]);
          grid[x][y]=node;
        }
      }
      console.log(grid);

      return grid;
    }

    function manhattan(pos0, pos1) {
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    }

    function connectingNodes(grid, node) {
      var result = [];
      var x = node.x;
      var y = node.y;

      for(var i=0;i<grid[x].length;i++){
        if(grid[x][i].g < Infinity && grid[x][i]!=node){
          result.push(grid[x][i]);
        }
      }

      for(var i=0;i<grid.length;i++){
        if(grid[i][y].g<Infinity && grid[i][y] !=node){
          result.push(grid[i][y]);
        }
      }
      
      return result;
    }

    return function (start, end, graph, callbackVisited, callbackPath) {
      var grid=init(graph);

      var frontier = new window.Heap(function(nodeA,nodeB){
        return nodeA.f-nodeB.f;
      });
      var startNode=grid[start][start];
      startNode.g = 0;
      startNode.f = 0;
      var endNode=grid[end][end];
      frontier.add(startNode);
      startNode.closed=false;

      while (!frontier.isEmpty()) {

        var current = frontier.extract();

        if (current.y===endNode.y) {
          var curr = current;
          var ret = [];
          callbackPath(curr.x, curr.y);
          while (curr.parent) {
            ret.push(curr);
            curr = curr.parent;
            callbackPath(curr.x,curr.y);
          }
          return ret.reverse();
        }

        current.closed = true;

        var neighbors = connectingNodes(grid, current);
        callbackVisited(current.x,neighbors[0].x);

        for (var i = 0; i < neighbors.length; i++) {
          var neighbor = neighbors[i];
          callbackVisited(neighbor.x,neighbor.y);

          if (neighbor.closed) {
            // Not a valid node to process, skip to next neighbor.
            continue;
          }

          var gScore = current.g + neighbor.g;
          var visited = neighbor.visited;
          if (!visited || gScore < neighbor.g) {

            var h;
            if(neighbor.h){
              h=neighbor.h;
            }
            
            neighbor.parent = current;
            neighbor.g = gScore;

            neighbor.h = h || neighbor.g*manhattan(endNode, neighbor);
            neighbor.f = neighbor.g + neighbor.h;
         
            if (!visited) {
              frontier.add(neighbor);
              neighbor.visited = true;

            }
            else {
              frontier.update(neighbor);
            }
            grid[neighbor.x][neighbor.y]=neighbor;
          }
        }
      }

      return [];
    };
  })();
  exports.astar = astar;
})(typeof window === 'undefined' ? module.exports : window);