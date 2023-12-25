let globalState = {
    grid: document.getElementById("grid"),
    width: 9,
    height: 9,
    nrOfBombs: 10,
    squaresMatrix: Array(9).fill().map(() => Array(9).fill()),
    secondsLabelTimer: document.getElementById("seconds"),
    startTimer: "start",
    countSeconds: 0,
    remainingFlags: document.getElementById("remainingFlags"),
    countFlags: 0,
    clickedSquares: 0,
    gameEnd: false,
}

function generateBoard() {
    // Generate the shuffled array which contains the valid and the boms
    const normalsArray = new Array(globalState.width * globalState.height - globalState.nrOfBombs).fill("normals");
    const bombsArray = new Array(globalState.nrOfBombs).fill("bombs");
    const normalsAndBombs = normalsArray.concat(bombsArray);
    const shuffle = normalsAndBombs.sort(() => Math.random() - 0.5);

    // Create the squares (divs)
    for (let i = 0, k = 0; i < globalState.width; ++i) {
        for (let j = 0; j < globalState.height; ++j) {
            let square = document.createElement("div");
            square.setAttribute("id", i + "" + j);
            square.classList.add(shuffle[k++]); 
            globalState.squaresMatrix[i][j] = square;
            globalState.grid.appendChild(square);
            
            square.addEventListener("click", function() { // left-click
                clickSquare(globalState.squaresMatrix[i][j], i, j);
            });

            square.addEventListener("contextmenu", function(e) { // right-click
                e.preventDefault();
                addFlag(globalState.squaresMatrix[i][j]);
            });
        }
    }
    addNumberInSquares();
}

function addNumberInSquares() {
	for (let i = 0; i < globalState.width; ++i) {
		for (let j = 0; j < globalState.height; ++j) {
			let neighborBombs = 0;
			if (globalState.squaresMatrix[i][j].classList.contains("normals")) {
                // Check the neighboring squares to find out how many bombs there are
				for (let line = i - 1; line < i + 2 && line < globalState.width; ++line) {
					for (let col = j - 1; col < j + 2 && col < globalState.height; ++col) {
						if (checkIfPosInBoard(line, col)) {
							if (globalState.squaresMatrix[line][col].classList.contains("bombs")) {
								++neighborBombs;
							}
						}
					}
				}
				globalState.squaresMatrix[i][j].setAttribute("neighborBombs", neighborBombs);
                // For testing - to verify if the square's neighbor bombs number is correct
				// globalState.squaresMatrix[i][j].innerHTML = neighborBombs;
			}
		}
	}
}

function checkIfPosInBoard (line, col) {
	if (0 <= line && line <= 8 && 0 <= col && col <= 8) {
		return true;
	}
}

function clickSquare(square, line, col) {
	if (globalState.gameEnd || square.classList.contains("clicked") || square.classList.contains("flags")) {
		return;
	}

	if (globalState.startTimer == "start") { // Start the timer on the first left click on a square
	  setInterval(startCountUpTimer, 1000); // Repeat function startCountUpTimer every 1000 milisecunde = 1 sec
	  globalState.startTimer = "continue";
	}

	if (square.classList.contains("bombs")) {
	  lostGame();
	} else {
        const neighborBombs = square.getAttribute("neighborBombs");
        square.classList.add("clicked");
        ++globalState.clickedSquares;
        if (globalState.clickedSquares == globalState.width * globalState.height - globalState.nrOfBombs) {
            winGame();
        }

        if (neighborBombs != 0) { // If the square has neighboring bombs, print only the clicked square
            square.innerHTML = neighborBombs;
        } else { // Else, print all neighboring squares which don't have neighboring bombs
            for (let i = line - 1; i < line + 2; ++i) {
                for (let j = col - 1; j < col + 2; ++j) {
                    if (checkIfPosInBoard(i, j)) {
                        let cell = document.getElementById(i + "" + j);
                        clickSquare(cell, i, j);
                    }
                }
            }
        }
	}
}

function startCountUpTimer() {
	if (globalState.gameEnd || globalState.countSeconds == 999) {
  	    return;
	}
	++globalState.countSeconds;
	globalState.secondsLabelTimer.innerHTML = printTimer(globalState.countSeconds);
}

function printTimer(val) {
	let valString = val + "";
	while (valString.length < 3) {
	    valString = "0".concat(valString);
	}
	return valString;
}

function addFlag(square) {
	if (globalState.gameEnd) {
        return;
	}

	if (globalState.startTimer == "start" && square.classList.contains("normals")) { // Start the timer on the first flag on a square
        setInterval(startCountUpTimer, 1000);
        globalState.startTimer = "continue";
	}

	if (!square.classList.contains("clicked") && !square.classList.contains("flags")) {
        square.classList.add("flags");
        ++globalState.countFlags;
        square.innerHTML = "🚩";
        globalState.remainingFlags.innerHTML = globalState.nrOfBombs - globalState.countFlags;
	} else if (square.classList.contains("flags")) {
        square.classList.remove("flags");
        square.innerHTML = "";
        --globalState.countFlags;
        globalState.remainingFlags.innerHTML = globalState.nrOfBombs - globalState.countFlags;
	}
}

function winGame() {
    globalState.gameEnd = true;
    document.getElementById("gameStatus").innerHTML = "YOU WON!";
    document.getElementById("resetButton").innerHTML = "😎";
}

function lostGame() {
    globalState.gameEnd = true;
    document.getElementById("gameStatus").innerHTML = "YOU LOST!";
    document.getElementById("resetButton").innerHTML = "😱";

    // Print all bombs, good and bad flags
    for (let i = 0; i < globalState.width; ++i) {
        for (let j = 0; j < globalState.height; ++j) {
            if (!globalState.squaresMatrix[i][j].classList.contains("bombs") && globalState.squaresMatrix[i][j].classList.contains("flags")) {
                globalState.squaresMatrix[i][j].classList.add("wrongFlag");
                globalState.squaresMatrix[i][j].innerHTML = "🚩";
            } else if (globalState.squaresMatrix[i][j].classList.contains("bombs") && !globalState.squaresMatrix[i][j].classList.contains("flags")) {
                globalState.squaresMatrix[i][j].innerHTML = "💣";
            }
        }
    }
}

generateBoard();
