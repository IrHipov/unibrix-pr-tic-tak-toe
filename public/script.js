let AREA_SIZE = 3, WIN_COUNT = 3;
const PLAYER_ONE_CLASS = "game-cell-block_p-one";
const PLAYER_TWO_CLASS = "game-cell-block_p-two";
const NEXT_PLAYER_CLASS = "score-block__player_next-round";
let gameArea;

let isFirstCurrentPlayer = true;
let gameOver = true;
let clicks = 0;
let cells;
const playerScoreBoards = document.getElementsByClassName("score-block__player");


const onCellClick = (event) => {
  if (gameOver) return;

  console.clear();
  const cell = event.target;

  const cellCharClass = isFirstCurrentPlayer ? PLAYER_ONE_CLASS : PLAYER_TWO_CLASS;
  cell.classList.add(cellCharClass);
  cell.classList.remove(!isFirstCurrentPlayer ? PLAYER_ONE_CLASS : PLAYER_TWO_CLASS);

  isFirstCurrentPlayer = !isFirstCurrentPlayer;
  if (isFirstCurrentPlayer) {
    playerScoreBoards[0].classList.add(NEXT_PLAYER_CLASS);
    playerScoreBoards[1].classList.remove(NEXT_PLAYER_CLASS);
  } else {
    playerScoreBoards[0].classList.remove(NEXT_PLAYER_CLASS);
    playerScoreBoards[1].classList.add(NEXT_PLAYER_CLASS);
  }

  cell.removeEventListener("click", onCellClick);

  const xPos = cell.getAttribute("xPos");
  const yPos = cell.getAttribute("yPos");

  clicks++;

  setTimeout(checkCells, 0, xPos, yPos, cellCharClass);
}

const checkCells = (x, y, currentChar) => {
  let dirElementCount = [0, 0, 0, 0];
  x = +x;
  y = +y;

  for (let i = 0; i < 4; i++) {
    let dPos = {x: 0, y: 0};

    if (i === 0) {
      //  *
      //  *
      //  *
      dPos.x = 0;
      dPos.y = -1;
    }
    if (i === 1) {
      //    *
      //  *
      //*
      dPos.x = 1;
      dPos.y = -1;
    }
    if (i === 2) {
      //
      //*  *  *
      //
      dPos.x = 1;
      dPos.y = 0;
    }
    if (i === 3) {
      //*
      //  *
      //    *
      dPos.x = 1;
      dPos.y = 1;
    }
    console.log(1);
    for (let dDist = 1; dDist < WIN_COUNT; dDist++) {
      if (isCellContainChar({x: x + dPos.x * dDist, y: y + dPos.y * dDist}, currentChar, "First")) {
        dirElementCount[i]++;
      } else {
        break;
      }
    }

    for (let dDist = 1; dDist < WIN_COUNT; dDist++) {
      if (isCellContainChar({x: x - dPos.x * dDist, y: y - dPos.y * dDist}, currentChar, "Second")) {
        dirElementCount[i]++;
      } else {
        break;
      }
    }

    if (dirElementCount[i] >= WIN_COUNT - 1) {
      gameEnd(currentChar === PLAYER_ONE_CLASS ? 1 : 2);
      return;
    } else if (clicks >= AREA_SIZE * AREA_SIZE) {
      gameEnd(0);
      return;
    }
  }
}

const gameEnd = (winnerCode) => {
  gameOver = true;
  let winText = "Draw!";
  let winnerPlayerClass = PLAYER_ONE_CLASS;

  if (winnerCode !== 0) {
    if (winnerCode === 1) {
      winText = "Player X WIN!";
      winnerPlayerClass = PLAYER_ONE_CLASS;
    } else {
      winText = "Player O WIN!";
      winnerPlayerClass = PLAYER_TWO_CLASS;
    }
    const playerWinsCount = window.sessionStorage.getItem(winnerPlayerClass) || 0;
    window.sessionStorage.setItem(winnerPlayerClass, +playerWinsCount + 1);
  }

  setTimeout(() => {
    const doReload = confirm(`Game end. ${winText}\n Reload page?`);
    if (doReload) {
      window.location.reload();
    }
  }, 400);
}

const isCellContainChar = (dPos, char, k) => {
  if (dPos.x < AREA_SIZE && dPos.y < AREA_SIZE && dPos.x >= 0 && dPos.y >= 0) {
    let cell = cells[dPos.x + AREA_SIZE * dPos.y];

    if (cell) {
      printCell(dPos, char);
      return cell.classList.contains(char);
    }
  }
  return false;
}

const printCell = (dPos, char) => {
  let array = [[AREA_SIZE], [AREA_SIZE]];

  for (let i = 0; i < AREA_SIZE; i++) {
    array[i] = [];

    for (let j = 0; j < AREA_SIZE; j++) {
      if (dPos.x === j && dPos.y === i) {
        array[i][j] = char === PLAYER_ONE_CLASS ? "X" : "Y";
      } else {
        array[i][j] = "0";
      }
    }
  }
  console.table(array);
}

const loadGame = () => {
  const player1 = document.getElementById("x-player-score");
  const player2 = document.getElementById("o-player-score");
  player1.innerText = window.sessionStorage.getItem(PLAYER_ONE_CLASS) || 0;
  player2.innerText = window.sessionStorage.getItem(PLAYER_TWO_CLASS) || 0;

  setTimeout(() => {
    let userInput;
    let msg = "Enter number (3 <= x <= 12)";

    do {
      userInput = prompt(msg, '');
      userInput = userInput.trim();

      if (userInput && userInput == +userInput && userInput >= 3 && userInput <= 12) {
        break;
      } else if (userInput !== null) {
        msg = 'Wrong number. Enter again';
      }
    } while (true);

    AREA_SIZE = +userInput;
    cells = [];
    gameArea = document.getElementById("game-area-block");

    for (let i = 0; i < AREA_SIZE; i++) {
      for (let j = 0; j < AREA_SIZE; j++) {
        const newCell = document.createElement("div");
        newCell.classList.add("game-cell-block");
        newCell.setAttribute("xPos", j.toString());
        newCell.setAttribute("yPos", i.toString());

        cells.push(newCell);
        newCell.addEventListener("click", onCellClick);
        gameArea.appendChild(newCell);
      }
    }

    gameArea.style.gridTemplateColumns = `repeat(${AREA_SIZE}, 1fr)`;

    gameOver = false;
  }, 200);
}

const reload = () => {
  isFirstCurrentPlayer = true;
  gameOver = true;
  clicks = 0;
  gameArea.innerHTML = "";
  loadGame();
}

window.onload = () => {
  loadGame();
  document.getElementById("reload-button")
    .addEventListener('click', () => {
      reload();
    });
};
