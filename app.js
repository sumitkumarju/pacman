document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const width = 28; //* 28*28 = 784 squares
  let score = 0;

  // * layout of the grid

  // 0 - pac-dots
  // 1 - wall
  // 2 - ghost-lair
  // 3 - power-pellet
  // 4 - empty
  const squares = [];
  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      const square = document.createElement("div");
      grid.appendChild(square);
      squares.push(square);

      //* add layout to the board

      if (layout[i] === 0) {
        squares[i].classList.add("pac-dot");
      } else if (layout[i] === 1) {
        squares[i].classList.add("wall");
      } else if (layout[i] === 2) {
        squares[i].classList.add("ghost-lair");
      } else if (layout[i] === 3) {
        squares[i].classList.add("power-pellet");
      }
    }
  }
  createBoard();

  //* create Characters

  //* draw pacman onto the board
  let pacmanCurrentIndex = 490;
  squares[pacmanCurrentIndex].classList.add("pac-man");

  //* move pacman

  function movePacman(e) {
    squares[pacmanCurrentIndex].classList.remove("pac-man");

    switch (e.keyCode) {
      case 37:
        if (
          pacmanCurrentIndex % width !== 0 &&
          !squares[pacmanCurrentIndex - 1].classList.contains("wall") &&
          !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")
        )
          pacmanCurrentIndex -= 1;
        //*Check if left exit
        if (squares[pacmanCurrentIndex - 1] === squares[363]) {
          pacmanCurrentIndex = 391;
        }
        break;

      case 38:
        if (
          pacmanCurrentIndex - width >= 0 &&
          !squares[pacmanCurrentIndex - width].classList.contains("wall") &&
          !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")
        )
          pacmanCurrentIndex -= width;
        break;

      case 39:
        if (
          pacmanCurrentIndex % width < width - 1 &&
          !squares[pacmanCurrentIndex + 1].classList.contains("wall") &&
          !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")
        )
          pacmanCurrentIndex += 1;
        //*Check if right exit
        if (squares[pacmanCurrentIndex + 1] === squares[392]) {
          pacmanCurrentIndex = 364;
        }

        break;

      case 40:
        if (
          pacmanCurrentIndex + width < width * width &&
          !squares[pacmanCurrentIndex + width].classList.contains("wall") &&
          !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")
        )
          pacmanCurrentIndex += width;
        break;
    }
    squares[pacmanCurrentIndex].classList.add("pac-man");
    pacDotEaten();
    powerPelletEaten();
    checkForGameOver();
    checkForWin();
  }
  document.addEventListener("keyup", movePacman);

  //* When you eat a power pellet
  function powerPelletEaten() {
    if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
      score += 10;
      scoreDisplay.innerHTML = parseInt(scoreDisplay.innerHTML) + 10;
      ghosts.forEach((ghost) => (ghost.isScared = true));
      setTimeout(unScareGhosts, 10000);
      squares[pacmanCurrentIndex].classList.remove("power-pellet");
    }
  }

  //* make the ghosts stop flashing
  function unScareGhosts() {
    ghosts.forEach((ghost) => (ghost.isScared = false));
  }

  //* what happens when you eat a pac-dot
  function pacDotEaten() {
    if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
      score++;
      scoreDisplay.innerHTML = parseInt(scoreDisplay.innerHTML) + 1;
      squares[pacmanCurrentIndex].classList.remove("pac-dot");
    }
  }

  //* create ghosts using Constructors
  class Ghost {
    constructor(className, startIndex, speed) {
      this.className = className;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.isScared = false;
      this.timerId = NaN;
    }
  }

  //* all my ghosts
  ghosts = [
    new Ghost("blinky", 197, 200),
    new Ghost("pinky", 376, 200),
    new Ghost("inky", 351, 200),
    new Ghost("clyde", 379, 200),
  ];

  //* draw my ghosts onto the grid
  ghosts.forEach((ghost) => {
    squares[ghost.currentIndex].classList.add(ghost.className);
    squares[ghost.currentIndex].classList.add("ghost");
  });

  //* move the Ghosts randomly
  ghosts.forEach((ghost) => moveGhost(ghost));

  //* get the coordinates of pacman or blinky on the grid with X and Y axis
  function getCoordinates(index) {
    return [index % width, Math.floor(index / width)];
  }

  //* Move Ghost
  function moveGhost(ghost) {
    const directions = [-width, width, +1, -1];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(function () {
      //* if the next squre your ghost is going to go to does not have a ghost and does not have a wall
      if (
        !squares[ghost.currentIndex + direction].classList.contains("ghost") &&
        !squares[ghost.currentIndex + direction].classList.contains("wall")
      ) {
        console.log(direction);
        const [ghostX, ghostY] = getCoordinates(ghost.currentIndex);
        const [pacManX, pacManY] = getCoordinates(pacmanCurrentIndex);
        const [ghostNextX, ghostNextY] = getCoordinates(
          ghost.currentIndex + direction
        );

        function isXCoordCloser() {
          if (Math.abs(ghostNextX - pacManX) < Math.abs(ghostX - pacManX)) {
            return true;
          } else return false;
        }

        function isYCoordCloser() {
          if (Math.abs(ghostNextY - pacManY) < Math.abs(ghostY - pacManY)) {
            return true;
          } else return false;
        }

        if (isXCoordCloser() || isYCoordCloser()) {
          //* remove the ghosts classes
          squares[ghost.currentIndex].classList.remove(ghost.className);
          squares[ghost.currentIndex].classList.remove("ghost", "scared-ghost");
          //* move into that space
          ghost.currentIndex += direction;
          squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
        } else {
          //* make a random move
          direction = directions[Math.floor(Math.random() * directions.length)];
          if (
            !squares[ghost.currentIndex + direction].classList.contains(
              "ghost"
            ) &&
            !squares[ghost.currentIndex + direction].classList.contains("wall")
          ) {
            //* remove the ghosts classes
            squares[ghost.currentIndex].classList.remove(ghost.className);
            squares[ghost.currentIndex].classList.remove(
              "ghost",
              "scared-ghost"
            );
            //* move into that space
            ghost.currentIndex += direction;
            squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
          }
        }

        //* else find a new random direction to go in
      } else direction = directions[Math.floor(Math.random() * directions.length)];

      //* if the ghost is currently scared
      if (ghost.isScared) {
        squares[ghost.currentIndex].classList.add("scared-ghost");
      }

      //* if the ghost is currently scared and pacman is on it
      if (
        ghost.isScared &&
        squares[ghost.currentIndex].classList.contains("pac-man")
      ) {
        squares[ghost.currentIndex].classList.remove(
          ghost.className,
          "ghost",
          "scared-ghost"
        );
        ghost.currentIndex = ghost.startIndex;
        // ghost.isScared = false;
        scoreDisplay.innerHTML = parseInt(scoreDisplay.innerHTML) + 100;
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      }
      checkForGameOver();
    }, ghost.speed);
  }
  //* check for a game over
  function checkForGameOver() {
    if (
      squares[pacmanCurrentIndex].classList.contains("ghost") &&
      !squares[pacmanCurrentIndex].classList.contains("scared-ghost")
    ) {
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener("keyup", movePacman);
      setTimeout(function () {
        alert("Game Over");
      }, 500);
    }
  }
  //*check for a win - more is when this score is reached
  function checkForWin() {
    if (score === 374) {
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener("keyup", movePacman);
      setTimeout(function () {
        alert("You have WON!");
      }, 500);
    }
  }
});
