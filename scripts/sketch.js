var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path;
var noSolution = false;

removeFromArr = (a, e) => {
  var i = a.lastIndexOf(e);
  a.splice(i, 1);
}

heuristic = (a, b) => {
  // get the euclidian distance between a & b
  var d = dist(a.i, a.j, b.i, b.j);
  // var d = abs(a.i, b.i) + abs(a.j, b.j);
  return d;
}

function Spot(i,j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;
  if (random(1) < 0.3) this.wall = true;
}
Spot.prototype.show = function(color) {
  fill(color);
  if (this.wall) {
    fill(0);
  }
  noStroke();
  rect(this.i * w,this.j * h, w - 1, h - 1);
}
Spot.prototype.addNeighbors = function(grid) {
  var i = this.i;
  var j = this.j;
  if (i < cols - 1) {
    this.neighbors.push(grid[i + 1][j]);
  }
  if (i > 0) {
    this.neighbors.push(grid[i - 1][j]);
  }
  if (j < rows - 1) {
    this.neighbors.push(grid[i][j + 1]);
  }
  if (j > 0) {
    this.neighbors.push(grid[i][j - 1]);
  }
}

setup = () => {
  createCanvas(500, 500);

  w = width / cols;
  h = height / rows;

  for(var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i,j);
    }
  }

  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;
  openSet.push(start);

  // console.table(grid);

}

draw = () => {

  if (openSet.length > 0) {
    // we can keep going
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    if (current === end) {
      noLoop();
      console.log("Done!");
    }
    removeFromArr(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    neighbors.forEach((n,i) => {
      if (!closedSet.includes(n) && !n.wall) {
        var tempG = current.g + heuristic(n, current);
        if (openSet.includes(n)) {
          if (tempG < n.g) {
            n.g = tempG;
          }
        } else {
          n.g = tempG;
          openSet.push(n);
        }
        n.h = heuristic(n,end);
        n.f = n.g + n.h;
        n.previous = current;
      }
    });

  } else {
    // no solution
    console.log("No Solution.");
    noSolution = true;
    noLoop();
  }

  background(0);

  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      grid[i][j].show(255);
    }
  }
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255,0,0));
  }
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0,255,0));
  }
  // Find the path
  if (!noSolution) {
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  }

  path.forEach(i => {
    i.show(color(50,0,255));
  })

}
