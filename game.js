var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var grid = 16;
var count = 0;

// Check if localStorage.score is not null
// If it is not null, assign 0 to score
// Otherwise, assign the value of localStorage.score to score
var score = 0;

// Reading last score value
document.getElementById("score").innerHTML = score;

var max = 0;
var snake = {
  x: 160,
  y: 160,

  // Snake Velocity
  // Moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // Keep track of all grids the snake body occupies
  cells: [],

  // Length of the snake. grows when eating an apple
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// Get random whole numbers in a specific range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Game loop
function loop() {
  requestAnimationFrame(loop);
  // Slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 10) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Move snake by its velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  // Wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // Wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // Keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });
  // Remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // Draw apple
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
  // Draw snake one cell at a time
  context.fillStyle = "green";
  snake.cells.forEach(function (cell, index) {
    // Drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 1;

      // Saving score for next playing.
      // localStorage.setItem("score", score);

      document.getElementById("score").innerHTML = score;

      // Canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      // Snake occupies the same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        if (score > max) {
          max = score;
        }
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        document.getElementById("high").innerHTML = max;

        // Update score
        score = 0;
        document.getElementById("score").innerHTML = score;
      }
    }
  });
}

// Listen to keyboard events to move the snake
document.addEventListener("keydown", function (e) {
  // Prevent snake from backtracking on itself by checking that it's
  // Not already moving on the same axis (pressing left while moving
  // Left won't do anything, and pressing right while moving left
  // Shouldn't let you collide with your own body)

  // Left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // Up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // Right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // Down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Check if the screen width is less than 980 pixels
if (window.innerWidth < 980) {
  // Show the button container
  var buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.classList.remove("hidden");

  // Get the buttons
  var upButton = document.getElementById("upButton");
  var leftButton = document.getElementById("leftButton");
  var rightButton = document.getElementById("rightButton");
  var downButton = document.getElementById("downButton");

  // Add event listeners to the buttons
  if(upButton) {
    upButton.addEventListener("click", function () {
      if (snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      }
    });
  }
  if(leftButton) {
    leftButton.addEventListener("click", function () {
      if (snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      }
    });
  }
  if(rightButton) {
    rightButton.addEventListener("click", function () {
      if (snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      }
    });
  }
  if(downButton) {
    downButton.addEventListener("click", function () {
      if (snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
    });
  }
}

// Start the game
requestAnimationFrame(loop);