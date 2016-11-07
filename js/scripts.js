var gridWidth;

function Board() {
  this.grid = [];
  this.minesRemaining;
  this.width;
}

Board.prototype.placeMines = function() {
  var potentialLocations = [];

  for (row = 0; row < this.width; row++) {
    for (column = 0; column < this.width; column++) {
      potentialLocations.push(row.toString() + column.toString());
    }
  }
  for (var mine = 0; mine < this.minesRemaining; mine++) {
    var locationIndex = Math.floor(Math.random() * potentialLocations.length);
    var randomMine = potentialLocations[locationIndex];
    this.grid[randomMine[0]][randomMine[1]] = 1;
  }
  // console.log("grid: ", this.grid);
}

Board.prototype.resetGrid = function() {
  this.grid = [];
  for (row = 0; row < this.width; row++) {
    this.grid.push([]);
    for (column = 0; column < this.width; column++) {
      this.grid[row].push(0);
    }
  }
  clearArray(adjacentBlanks);
  clearArray(checked);
}

Board.prototype.updateUI = function() {
  $(".grid").empty();
  for (row = 0; row < this.width; row++) {
    $(".grid").append('<div class="row gridRow" id="row' + row.toString() + '"></div>');
    for (column = 0; column < this.width; column++) {
      $("#row" + row).append('<div class="gridColumn" id="' + row.toString()  +  column.toString() + '">[]</div>');
        if (this.grid[row][column]) {
          $("#"+row.toString()+column.toString()).toggleClass("hasMine");
        }
      $("#" + row.toString() + column.toString()).click(function() {
        // $(this).toggleClass("coordinateHighlight");
        pushAdjacents(this.id);
        loopThroughBoard();
        clearArray(checked);
      })
    }
  }
}

var adjacentBlanks = [];
var adjacentSquares = [];
var checked =  [];

function pushAdjacents(coordinates) {
  var x = getX(coordinates);
  var y = getY(coordinates);
  up = [(x - 1), y]
  down = [(x + 1), y]
  left = [x, (y - 1)]
  right = [x, (y + 1)]

  if (isInBounds(up) === true && isNotBomb(up) === true) {
    if (checked.indexOf("" + up) === -1) {
      adjacentBlanks.push(up);
    }
  }
  if (isInBounds(down) === true && isNotBomb(down) === true) {
    if (checked.indexOf("" + down) === -1) {
      adjacentBlanks.push(down);
    }
  }
  if (isInBounds(left) === true && isNotBomb(left) === true) {
    if (checked.indexOf("" + left) === -1) {
      adjacentBlanks.push(left);
    }
  }
  if (isInBounds(right) === true && isNotBomb(right) === true) {
    if (checked.indexOf("" + right) === -1) {
      adjacentBlanks.push(right);
    }
  }
}

function loopThroughBoard() {
  for (var i = 0; i < adjacentBlanks.length; i++) {
    if (checked.indexOf("" + adjacentBlanks[i]) === -1) {
      checked.push("" + adjacentBlanks[i]);
      var coordinates = "" + adjacentBlanks[i][0] + adjacentBlanks[i][1];
      $("#" + adjacentBlanks[i][0] + adjacentBlanks[i][1]).toggleClass("coordinateHighlight");
      pushAdjacents(coordinates);
    }
  }
}

function getX(id) {
  var x = parseInt(id.charAt(0));
  return x;
}

function getY(id) {
  var y = parseInt(id.charAt(1));
  return y;
}

function isNotBomb(coordinates) {
  if (gameBoard.grid[coordinates[0]][coordinates[1]] != 1) {
    return true;
  } else {
    return false;
  }
}

function isInBounds(coordinates) {
  if (coordinates[0] >= 0 && coordinates[0] < gameBoard.width &&
      coordinates[1] >= 0 && coordinates[1] < gameBoard.width) {
    return true;
  } else {
    return false;
  }
}

function clearArray(array) {
  array.length = 0;
}

var gameBoard = new Board();

$(function() {

  $("form").submit(function(event) {
    event.preventDefault();
    gridWidth = parseInt($("#gridDimension").val());

    gameBoard.width = gridWidth;
    gameBoard.minesRemaining = gridWidth * 2;
    gameBoard.resetGrid();
    gameBoard.placeMines();
    gameBoard.updateUI();

  });
})
