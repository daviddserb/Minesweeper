var width = 9, height = width;
var nrBombs = 10;
var squares = [];
const grid = document.querySelector('.grid'); //salvez tabla de joc din HTML si CSS (cred?)

function generateBoard() {
  //construim tabelul de joc
  const normalsArray = Array(width * height - nrBombs).fill('notBombs');
  const bombsArray = Array(nrBombs).fill('bombs');

  for (let i = 0; i < width*height; ++i) {
    var square = document.createElement('div'); //creez 81 de div-uri (adica patratelele)
    square.setAttribute('id', i); //atribui fiecarui patratel, un id cu nr. unic
    grid.appendChild(square); //punem patratelele in tabla de joc
  }

  //vedem unde avem bombe si in functie de asta, punem nr. in patrate
  for(let i = 0; i < width*height; ++i) {

  }

}

generateBoard();