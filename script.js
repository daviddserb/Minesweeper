const width = 9, height = width;
const grid = document.getElementById("grid");
const nrBombs = 10;
var squares = [];

function generateBoard() {
  //construim tabelul de joc
  const normalsArray = Array(width * height - nrBombs).fill("notBombs");
  const bombsArray = Array(nrBombs).fill("bombs");
  const concatArray = normalsArray.concat(bombsArray)
  const shuffledArray = concatArray.sort(() => Math.random() - 0.5);
  alert(shuffledArray) //MERGE!!!

  for (let i = 0; i < width*height; ++i) {
    var square = document.createElement("div"); //creez 81 de div-uri (adica patratelele)
    square.setAttribute("id", i); //atribui fiecarui patratel, un id cu nr. unic
    //Acum trebuie in square (adica div, patratelul) sa salvez valorile din shuffledArray.
    //Am incercat mai multe chestii si nu merg: square = shuffledArray[i], add(), push(), etc...
    grid.appendChild(square); //punem patratelele in tabla de joc
    squares.push(square);
  }

  //vedem unde avem bombe si in functie de asta, punem nr. in patrate
  for(let i = 0; i < width*height; ++i) {
    let nrInSquare = 0;

  }
}

generateBoard();
