const M_CLASS = 'm';
const C_CLASS = 'c';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const restartButton = document.getElementById('restart-button');
const mScoreElement = document.getElementById('m-score');
const cScoreElement = document.getElementById('c-score');

let oTurn;
let mScore = parseInt(localStorage.getItem('mScore')) || 0;
let cScore = parseInt(localStorage.getItem('cScore')) || 0;

// İlk skorları yazdır
updateScoreDisplay();

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  oTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(M_CLASS);
    cell.classList.remove(C_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  gameStatus.innerText = "M's turn";
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? C_CLASS : M_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    gameStatus.innerText = 'Draw!';
  } else {
    gameStatus.innerText = `${oTurn ? "Ç's" : "M's"} Wins!`;
    if (oTurn) {
      cScore++;
      localStorage.setItem('cScore', cScore);
    } else {
      mScore++;
      localStorage.setItem('mScore', mScore);
    }
    updateScoreDisplay();
  }
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  });
}

function updateScoreDisplay() {
  mScoreElement.innerText = mScore;
  cScoreElement.innerText = cScore;
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(M_CLASS) || cell.classList.contains(C_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  oTurn = !oTurn;
  gameStatus.innerText = `${oTurn ? "Ç's" : "M's"}'s turn`;
}

function setBoardHoverClass() {
  board.classList.remove(M_CLASS);
  board.classList.remove(C_CLASS);
  if (oTurn) {
    board.classList.add(C_CLASS);
  } else {
    board.classList.add(M_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}