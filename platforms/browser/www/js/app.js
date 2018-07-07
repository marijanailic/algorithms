var treeData =
  {
    "name": "0",
    "children": [
      { 
		"name": "1",
        "children": [
          { "name": "3" },
          { "name": "4" }
        ]
      },
      { "name": "2",
      "children": [
        { "name": "5" },
        { "name": "6" }
      ] }
    ]
  };

// set the dimensions and margins of the diagram
var margin = {top: 40, right: 90, bottom: 50, left: 90},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// declares a tree layout and assigns the size
var treemap = d3.tree()
    .size([width, height]);

//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData);

// maps the node data to the tree layout
nodes = treemap(nodes);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// adds the links between the nodes
var link = g.selectAll(".link")
    .data( nodes.descendants().slice(1))
  .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
       return "M" + d.x + "," + d.y
         + "C" + d.x + "," + (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
         + " " + d.parent.x + "," + d.parent.y;
       });

// adds each node as a group
var node = g.selectAll(".node")
    .data(nodes.descendants())
  .enter().append("g")
    .attr("class", function(d) { 
      return "node" + 
        (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; });

// adds the circle to the node
node.append("circle")
.attr("id", function(d){return "node-"+d.data.name})
  .attr("r", 10);

// adds the text to the node
node.append("text")
  .attr("dy", ".35em")
  .attr("y", function(d) { return d.children ? -20 : 20; })
  .style("text-anchor", "middle")
  .text(function(d) { return d.data.name; });

  function selectSubtree(node)
{
    d3.select("#" + node.data.name).style("fill", "black");
}

function findNode(name){
  return d3.select("#node"+name);
}
var selected=findNode("1");
selectSubtree(selected);

function matrix(rows, cols, defaultValue){
  var arr = [];
  for(var i=0; i < rows; i++){
      arr.push([]);
      arr[i].push( new Array(cols));
      for(var j=0; j < cols; j++){
        arr[i][j] = defaultValue;
      }
  }

return arr;
}

function adjMatrix(){
  var count=node.data().length;
 var m= matrix(count, count,0);
  
  d3.selectAll('.node')
  .each(function(d) {
    var row=d.data.name;
    for(var c in d.data.children){
      var column=d.data.children[c].name;
      m[row][column]=1;
    }
   
  });
  return m;
}



var graph=adjMatrix();
window.bfs(graph,0,5);
//window.dfs(graph,0,5);
