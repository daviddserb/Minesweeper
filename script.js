const grid = document.getElementById("grid");
const width = 9, height = width;
const nrOfBombs = 10;
var squaresArray = Array(9).fill().map(() => Array(9).fill()); //divs

const secondsLabel = document.getElementById("seconds"); //count-up timer
var startTimer = "start";
var countSeconds = 0;

const remainingFlags = document.getElementById("remainingFlags");
var countFlags = 0;

var clickedSquares = 0; //will be used to check if won game

var gameEnd = false; //will be true when won game

function generateBoard() {
  //make the shuffled array (normals + bombs)
  const normalsArray = new Array(width * height - nrOfBombs).fill("normals"); //i build an array of length 71 with all the elements named "normals"
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
	      clickSquare(squaresArray[i][j]);
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
  				console.log("se verifica matricea 3x3 pt. pozitia= " + i + " " + j);
  				for (let m = i - 1; m < i + 2 && m < width; ++m) {
  					for (let n = j - 1; n < j + 2 && n < height; ++n) {
  						console.log("m= " + m + " n= " + n);
  						if (m < 0 || n < 0) {
  							posOutOfBoard(m, n);
	  						let newPos = posOutOfBoard(m, n)
	  						m = newPos[0], n = newPos[1];
	  						console.log("noile valori: " + m + " " + n);
  						}
  						if (squaresArray[m][n].classList.contains("bombs")) {
  							++neighborBombs;
  						}
  					}
  				}
  				squaresArray[i][j].setAttribute("neighborBombs", neighborBombs);
  				squaresArray[i][j].innerHTML = neighborBombs;
  			}
  		}
  	}
}

function posOutOfBoard(startLine, startCol) {
	console.log("se intra in functia posOutOfBoard");
	if (startLine < 0) {
		++startLine;
	}
	if (startCol < 0) {
		++startCol;
	}
	return [startLine, startCol];
	console.log("noi pozitii: " + startLine + " " + startCol);
}

function clickSquare(square) {
	 if(gameEnd) { //daca a apasat pe o bomba => game over (a pierdut)
	    return; //iesim din functie si automat dezactivam apasarea tuturor butoanelor
	 }

	if (square.classList.contains("clicked") || square.classList.contains("flags")) { //nu poti da left click pe un patratel deja apasat sau unul cu steag
	    return;
	 }

	if (startTimer == "start") { //pornesc timer-ul cand se da primul click pe un patratel
	    setInterval(startCountUpTimer, 1000); //repeta functia startCountUpTimer() la fiecare 1000 milisecunde = 1 sec.
	    startTimer = "stop";
	 }

	if (square.classList.contains("bombs")) {
	    lostGame();
	} else {
	    const neighborBombs = square.getAttribute("neighborBombs");
	    square.classList.add("clicked"); //adaugam pe langa clasa normals, clasa clicked
	    ++clickedSquares;
	    if (clickedSquares == width * height - nrOfBombs) {
	      winGame();
	    }
	    if (neighborBombs != 0) {
	      square.innerHTML = neighborBombs;
	    } else if (neighborBombs == 0){
	      checkNeighborSquares(square);
	    }
	}
}

function checkNeighborSquares(square0) {
	
}

function startCountUpTimer() {
  	if(gameEnd) { //daca s-a apasat pe o bomba
    	return; //oprim timer-ul
  	}
  	if (countSeconds == 999) { //la 999 de secs. jucate se opreste timer-ul
    	return;
  	}

  	++countSeconds;
  	secondsLabel.innerHTML = printTimer(countSeconds);
}

function printTimer(val) {
	let valString = val + ""; //il facem de tip string, pt. a afla lungimea mai usor si a adauga '0' la inceput
	while (valString.length < 3) {
	    valString = "0".concat(valString);
	}
	return valString;
}

function addFlag(square) {
	if (gameEnd) {
	    return;
	}
	if (startTimer == "start" && square.classList.contains("normals")) { //pornesc timer-ul si cand pun primul steag pe un patratel
	    setInterval(startCountUpTimer, 1000); //repeta functia startCountUpTimer() la fiecare 1000 milisecunde = 1 sec.
	    startTimer = "stop";
	}

	if (!square.classList.contains("clicked") && !square.classList.contains("flags")) { //adaug steag doar pe patratelele neapasate
	    square.classList.add("flags");
	    ++countFlags;
	    square.innerHTML = "🚩";
	    remainingFlags.innerHTML = nrOfBombs - countFlags;
	} else if (square.classList.contains("flags")) { //sterg steag
	    square.classList.remove("flags");
	    square.innerHTML = "";
	    --countFlags;
	    remainingFlags.innerHTML = nrOfBombs - countFlags;
	}
}

function winGame() {
  gameEnd = true; //blocam apasarea tuturor patratelelor
  document.getElementById("gameStatus").innerHTML = "CONGRATULATIONS, YOU WON!";
  document.getElementById("resetButton").innerHTML = "😎";
}

function lostGame() {
  gameEnd = true; //blocam apasarea tuturor patratelelor
  document.getElementById("gameStatus").innerHTML = "GAME OVER, YOU LOST!";
  document.getElementById("resetButton").innerHTML = "😱";

  //afisez toate bombele si steagurile bune si gresite
  for (let i = 0; i < width; ++i) {
  	for (let j = 0; j < height; ++j) {
	    if (!squaresArray[i][j].classList.contains("bombs") && squaresArray[i][j].classList.contains("flags")) {
	      squaresArray[i][j].classList.add("wrongFlag");
	      squaresArray[i][j].innerHTML = "🚩";
	    } else if(squaresArray[i][j].classList.contains("bombs") && !squaresArray[i][j].classList.contains("flags")) {
	      squaresArray[i][j].innerHTML = "💣";
	    }
	}
  }
}

generateBoard();
