const grid = document.getElementById("grid");
const width = 9, height = width;
const nrOfBombs = 10;
var squares = [];

const secondsLabel = document.getElementById("seconds"); //count-up timer
var startTimer = "start";
var countSeconds = 0;

const remainingFlags = document.getElementById("remainingFlags"); //flags
var countFlags = 0;

var clickedSquares = 0; //won game

var gameEnd = false; //lost game

function generateBoard() {
  //creez sirul cu bombele plasate pe pozitii random
  const normalsArray = new Array(width * height - nrOfBombs).fill("normals"); //creez un sir cu lungimea de 71 si cu elemente cu numele normals
  const bombsArray = new Array(nrOfBombs).fill("bombs");
  const concatNormalsAndBombs = normalsArray.concat(bombsArray) //impreunez cele 2 siruri (normals + bombs) pt. a le amesteca mai usor
  const shuffle = concatNormalsAndBombs.sort(() => Math.random() - 0.5);

  //creez patratelele si le pun in tabla de joc
  for (let i = 0; i < width * height; ++i) {
    var square = document.createElement("div"); //creez un element HTML cu tag-ul div (patratelul)
    square.setAttribute("id", i); //sau square.id = i;
    square.classList.add(shuffle[i]); //adaug 'bombs' sau 'normals' la clasa patratelului
    grid.appendChild(square); //punem patratelul in tabla de joc
    squares[i] = square; //punem in sir, patratelul, care are div, id si clasa (bombs sau normals)

    square.addEventListener("click", function() { //left click (! si pt. ca am adaugat function() se trece mai departe in cod)
      clickSquare(squares[i]);
    })

    square.addEventListener("contextmenu", function(e) { //right click = contextmenu
      e.preventDefault(); //daca inate deja se intampla ceva "eveniment" pe right click, acum nu se mai intampla, adica pe right click DOAR adaugam/stergem steaguri
      addFlag(squares[i]);
    })
  }
  addNumbersInSquares();
}

function addNumbersInSquares() {
  for(let i = 0; i < width * height; ++i) {
    let neighborBombs = 0;
    squarePosition(i);
    let allEdges = squarePosition(i);
    let edgeUp = allEdges[0], edgeDown = allEdges[1], edgeLeft = allEdges[2], edgeRight = allEdges[3];

    if(squares[i].classList.contains("normals")) { //punem nr. doar in patratelele normale
      if (edgeUp == false && squares[i - width].classList.contains("bombs")) { //sus
        ++neighborBombs;
      }
      if (edgeLeft == false) {
        if (edgeUp == false && squares[i - width - 1].classList.contains("bombs")) { //sus-stanga mijloc
          ++neighborBombs;
        }
        if (squares[i - 1].classList.contains("bombs")) { //stanga
          ++neighborBombs;
        }
        if (edgeDown == false && squares[i + width - 1].classList.contains("bombs")) { //jos-stanga mijloc
          ++neighborBombs;
        }
      }
      if (edgeDown == false && squares[i + width].classList.contains("bombs")) { //jos
        ++neighborBombs;
      }
      if (edgeRight == false) {
        if (edgeDown == false && squares[i + width + 1].classList.contains("bombs")) { //jos-dreapta mijloc
          ++neighborBombs;
        }
        if (squares[i + 1].classList.contains("bombs")) { //dreapta
         ++neighborBombs;
        }
        if (edgeUp == false && squares[i - width + 1].classList.contains("bombs")) { //sus-dreapta mijloc
          ++neighborBombs;
        }
      }
      squares[i].setAttribute("neighborBombs", neighborBombs);
    }
  }
}

function squarePosition(pos) {
  let edgeUp = false, edgeDown = false, edgeLeft = false, edgeRight = false;

  //verific daca sunt pe linia de: SUS sau JOS si STANGA sau DREAPTA
  if (pos <= 8) { //prima linie sus
    edgeUp = true;
  } else if (pos >= 72) { //prima linie jos
    edgeDown = true;
  }
  if (pos % width == 0) { //prima linie stanga
    edgeLeft = true;
  } else if ((pos + 1) % width == 0) { //prima linie dreapta
    edgeRight = true;
  }
  return [edgeUp, edgeDown, edgeLeft, edgeRight];
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
      checkNeighborSquares(square.id);
    }
  }
}

//cand se da click pe un patratel gol, sa se deschida si restul patratelelor (ca in jocul original)
function checkNeighborSquares(squareId) {
  squarePosition(squareId);
  let allEdges = squarePosition(squareId);
  let edgeUp = allEdges[0], edgeDown = allEdges[1], edgeLeft = allEdges[2], edgeRight = allEdges[3];

  if (edgeUp == false) { //sus
    const upSquaresId = parseInt(squareId) - width;
    const upSquares = document.getElementById(upSquaresId);
    clickSquare(upSquares);
  }
  if (edgeDown == false) { //jos
    const downSquaresId = parseInt(squareId) + width;
    const downSquares = document.getElementById(downSquaresId);
    clickSquare(downSquares);
  }
  if (edgeLeft == false) { //stanga
    const leftSquaresId = parseInt(squareId) - 1;
    const leftSquares = document.getElementById(leftSquaresId);
    clickSquare(leftSquares);
    if (edgeUp == false) { //sus-stanga mijloc
      const upLeftSquaresId = parseInt(squareId) - width - 1;
      const upLeftSquares = document.getElementById(upLeftSquaresId);
      clickSquare(upLeftSquares);
    }
    if (edgeDown == false) { //jos-stanga mijloc
      const downLeftSquaresId = parseInt(squareId) + width - 1;
      const downLeftSquares = document.getElementById(downLeftSquaresId);
      clickSquare(downLeftSquares);
    }
  }
  if (edgeDown == false) { //jos
    const downSquaresId = parseInt(squareId) + width;
    const downSquares = document.getElementById(downSquaresId);
    clickSquare(downSquares);
  }
  if (edgeRight == false) { //dreapta
    const rightSquaresId = parseInt(squareId) + 1;
    const rightSquares = document.getElementById(rightSquaresId);
    clickSquare(rightSquares);

    if (edgeDown == false) { //jos-dreapta mijloc
      const underRightSquaresId = parseInt(squareId) + width + 1;
      const underRightSquares = document.getElementById(underRightSquaresId);
      clickSquare(underRightSquares);
    }
    if (edgeUp == false) { //sus-dreapta mijloc
      const upRightSquaresId = parseInt(squareId) - width + 1;
      const upRightSquares = document.getElementById(upRightSquaresId);
      clickSquare(upRightSquares);
    }
  }
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
  for (let i = 0; i < width * height; ++i) {
    if (!squares[i].classList.contains("bombs") && squares[i].classList.contains("flags")) {
      squares[i].classList.add("wrongFlag");
      squares[i].innerHTML = "🚩";
    } else if(squares[i].classList.contains("bombs") && !squares[i].classList.contains("flags")) {
      squares[i].innerHTML = "💣";
    }
  }
}

generateBoard();
