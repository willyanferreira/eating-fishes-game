// ===== Variáveis principais =====
const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const livesDisplay = document.getElementById('lives');
const sizeDisplay = document.getElementById('size');
const message = document.getElementById('message');

let playerSize = 30;
let playerSpeed = 5;
let lives = 3;
let enemies = [];
let keys = {};
let gameInterval;
let spawnInterval;

// ===== Posição inicial do jogador =====
let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

// ===== Eventos de teclado =====
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// ===== Atualização do HUD =====
function updateHUD() {
  livesDisplay.textContent = `❤️ Vidas: ${lives}`;
  sizeDisplay.textContent = `📏 Tamanho: ${playerSize}`;
}

// ===== Movimento do jogador =====
function movePlayer() {
  if (keys['ArrowUp'] && playerY > 0) playerY -= playerSpeed;
  if (keys['ArrowDown'] && playerY < window.innerHeight - playerSize) playerY += playerSpeed;
  if (keys['ArrowLeft'] && playerX > 0) playerX -= playerSpeed;
  if (keys['ArrowRight'] && playerX < window.innerWidth - playerSize) playerX += playerSpeed;
  player.style.left = playerX + 'px';
  player.style.top = playerY + 'px';
  player.style.width = playerSize + 'px';
  player.style.height = playerSize + 'px';
}

// ===== Criação de peixes inimigos =====
function createEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');

  const size = Math.random() * 60 + 20;
  enemy.dataset.size = size;
  enemy.style.width = size + 'px';
  enemy.style.height = size + 'px';

  const fromLeft = Math.random() < 0.5;
  const y = Math.random() * (window.innerHeight - size);
  enemy.style.top = y + 'px';
  enemy.style.left = fromLeft ? '-60px' : window.innerWidth + '60px';
  enemy.dataset.direction = fromLeft ? 1 : -1;

  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

// ===== Movimento dos inimigos =====
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    const dir = parseFloat(enemy.dataset.direction);
    const size = parseFloat(enemy.dataset.size);
    let x = parseFloat(enemy.style.left);
    x += dir * 2; // velocidade
    enemy.style.left = x + 'px';

    // Remover se sair da tela
    if (x < -100 || x > window.innerWidth + 100) {
      enemy.remove();
      enemies.splice(index, 1);
    }

    // Checar colisão
    checkCollision(enemy, size, index);
  });
}

// ===== Detecção de colisão =====
function checkCollision(enemy, size, index) {
  const eRect = enemy.getBoundingClientRect();
  const pRect = player.getBoundingClientRect();

  if (
    pRect.left < eRect.right &&
    pRect.right > eRect.left &&
    pRect.top < eRect.bottom &&
    pRect.bottom > eRect.top
  ) {
    if (playerSize >= size) {
      // Engolir peixe
      enemy.remove();
      enemies.splice(index, 1);
      playerSize += 3;
      updateHUD();
      if (playerSize >= 300) {
        endGame(true);
      }
    } else {
      // Perde vida
      enemy.remove();
      enemies.splice(index, 1);
      lives--;
      updateHUD();
      if (lives <= 0) {
        endGame(false);
      }
    }
  }
}

// ===== Bolhas decorativas =====
function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  const size = Math.random() * 10 + 5;
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  bubble.style.left = Math.random() * window.innerWidth + 'px';
  bubble.style.animationDuration = (Math.random() * 5 + 3) + 's';
  gameContainer.appendChild(bubble);

  setTimeout(() => bubble.remove(), 8000);
}

// ===== Loop principal =====
function gameLoop() {
  movePlayer();
  moveEnemies();
}

// ===== Fim de jogo =====
function endGame(victory) {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  message.style.display = 'block';
  message.textContent = victory ? '🏆 You Win!' : '💀 Game Over';

  setTimeout(() => {
    const again = confirm('Jogar novamente?');
    if (again) location.reload();
  }, 1000);
}

// ===== Inicialização =====
function startGame() {
  updateHUD();
  player.style.left = playerX + 'px';
  player.style.top = playerY + 'px';

  gameInterval = setInterval(gameLoop, 30);
  spawnInterval = setInterval(createEnemy, 1500);
  setInterval(createBubble, 1000);
}

startGame();
