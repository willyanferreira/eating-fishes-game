const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const scoreDisplay = document.getElementById('score');

    let posX = 300;
    let posY = 200;
    let playerSize = 50;
    let step = 10;
    let score = 0;
    let eatenCount = 0;
    let gameOver = false;

    player.style.width = playerSize + 'px';
    player.style.height = playerSize + 'px';
    player.style.top = posY + 'px';
    player.style.left = posX + 'px';

    // Movimento do jogador
    document.addEventListener('keydown', (e) => {
      if (gameOver) return;

      const maxX = gameArea.clientWidth - playerSize;
      const maxY = gameArea.clientHeight - playerSize;

      if (e.key === 'ArrowUp' && posY > 0) posY -= step;
      else if (e.key === 'ArrowDown' && posY < maxY) posY += step;
      else if (e.key === 'ArrowLeft' && posX > 0) posX -= step;
      else if (e.key === 'ArrowRight' && posX < maxX) posX += step;

      updatePlayerPosition();
    });

    function updatePlayerPosition() {
      player.style.top = posY + 'px';
      player.style.left = posX + 'px';
    }

    // Função para criar inimigos
    function createEnemy() {
      if (gameOver) return;

      const enemy = document.createElement('div');
      enemy.classList.add('enemy');

      const size = Math.floor(Math.random() * 80) + 20; // 20 a 100 px
      enemy.style.width = size + 'px';
      enemy.style.height = size + 'px';
      enemy.dataset.size = size;

      // Escolher lado de origem: esquerda ou direita
      const fromLeft = Math.random() < 0.5;
      const startY = Math.random() * (gameArea.clientHeight - size);
      const startX = fromLeft ? -size : gameArea.clientWidth;
      const color = hsl(${Math.random() * 360}, 70%, 60%);

      enemy.style.top = startY + 'px';
      enemy.style.left = startX + 'px';
      enemy.style.backgroundColor = color;
      gameArea.appendChild(enemy);

      const speed = 1 + Math.random() * 1; // Velocidade lenta (1 a 2 px/frame)

      const moveInterval = setInterval(() => {
        if (gameOver) {
          clearInterval(moveInterval);
          if (enemy.parentNode) gameArea.removeChild(enemy);
          return;
        }

        let currentX = parseFloat(enemy.style.left);
        if (fromLeft) currentX += speed;
        else currentX -= speed;
        enemy.style.left = currentX + 'px';

        // Remove ao sair da tela
        if (fromLeft && currentX > gameArea.clientWidth || !fromLeft && currentX < -size) {
          clearInterval(moveInterval);
          if (enemy.parentNode) gameArea.removeChild(enemy);
        }

        // Checar colisão com jogador
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (isColliding(playerRect, enemyRect)) {
          const enemySize = parseInt(enemy.dataset.size);

          if (enemySize > playerSize) {
            endGame();
          } else {
            // Engole inimigo
            score++;
            eatenCount++;
            scoreDisplay.textContent = Pontos: ${score};
            if (enemy.parentNode) gameArea.removeChild(enemy);
            clearInterval(moveInterval);

            // Aumentar tamanho a cada 5 inimigos comidos
            if (eatenCount % 5 === 0) {
              playerSize += 10;
              player.style.width = playerSize + 'px';
              player.style.height = playerSize + 'px';
            }
          }
        }
      }, 15); // taxa de atualização ~60fps
    }

    // Verificar colisão
    function isColliding(rect1, rect2) {
      return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
      );
    }

    // Fim do jogo
    function endGame() {
      gameOver = true;
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');
      overlay.innerText = 'GAME OVER';
      gameArea.appendChild(overlay);
    }

    // Criar inimigos de forma contínua
    setInterval(() => {
      if (!gameOver) createEnemy();
    }, 1500); // a cada 1.5s cria um novo
