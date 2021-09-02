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
    square.id = i; //atribui fiecarui patratel, un id unic (SAU .setAttribute("id", i))
    square.classList.add(shuffle[i]); //adaug 'bombs' sau 'normals' la clasa patratelului
    grid.appendChild(square); //punem patratelul in tabla de joc
    squares[i] = square; //punem in sir, patratelul, care are div, id si clasa (bombs sau normals)

    square.addEventListener("click", function() { //left click
      clickSquare(squares[i]);
    })

    square.addEventListener("contextmenu", function(e) { //right click = contextmenu
      e.preventDefault(); //daca inate se intampla ceva pe right click, acum nu se mai intampla, adica pe right click DOAR adaugam/stergem steaguri
      addFlag(squares[i]);
    })
  }

  //vedem unde avem bombe si in functie de asta punem nr. in patratele (0 <= nr. din patratel <= 8)
  for(let i = 0; i < width * height; ++i) {
    let neighborBombs = 0;
    let firstUpLine = false, firstDownLine = false, firstLeftLine = false, firstRightLine = false;

    //verificam daca suntem pe linia de: SUS sau JOS si STANGA sau DREAPTA
    if (i <= 8) { //prima linie sus
      firstUpLine = true;
    } else if (i >= 72) { //prima linie jos
      firstDownLine = true;
    }
    if (i % width == 0) { //prima linie stanga
      firstLeftLine = true;
    } else if ((i + 1) % width == 0) { //prima linie dreapta
      firstRightLine = true;
    }

    if(squares[i].classList.contains("normals")) { //punem nr. doar in patratelele normale
      if (firstUpLine == false && squares[i - width].classList.contains("bombs")) { //sus
        ++neighborBombs;
      }
      if (firstLeftLine == false) {
        if (firstUpLine == false && squares[i - width - 1].classList.contains("bombs")) { //sus-stanga mijloc
          ++neighborBombs;
        }
        if (squares[i - 1].classList.contains("bombs")) { //stanga
          ++neighborBombs;
        }
        if (firstDownLine == false && squares[i + width - 1].classList.contains("bombs")) { //jos-stanga mijloc
          ++neighborBombs;
        }
      }
      if (firstDownLine == false && squares[i + width].classList.contains("bombs")) { //jos
        ++neighborBombs;
      }
      if (firstRightLine == false) {
        if (firstDownLine == false && squares[i + width + 1].classList.contains("bombs")) { //jos-dreapta mijloc
          ++neighborBombs;
        }
        if (squares[i + 1].classList.contains("bombs")) { //dreapta
         ++neighborBombs;
        }
        if (firstUpLine == false && squares[i - width + 1].classList.contains("bombs")) { //sus-dreapta mijloc
          ++neighborBombs;
        }
      }
      squares[i].setAttribute("neighborBombs", neighborBombs);
    }
  }
}

function clickSquare(square) {
  console.log("a fost apasat patratul cu id-ul: " + square.id)
  if(gameEnd) { //daca a apasat pe o bomba => game over (a pierdut)
    return; //iesim din functie si automat dezactivam apasarea tuturor butoanelor
  }

  if (square.classList.contains("clicked") || square.classList.contains("flags")) { //nu poti da left click pe un patratel deja apasat sau unul cu steag
    return;
  }

  if (startTimer == "start") { //pornesc timer-ul cand dau primul click pe un patratel
    setInterval(startCountUpTimer, 1000); //repeta functia startCountUpTimer() la fiecare 1000 milisecunde = 1 sec.
    startTimer = "stop";
  }

  if (square.classList.contains("bombs")) { //GAME OVER => lost game
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

//cand dau click pe un patratel gol, sa imi deschida cum trebuie restul patratelelor
function checkNeighborSquares(square) {
  console.log("se intra in functia checkNeighborSquares()");
  let firstUpLine = false, firstDownLine = false, firstLeftLine = false, firstRightLine = false;

  //verificam daca suntem pe linia de: SUS sau JOS si STANGA sau DREAPTA
  if (square.id <= 8) { //prima linie sus
    firstUpLine = true;
  } else if (square.id >= 72) { //prima linie jos
    firstDownLine = true;
  }
  if (square.id % width == 0) { //prima linie stanga
    firstLeftLine = true;
  } else if ((square.id + 1) % width == 0) { //prima linie dreapta
    firstRightLine = true;
  }

  if (firstUpLine == false) { //sus
    const upSquaresId = parseInt(square.id) - width;
    const upSquares = document.getElementById(upSquaresId);
    console.log("SUS, patratul cu id-ul: " + upSquaresId);
    clickSquare(upSquares);
  }
  if (firstDownLine == false) { //jos
    const downSquaresId = parseInt(square.id) + width;
    const downSquares = document.getElementById(downSquaresId);
    console.log("JOS, patratul cu id-ul: " + downSquaresId);
    clickSquare(downSquares);
  }
  if (firstLeftLine == false) { //stanga
    const leftSquaresId = parseInt(square.id) - 1;
    const leftSquares = document.getElementById(leftSquaresId);
    console.log("STANGA, patratul cu id-ul: " + leftSquaresId);
    clickSquare(leftSquares);
    if (firstUpLine == false) { //sus-stanga mijloc
      const upLeftSquaresId = parseInt(square.id) - width - 1;
      const upLeftSquares = document.getElementById(upLeftSquaresId);
      console.log("SUS STANGA, patratul cu id-ul: " + upLeftSquaresId);
      clickSquare(upLeftSquares);
    }
    if (firstDownLine == false) { //jos-stanga mijloc
      const downLeftSquaresId = parseInt(square.id) + width - 1;
      const downLeftSquares = document.getElementById(downLeftSquaresId);
      console.log("JOS STANGA, patratul cu id-ul: " + downLeftSquaresId);
      clickSquare(downLeftSquares);
    }
  }
  if (firstDownLine == false) { //jos
    const downSquaresId = parseInt(square.id) + width;
    const downSquares = document.getElementById(downSquaresId);
    console.log("SUB, patratul cu id-ul: " + downSquaresId);
    clickSquare(downSquares);
  }
  if (firstRightLine == false) { //dreapta
    const rightSquaresId = parseInt(square.id) + 1;
    const rightSquares = document.getElementById(rightSquaresId);
    console.log("DREAPTA, patratul cu id-ul: " + rightSquaresId);
    clickSquare(rightSquares);

    if (firstDownLine == false) { //jos-dreapta mijloc
      const underRightSquaresId = parseInt(square.id) + width + 1;
      const underRightSquares = document.getElementById(underRightSquaresId);
      console.log("JOS DREAPTA, patratul cu id-ul: " + underRightSquaresId);
      clickSquare(underRightSquares);
    }
    if (firstUpLine == false) { //sus-dreapta mijloc
      const upRightSquaresId = parseInt(square.id) - width + 1;
      const upRightSquares = document.getElementById(upRightSquaresId);
      console.log("SUS DREAPTA, patratul cu id-ul: " + upRightSquaresId);
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
  var valString = val + ""; // + "" pt. a afla lungimea numarului
  if (valString.length < 2) { //pt. nr. de 1 cifra (1 -> 9)
    return "00" + valString;
  } else if (valString.length < 3) { //pt. nr. de 2 cifre (10 -> 99)
    return "0" + valString;
  } else { //pt. restul nr. (100 -> 999)
    return valString;
  }
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

  //afisez toate bombele si steagurile bune si gresite, cand s-a apasat un patratel cu bomba
  for (let i = 0; i < width * height; ++i) {
    if (!squares[i].classList.contains("bombs") && squares[i].classList.contains("flags")) {
      console.log("wrong flag");
      squares[i].classList.add("wrongFlag");
      squares[i].innerHTML = "🚩";
    } else if(squares[i].classList.contains("bombs") && !squares[i].classList.contains("flags")) {
      squares[i].innerHTML = "💣";
    }
  }
}

generateBoard();
