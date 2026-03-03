const PLAYER1_CLASS = 'player1';
const PLAYER2_CLASS = 'player2';
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const LETTERS = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
  'X', 'W', 'Q'
];

// --- Ekranlar ---
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');

// --- Oyun elemanları ---
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const restartButton = document.getElementById('restart-button');
const backButton = document.getElementById('back-button');
const startButton = document.getElementById('start-button');
const p1ScoreElement = document.getElementById('p1-score');
const p2ScoreElement = document.getElementById('p2-score');
const p1Label = document.getElementById('p1-label');
const p2Label = document.getElementById('p2-label');
const turnIndicator = document.getElementById('turn-indicator');

// --- Seçim ekranı elemanları ---
const p1Grid = document.getElementById('p1-grid');
const p2Grid = document.getElementById('p2-grid');
const p1Display = document.getElementById('p1-selected-display');
const p2Display = document.getElementById('p2-selected-display');

let p1Char = 'X';
let p2Char = 'O';
let p2Turn;
let p1Score = 0;
let p2Score = 0;

// --- Harf grid'lerini oluştur ---
function buildGrid(gridEl, player) {
  gridEl.innerHTML = '';
  LETTERS.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.textContent = letter;
    if (player === 1 && letter === p1Char) btn.classList.add('active-p1');
    if (player === 2 && letter === p2Char) btn.classList.add('active-p2');
    btn.addEventListener('click', () => selectLetter(letter, player));
    gridEl.appendChild(btn);
  });
}

function selectLetter(letter, player) {
  if (player === 1) {
    p1Char = letter;
    p1Display.textContent = letter;
  } else {
    p2Char = letter;
    p2Display.textContent = letter;
  }
  // İki grid'i de yeniden çiz (çakışma vurgulama için)
  buildGrid(p1Grid, 1);
  buildGrid(p2Grid, 2);
}

// --- İlk grid'leri oluştur ---
buildGrid(p1Grid, 1);
buildGrid(p2Grid, 2);

// --- Skor ---
updateScoreDisplay();

// --- Ekran geçişleri ---
startButton.addEventListener('click', () => {
  if (p1Char === p2Char) {
    alert('İki oyuncu aynı karakteri seçemez! Lütfen farklı bir harf seçin.');
    return;
  }
  p1Score = 0;
  p2Score = 0;
  updateScoreDisplay();
  setupScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  startGame();
});

backButton.addEventListener('click', () => {
  gameScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
});

restartButton.addEventListener('click', startGame);

// --- Oyun fonksiyonları ---
function getP1Char() { return p1Char; }
function getP2Char() { return p2Char; }

function startGame() {
  p2Turn = false;
  p1Label.innerText = getP1Char();
  p2Label.innerText = getP2Char();
  cellElements.forEach(cell => {
    cell.classList.remove(PLAYER1_CLASS, PLAYER2_CLASS);
    cell.innerText = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  updateStatus();
}

function updateStatus() {
  if (!isGameOver()) {
    gameStatus.innerText = `${p2Turn ? getP2Char() : getP1Char()} sırası`;
    if (p2Turn) {
      turnIndicator.style.background = '#ff8fbf';
      turnIndicator.style.boxShadow = '0 0 8px rgba(255, 143, 191, 0.6)';
    } else {
      turnIndicator.style.background = '#70e0ff';
      turnIndicator.style.boxShadow = '0 0 8px rgba(112, 224, 255, 0.6)';
    }
  }
}

function isGameOver() {
  return checkWin(PLAYER1_CLASS) || checkWin(PLAYER2_CLASS) || isDraw();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = p2Turn ? PLAYER2_CLASS : PLAYER1_CLASS;
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
    gameStatus.innerText = 'Berabere!';
  } else {
    gameStatus.innerText = `${p2Turn ? getP2Char() : getP1Char()} Kazandı! 🎉`;
    if (p2Turn) {
      p2Score++;
    } else {
      p1Score++;
    }
    updateScoreDisplay();
  }
  cellElements.forEach(cell => cell.removeEventListener('click', handleClick));
}

function updateScoreDisplay() {
  p1ScoreElement.innerText = p1Score;
  p2ScoreElement.innerText = p2Score;
}

function isDraw() {
  return [...cellElements].every(cell =>
    cell.classList.contains(PLAYER1_CLASS) || cell.classList.contains(PLAYER2_CLASS)
  );
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.innerText = currentClass === PLAYER1_CLASS ? getP1Char() : getP2Char();
}

function swapTurns() {
  p2Turn = !p2Turn;
  updateStatus();
}

function setBoardHoverClass() {
  board.classList.remove(PLAYER1_CLASS, PLAYER2_CLASS);
  if (p2Turn) {
    board.classList.add(PLAYER2_CLASS);
    board.style.setProperty('--hover-char', `"${getP2Char()}"`);
  } else {
    board.classList.add(PLAYER1_CLASS);
    board.style.setProperty('--hover-char', `"${getP1Char()}"`);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => cellElements[index].classList.contains(currentClass))
  );
}