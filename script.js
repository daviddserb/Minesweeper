const grid = document.getElementById("grid");
const width = 9, height = width;
const nrOfBombs = 10;
var squaresArray = Array(9).fill().map(() => Array(9).fill()); //divs

const secondsLabel = document.getElementById("seconds"); //count-up timer
var startTimer = "start";
var countSeconds = 0;

const remainingFlags = document.getElementById("remainingFlags");
var countFlags = 0;

var gameEnd = false; //will be true when won game
var clickedSquares = 0; //will be used to check if won game

function generateBoard() {
    //make the shuffled array (normals + bombs)
    const normalsArray = new Array(width * height - nrOfBombs).fill("normals"); //build an array of length 71 with all the elements named "normals"
    const bombsArray = new Array(nrOfBombs).fill("bombs");
    const normalsAndBombs = normalsArray.concat(bombsArray)
    const shuffle = normalsAndBombs.sort(() => Math.random() - 0.5);
	
    //make the squares
    for (let i = 0, k = 0; i < width; ++i) {
  	for (let j = 0; j < height; ++j) {
  	    var square = document.createElement("div");
	    square.setAttribute("id", i + "" + j);
	    square.classList.add(shuffle[k++]); 
	    squaresArray[i][j] = square;
	    grid.appendChild(square);
	    
	    square.addEventListener("click", function() { //left click
	        clickSquare(squaresArray[i][j], i, j);
	    })

	    square.addEventListener("contextmenu", function(e) { //right click = contextmenu
	        e.preventDefault(); //delete all the events that happen before on the right click
	        addFlag(squaresArray[i][j]);
	    })
         }
    }
    addNumberInSquares();
}

function addNumberInSquares() {
    for (let i = 0; i < width; ++i) {
	for (let j = 0; j < height; ++j) {
	    let neighborBombs = 0;
	    if (squaresArray[i][j].classList.contains("normals")) {
	        for (let line = i - 1; line < i + 2 && line < width; ++line) {
		    for (let col = j - 1; col < j + 2 && col < height; ++col) {
		        if (checkIfPosInBoard(line, col)) {
		            if (squaresArray[line][col].classList.contains("bombs")) {
			        ++neighborBombs;
			    }
		        }
		    }
	        }
		squaresArray[i][j].setAttribute("neighborBombs", neighborBombs);
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
    if (gameEnd) {
        return;
    }
    if (square.classList.contains("clicked") || square.classList.contains("flags")) {
        return;
    }

    if (startTimer == "start") { //start the timer on the first click on a square
        setInterval(startCountUpTimer, 1000); //repeat function startCountUpTimer() every 1000 milisecunde = 1 sec.
        startTimer = "stop";
    }

if (square.classList.contains("bombs")) {
lostGame();
} else {
const neighborBombs = square.getAttribute("neighborBombs");
square.classList.add("clicked");
++clickedSquares;
if (clickedSquares == width * height - nrOfBombs) {
winGame();
}
if (neighborBombs != 0) {
square.innerHTML = neighborBombs;
} else {
for (let i = line - 1; i < line + 2; ++i) {
for (let j = col - 1; j < col + 2; ++j) {
if (checkIfPosInBoard(i, j)) {
let cellId = i + "" + j;
let cell = document.getElementById(cellId);
clickSquare(cell, i, j);
}
}
}
}
}
}

function startCountUpTimer() {
	if (gameEnd || countSeconds == 999) {
  	return;
	}

	++countSeconds;
	secondsLabel.innerHTML = printTimer(countSeconds);
}

function printTimer(val) {
	let valString = val + ""; //we make it a string to find easier the length of the number
	while (valString.length < 3) {
	    valString = "0".concat(valString);
	}

	return valString;
}

function addFlag(square) {
	if (gameEnd) {
    return;
	}

	if (startTimer == "start" && square.classList.contains("normals")) { //start the timer on the first flag on a square as well
    setInterval(startCountUpTimer, 1000);
    startTimer = "stop";
	}

	if (!square.classList.contains("clicked") && !square.classList.contains("flags")) {
    square.classList.add("flags");
    ++countFlags;
    square.innerHTML = "🚩";
    remainingFlags.innerHTML = nrOfBombs - countFlags;
	} else if (square.classList.contains("flags")) {
    square.classList.remove("flags");
    square.innerHTML = "";
    --countFlags;
    remainingFlags.innerHTML = nrOfBombs - countFlags;
	}
}

function winGame() {
  gameEnd = true;
  document.getElementById("gameStatus").innerHTML = "CONGRATULATIONS, YOU WON!";
  document.getElementById("resetButton").innerHTML = "😎";
}

function lostGame() {
  gameEnd = true;
  document.getElementById("gameStatus").innerHTML = "GAME OVER, YOU LOST!";
  document.getElementById("resetButton").innerHTML = "😱";

  //print all the bombs and good and bad flags
  for (let i = 0; i < width; ++i) {
  	for (let j = 0; j < height; ++j) {
	    if (!squaresArray[i][j].classList.contains("bombs") && squaresArray[i][j].classList.contains("flags")) {
	      squaresArray[i][j].classList.add("wrongFlag");
	      squaresArray[i][j].innerHTML = "🚩";
	    } else if (squaresArray[i][j].classList.contains("bombs") && !squaresArray[i][j].classList.contains("flags")) {
	      squaresArray[i][j].innerHTML = "💣";
	    }
	  }
  }
}

generateBoard();
