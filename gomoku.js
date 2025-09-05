// 五子棋游戏核心逻辑

// 获取DOM元素
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const gameMessage = document.getElementById('game-message');
const playerBlack = document.getElementById('player-black');
const playerWhite = document.getElementById('player-white');
const restartBtn = document.getElementById('restart-btn');
const undoBtn = document.getElementById('undo-btn');

// 游戏常量
const BOARD_SIZE = 15; // 15x15的棋盘
const CELL_SIZE = canvas.width / (BOARD_SIZE - 1); // 计算每个格子的大小
const PIECE_SIZE = CELL_SIZE * 0.8; // 棋子大小

// 游戏变量
let gameBoard = []; // 棋盘状态 0:空 1:黑 2:白
let currentPlayer = 1; // 当前玩家 1:黑 2:白
let gameActive = true; // 游戏是否活跃
let gameHistory = []; // 游戏历史记录，用于悔棋
let lastMove = null; // 上一步落子位置

// 初始化游戏
function initGame() {
    // 重置棋盘
    gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    gameActive = true;
    currentPlayer = 1;
    gameHistory = [];
    lastMove = null;
    
    // 更新UI
    updatePlayerIndicator();
    gameMessage.textContent = '游戏开始，请黑方落子';
    gameMessage.classList.remove('winner');
    
    // 绘制棋盘
    drawBoard();
}

// 绘制棋盘
function drawBoard() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置线条颜色
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1;
    
    // 绘制棋盘格线
    for (let i = 0; i < BOARD_SIZE; i++) {
        // 横线
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
        
        // 竖线
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
    
    // 绘制五个天元和星位
    const starPoints = [
        { x: 3, y: 3 },
        { x: 3, y: 11 },
        { x: 7, y: 7 },
        { x: 11, y: 3 },
        { x: 11, y: 11 }
    ];
    
    ctx.fillStyle = '#8B4513';
    starPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x * CELL_SIZE, point.y * CELL_SIZE, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 绘制已下的棋子
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (gameBoard[i][j] !== 0) {
                drawPiece(i, j, gameBoard[i][j]);
            }
        }
    }
}

// 绘制棋子
function drawPiece(x, y, player) {
    const centerX = x * CELL_SIZE;
    const centerY = y * CELL_SIZE;
    
    // 绘制棋子阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    // 绘制棋子主体
    ctx.beginPath();
    ctx.arc(centerX, centerY, PIECE_SIZE / 2, 0, Math.PI * 2);
    ctx.fillStyle = player === 1 ? '#000' : '#fff';
    ctx.fill();
    
    // 绘制棋子边框
    ctx.strokeStyle = player === 1 ? '#333' : '#ccc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 绘制高光（只对白棋）
    if (player === 2) {
        ctx.beginPath();
        ctx.arc(centerX - PIECE_SIZE / 6, centerY - PIECE_SIZE / 6, PIECE_SIZE / 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    }
    
    // 重置阴影效果
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

// 处理棋盘点击事件
function handleBoardClick(event) {
    if (!gameActive) return;
    
    // 获取鼠标点击位置
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // 计算点击的格子坐标
    let gridX = Math.round(clickX / CELL_SIZE);
    let gridY = Math.round(clickY / CELL_SIZE);
    
    // 检查坐标是否在棋盘范围内
    if (gridX < 0 || gridX >= BOARD_SIZE || gridY < 0 || gridY >= BOARD_SIZE) {
        return;
    }
    
    // 检查该位置是否已有棋子
    if (gameBoard[gridX][gridY] !== 0) {
        return;
    }
    
    // 落子
    placePiece(gridX, gridY);
}

// 落子
function placePiece(x, y) {
    // 记录历史记录
    gameHistory.push({
        board: JSON.parse(JSON.stringify(gameBoard)),
        player: currentPlayer
    });
    
    // 更新棋盘
    gameBoard[x][y] = currentPlayer;
    lastMove = { x, y };
    
    // 绘制棋子
    drawPiece(x, y, currentPlayer);
    
    // 检查胜负
    if (checkWin(x, y)) {
        gameActive = false;
        const winner = currentPlayer === 1 ? '黑方' : '白方';
        gameMessage.textContent = `${winner}获胜！`;
        gameMessage.classList.add('winner');
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerIndicator();
    
    // 更新游戏信息
    const playerText = currentPlayer === 1 ? '黑方' : '白方';
    gameMessage.textContent = `${playerText}回合`;
}

// 检查胜负
function checkWin(x, y) {
    const directions = [
        [1, 0],  // 水平
        [0, 1],  // 垂直
        [1, 1],  // 右下对角线
        [1, -1]  // 右上对角线
    ];
    
    const player = gameBoard[x][y];
    
    for (let [dx, dy] of directions) {
        let count = 1; // 当前位置已经有一个棋子
        
        // 正方向检查
        for (let i = 1; i < 5; i++) {
            const nx = x + dx * i;
            const ny = y + dy * i;
            
            if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE || gameBoard[nx][ny] !== player) {
                break;
            }
            count++;
        }
        
        // 反方向检查
        for (let i = 1; i < 5; i++) {
            const nx = x - dx * i;
            const ny = y - dy * i;
            
            if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE || gameBoard[nx][ny] !== player) {
                break;
            }
            count++;
        }
        
        // 如果连成五子，返回true
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 更新玩家指示器
function updatePlayerIndicator() {
    if (currentPlayer === 1) {
        playerBlack.classList.add('current');
        playerWhite.classList.remove('current');
    } else {
        playerWhite.classList.add('current');
        playerBlack.classList.remove('current');
    }
}

// 悔棋功能
function undoMove() {
    if (!gameHistory.length || !gameActive) {
        return;
    }
    
    // 恢复上一步的棋盘状态
    const lastState = gameHistory.pop();
    gameBoard = lastState.board;
    currentPlayer = lastState.player;
    lastMove = null;
    
    // 更新UI
    updatePlayerIndicator();
    gameMessage.textContent = `${currentPlayer === 1 ? '黑方' : '白方'}回合`;
    
    // 重新绘制棋盘
    drawBoard();
}

// 重新开始游戏
function restartGame() {
    // 显示确认对话框
    if (confirm('确定要重新开始游戏吗？')) {
        initGame();
    }
}

// 添加事件监听器
canvas.addEventListener('click', handleBoardClick);
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoMove);

// 窗口大小变化时重新绘制棋盘
window.addEventListener('resize', function() {
    // 保持画布尺寸不变
    canvas.width = 600;
    canvas.height = 600;
    drawBoard();
});

// 初始化游戏
initGame();