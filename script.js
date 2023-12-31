let globalState = {
    grid: document.getElementById("grid"),
    width: 9,
    height: 9,
    nrBombs: 10,
    secondsLabelTimer: document.getElementById("seconds"),
    isTimerOn: false,
    cntSeconds: 0,
    remainingFlags: document.getElementById("remainingFlags"),
    cntFlags: 0,
    cntClickedSquares: 0,
    isGameEnd: false,
}
globalState.squaresMatrix = Array(globalState.height).fill().map(() => Array(globalState.width).fill());

document.getElementById("bombCount").innerHTML = globalState.nrBombs;

function generateBoard() {
    // Generate the shuffled array which contains the valid and the boms
    const NORMALS = new Array(globalState.width * globalState.height - globalState.nrBombs).fill("normals");
    const BOMBS = new Array(globalState.nrBombs).fill("bombs");
    const NORMALS_AND_BOMBS = NORMALS.concat(BOMBS);
    const NORMALS_AND_BOMBS_SHUFFLED = NORMALS_AND_BOMBS.sort(() => Math.random() - 0.5);

    // Create the squares
    for (let row = 0, cntShuffle = 0; row < globalState.width; ++row) {
        for (let col = 0; col < globalState.height; ++col) {
            let square = document.createElement("div");

            square.setAttribute("id", row + "" + col);
            square.classList.add(NORMALS_AND_BOMBS_SHUFFLED[cntShuffle++]);

            globalState.squaresMatrix[row][col] = square;
            globalState.grid.appendChild(square);
            
            square.addEventListener("click", function() { // Left-click
                clickSquare(globalState.squaresMatrix[row][col], row, col);
            });

            square.addEventListener("contextmenu", function(e) { // Right-click
                e.preventDefault();
                addFlag(globalState.squaresMatrix[row][col]);
            });
        }
    }
    addNumberInSquares();
}

function addNumberInSquares() {
    for (let row = 0; row < globalState.width; ++row) {
        for (let col = 0; col < globalState.height; ++col) {
            let neighborBombs = 0;
            if (globalState.squaresMatrix[row][col].classList.contains("normals")) {
                // Check the neighboring squares (3x3 matrix) to find out how many bombs there are
                for (let neighborRow = row - 1; neighborRow < row + 2 && neighborRow < globalState.width; ++neighborRow) {
                    for (let neighborCol = col - 1; neighborCol < col + 2 && neighborCol < globalState.height; ++neighborCol) {
                        if (isPositionInBoard(neighborRow, neighborCol)) {
                            if (globalState.squaresMatrix[neighborRow][neighborCol].classList.contains("bombs")) {
                                ++neighborBombs;
                            }
                        }
                    }
                }
                globalState.squaresMatrix[row][col].setAttribute("neighborBombs", neighborBombs);
                // FOR TESTING - verify if the square's neighbor bombs number is correct
                // globalState.squaresMatrix[row][col].innerHTML = neighborBombs;
            }
        }
    }
}

function isPositionInBoard (row, col) {
    if (0 <= row && row < globalState.width && 0 <= col && col < globalState.height) return true;
}

function clickSquare(square, row, col) {
    if (globalState.isGameEnd || square.classList.contains("clicked") || square.classList.contains("flags")) return;

    if (globalState.isTimerOn == false) { // Start the timer on the first left-click on a square
      setInterval(startCountUpTimer, 1000); // Repeat function startCountUpTimer every 1000 milisecunde = 1 sec
      globalState.isTimerOn = true;
    }

    if (square.classList.contains("bombs")) {
      lostGame();
    } else {
        const neighborBombs = square.getAttribute("neighborBombs");
        square.classList.add("clicked");
        ++globalState.cntClickedSquares;
        if (globalState.cntClickedSquares == globalState.width * globalState.height - globalState.nrBombs) {
            wonGame();
        }

        if (neighborBombs != 0) { // If the square has neighboring bombs, print only the clicked square
            square.innerHTML = neighborBombs;
        } else { // Else, print all neighboring squares which don't have neighboring bombs
            for (let neighborRow = row - 1; neighborRow < row + 2; ++neighborRow) {
                for (let neighborCol = col - 1; neighborCol < col + 2; ++neighborCol) {
                    if (isPositionInBoard(neighborRow, neighborCol)) {
                        let cell = document.getElementById(neighborRow + "" + neighborCol);
                        clickSquare(cell, neighborRow, neighborCol);
                    }
                }
            }
        }
    }
}

function startCountUpTimer() {
    if (globalState.isGameEnd || globalState.cntSeconds == 999) return;

    ++globalState.cntSeconds;
    globalState.secondsLabelTimer.innerHTML = printTimer(globalState.cntSeconds);
}

function printTimer(val) {
    let valString = val + "";
    while (valString.length < 3) valString = "0".concat(valString);
    return valString;
}

function addFlag(square) {
    if (globalState.isGameEnd) return;

    if (globalState.isTimerOn == false && square.classList.contains("normals")) { // Start the timer on the first right-click (flag) on a square
        setInterval(startCountUpTimer, 1000);
        globalState.isTimerOn = true;
    }

    if (!square.classList.contains("clicked") && !square.classList.contains("flags")) {
        square.classList.add("flags");
        square.innerHTML = "🚩";
        ++globalState.cntFlags;
        globalState.remainingFlags.innerHTML = globalState.nrBombs - globalState.cntFlags;
    } else if (square.classList.contains("flags")) {
        square.classList.remove("flags");
        square.innerHTML = "";
        --globalState.cntFlags;
        globalState.remainingFlags.innerHTML = globalState.nrBombs - globalState.cntFlags;
    }
}

function wonGame() {
    globalState.isGameEnd = true;
    document.getElementById("gameStatus").innerHTML = "YOU WON!";
    document.getElementById("resetButton").innerHTML = "😎";
}

function lostGame() {
    globalState.isGameEnd = true;
    document.getElementById("gameStatus").innerHTML = "YOU LOST!";
    document.getElementById("resetButton").innerHTML = "😱";

    // Print all bombs, good and bad flags
    for (let row = 0; row < globalState.width; ++row) {
        for (let col = 0; col < globalState.height; ++col) {
            if (!globalState.squaresMatrix[row][col].classList.contains("bombs") && globalState.squaresMatrix[row][col].classList.contains("flags")) {
                globalState.squaresMatrix[row][col].classList.add("wrongFlag");
            } else if (globalState.squaresMatrix[row][col].classList.contains("bombs") && !globalState.squaresMatrix[row][col].classList.contains("flags")) {
                globalState.squaresMatrix[row][col].innerHTML = "💣";
            }
        }
    }
}

generateBoard();
