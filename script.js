const cells = document.querySelectorAll('.cell');
const message = document.getElementById('game-message');
const resetButton = document.getElementById('reset');
const gameModeSelect = document.getElementById('gameMode');
const timerDisplay = document.getElementById('time');
const timerContainer = document.getElementById('timer');

let gameState = Array(9).fill(null);
let currentPlayer = 'X';
let gameMode = 'player';  
let timer;
let timeLeft = 20;


const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]             
];


function checkGameState() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return gameState[a];
    }
  }
  return gameState.includes(null) ? null : 'Tie';
}


function handlePlayerMove(index) {
  if (!gameState[index]) {
    gameState[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add('taken');

    const result = checkGameState();
    if (result) {
      message.textContent = result === 'Tie' ? 'It\'s a Tie!' : `Player ${result} Wins!`;
      endGame();
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      resetTimer(); 
      message.textContent = `Player ${currentPlayer}'s Turn`;
      if (gameMode === 'computer' && currentPlayer === 'O') {
        setTimeout(handleComputerMove, 500);
      }
    }
  }
}

function handleComputerMove() {
  const availableCells = gameState
    .map((value, index) => (value === null ? index : null))
    .filter(index => index !== null);

  const randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
  handlePlayerMove(randomMove);
}

function startTimer(seconds) {
  timeLeft = seconds;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      message.textContent = `Time's Up! Player ${currentPlayer} Loses!`;
      endGame();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);  
  if (gameMode === 'computer') {
    startTimer(20); 
  }
}

function resetGame() {
  clearInterval(timer); 
  gameState = Array(9).fill(null);
  currentPlayer = 'X';
  message.textContent = `Player X's Turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  cells.forEach((cell, index) => cell.addEventListener('click', () => handlePlayerMove(index)));

  if (gameMode === 'computer') {
    timerContainer.classList.remove('hidden');
    startTimer(20);  
  } else {
    timerContainer.classList.add('hidden');
  }
}

function endGame() {
  clearInterval(timer);
  cells.forEach(cell => cell.removeEventListener('click', () => {}));
}

function handleGameModeChange() {
  gameMode = gameModeSelect.value;
  resetGame();
}

cells.forEach((cell, index) => cell.addEventListener('click', () => handlePlayerMove(index)));
resetButton.addEventListener('click', resetGame);
gameModeSelect.addEventListener('change', handleGameModeChange);

resetGame();
