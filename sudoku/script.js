// 遊戲變數
let timer;
let seconds = 0;
let minutes = 0;
let errors = 0;
let gameActive = false;

// 當前選中的單元格
let selectedCell = null;

// 數獨板
let board = [];
let solution = [];
let difficulty = 'easy';

// 主題設置
let currentTheme = localStorage.getItem('sudoku-theme') || 'light';

// 難度設定 (空格數量)
const difficultySettings = {
    easy: {
        cellsToRemove: 30,    // 30個空格
        color: '#28a745',     // 綠色
        description: '適合初學者'
    },
    medium: {
        cellsToRemove: 40,    // 40個空格
        color: '#ffc107',     // 黃色
        description: '適合一般玩家'
    },
    hard: {
        cellsToRemove: 50,    // 50個空格
        color: '#dc3545',     // 紅色
        description: '適合進階玩家'
    }
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主題
    applyTheme(currentTheme);
    document.querySelectorAll('.btn-theme').forEach(btn => {
        if(btn.dataset.theme === currentTheme) {
            btn.classList.add('active');
        }
    });
    
    // 初始化語言
    const savedLanguage = localStorage.getItem('sudoku-language') || 'en-US';
    const supportedLanguages = ['zh-TW', 'zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'th-TH'];
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        sudokuLanguage.setLanguage(savedLanguage);
        document.querySelectorAll('.btn-language').forEach(btn => {
            if(btn.dataset.language === savedLanguage) {
                btn.classList.add('active');
            }
        });
    } else {
        sudokuLanguage.setLanguage('en-US');
        document.querySelector('[data-language="en-US"]').classList.add('active');
    }
    
    // 初始化數獨板
    createBoard();
    
    // 設置難度按鈕事件
    document.querySelectorAll('.btn-difficulty').forEach(button => {
        button.addEventListener('click', () => {
            const newDifficulty = button.dataset.difficulty;
            
            // 如果正在遊戲中，顯示確認提示
            if (gameActive) {
                if (confirm(`確定要切換到${newDifficulty}難度嗎？當前遊戲進度將會丟失。`)) {
                    changeDifficulty(newDifficulty);
                }
            } else {
                changeDifficulty(newDifficulty);
            }
        });
    });
    
    // 設置默認難度
    document.querySelector('[data-difficulty="easy"]').classList.add('active');
    
    // 設置數字按鈕事件
    document.querySelectorAll('.btn-number').forEach(button => {
        button.addEventListener('click', () => {
            if (selectedCell && !selectedCell.classList.contains('given') && gameActive) {
                const number = button.dataset.number;
                if (number === '0') {
                    // 清除按鈕
                    selectedCell.textContent = '';
                    selectedCell.classList.remove('correct', 'incorrect');
                } else {
                    // 填入數字
                    selectedCell.textContent = number;
                    
                    // 檢查是否正確
                    const row = parseInt(selectedCell.dataset.row);
                    const col = parseInt(selectedCell.dataset.col);
                    if (number == solution[row][col]) {
                        selectedCell.classList.remove('incorrect');
                        selectedCell.classList.add('correct');
                    } else {
                        selectedCell.classList.remove('correct');
                        selectedCell.classList.add('incorrect');
                        errors++;
                        document.getElementById('error-count').textContent = errors;
                    }
                    
                    // 檢查遊戲是否完成
                    checkGameComplete();
                }
            }
        });
    });
    
    // 設置控制按鈕事件
    document.getElementById('new-game').addEventListener('click', startNewGame);
    document.getElementById('check').addEventListener('click', checkBoard);
    document.getElementById('hint').addEventListener('click', giveHint);
    document.getElementById('solve').addEventListener('click', solveBoard);
    
    // 設置主題切換事件
    document.querySelectorAll('.btn-theme').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.btn-theme').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const theme = button.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('sudoku-theme', theme);
        });
    });
    
    // 設置語言切換事件
    document.querySelectorAll('.btn-language').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.btn-language').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const lang = button.dataset.language;
            sudokuLanguage.setLanguage(lang);
        });
    });
    
    // 開始新遊戲
    startNewGame();
});

// 創建數獨板
function createBoard() {
    const boardElement = document.getElementById('sudoku-board');
    boardElement.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            cell.addEventListener('click', () => {
                if (gameActive) {
                    // 移除之前選中的單元格
                    if (selectedCell) {
                        selectedCell.classList.remove('selected');
                    }
                    
                    // 選中當前單元格
                    cell.classList.add('selected');
                    selectedCell = cell;
                }
            });
            
            boardElement.appendChild(cell);
        }
    }
}

// 開始新遊戲
function startNewGame() {
    // 重置遊戲狀態
    resetGame();
    
    // 生成新的數獨謎題
    generateSudoku();
    
    // 顯示數獨謎題
    displayBoard();
    
    // 開始計時器
    startTimer();
    
    // 設置遊戲為活動狀態
    gameActive = true;
}

// 重置遊戲
function resetGame() {
    // 停止計時器
    if (timer) {
        clearInterval(timer);
    }
    
    // 重置時間
    seconds = 0;
    minutes = 0;
    document.getElementById('seconds').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    
    // 重置錯誤計數
    errors = 0;
    document.getElementById('error-count').textContent = '0';
    
    // 清除選中的單元格
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
    
    // 重置遊戲狀態
    gameActive = false;
}

// 開始計時器
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        
        document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
        document.getElementById('minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
    }, 1000);
}

// 生成數獨謎題
function generateSudoku() {
    // 初始化空板
    board = Array(9).fill().map(() => Array(9).fill(0));
    solution = Array(9).fill().map(() => Array(9).fill(0));
    
    // 生成解答
    generateSolution(0, 0);
    
    // 複製解答到當前板
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = solution[i][j];
        }
    }
    
    // 根據難度移除數字
    const cellsToRemove = difficultySettings[difficulty].cellsToRemove;
    removeNumbers(cellsToRemove);
}

// 生成數獨解答 (使用回溯法)
function generateSolution(row, col) {
    // 如果已經填滿，返回true
    if (row === 9) {
        return true;
    }
    
    // 如果當前列已填滿，移至下一行
    if (col === 9) {
        return generateSolution(row + 1, 0);
    }
    
    // 嘗試填入1-9
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (let num of numbers) {
        if (isValid(row, col, num)) {
            solution[row][col] = num;
            
            // 遞歸填入下一個單元格
            if (generateSolution(row, col + 1)) {
                return true;
            }
            
            // 如果無法完成，回溯
            solution[row][col] = 0;
        }
    }
    
    return false;
}

// 檢查數字是否有效
function isValid(row, col, num) {
    // 檢查行
    for (let i = 0; i < 9; i++) {
        if (solution[row][i] === num) {
            return false;
        }
    }
    
    // 檢查列
    for (let i = 0; i < 9; i++) {
        if (solution[i][col] === num) {
            return false;
        }
    }
    
    // 檢查3x3方格
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (solution[boxRow + i][boxCol + j] === num) {
                return false;
            }
        }
    }
    
    return true;
}

// 打亂數組
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 移除數字以創建謎題
function removeNumbers(count) {
    const positions = [];
    
    // 創建所有位置的數組
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            positions.push([i, j]);
        }
    }
    
    // 打亂位置
    shuffleArray(positions);
    
    // 移除指定數量的數字
    for (let i = 0; i < count && i < positions.length; i++) {
        const [row, col] = positions[i];
        board[row][col] = 0;
    }
}

// 顯示數獨板
function displayBoard() {
    const cells = document.querySelectorAll('.cell');
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const index = i * 9 + j;
            const cell = cells[index];
            
            // 清除之前的類
            cell.classList.remove('given', 'correct', 'incorrect');
            
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.classList.add('given');
            } else {
                cell.textContent = '';
            }
        }
    }
}

// 檢查數獨板
function checkBoard() {
    if (!gameActive) return;
    
    const cells = document.querySelectorAll('.cell');
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const index = i * 9 + j;
            const cell = cells[index];
            
            if (!cell.classList.contains('given') && cell.textContent) {
                if (cell.textContent == solution[i][j]) {
                    cell.classList.remove('incorrect');
                    cell.classList.add('correct');
                } else {
                    cell.classList.remove('correct');
                    cell.classList.add('incorrect');
                }
            }
        }
    }
}

// 提供提示
function giveHint() {
    if (!gameActive || !selectedCell) return;
    
    if (!selectedCell.classList.contains('given')) {
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        
        selectedCell.textContent = solution[row][col];
        selectedCell.classList.remove('incorrect');
        selectedCell.classList.add('correct');
        
        // 檢查遊戲是否完成
        checkGameComplete();
    }
}

// 解答數獨
function solveBoard() {
    if (!gameActive) return;
    
    const cells = document.querySelectorAll('.cell');
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const index = i * 9 + j;
            const cell = cells[index];
            
            if (!cell.classList.contains('given')) {
                cell.textContent = solution[i][j];
                cell.classList.remove('incorrect');
                cell.classList.add('correct');
            }
        }
    }
    
    // 遊戲結束
    endGame(false);
}

// 檢查遊戲是否完成
function checkGameComplete() {
    if (!gameActive) return;
    
    const cells = document.querySelectorAll('.cell');
    let complete = true;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const index = i * 9 + j;
            const cell = cells[index];
            
            // 如果有空格或錯誤，遊戲未完成
            if (!cell.textContent || cell.classList.contains('incorrect')) {
                complete = false;
                break;
            }
        }
        if (!complete) break;
    }
    
    if (complete) {
        endGame(true);
    }
}

// 結束遊戲
function endGame(won) {
    // 停止計時器
    clearInterval(timer);
    gameActive = false;
    
    // 創建遊戲完成彈窗
    const gameComplete = document.createElement('div');
    gameComplete.classList.add('game-complete');
    
    const content = document.createElement('div');
    content.classList.add('game-complete-content');
    
    const title = document.createElement('h2');
    title.textContent = won ? sudokuLanguage.getText('congratulations') : sudokuLanguage.getText('gameOver');
    
    const message = document.createElement('p');
    message.textContent = won ? 
        sudokuLanguage.getText('completedMessage', {difficulty: sudokuLanguage.getText(difficulty), minutes, seconds, errors}) : 
        sudokuLanguage.getText('solvedMessage');
    
    const button = document.createElement('button');
    button.textContent = sudokuLanguage.getText('playAgain');
    button.addEventListener('click', () => {
        document.body.removeChild(gameComplete);
        startNewGame();
    });
    
    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(button);
    gameComplete.appendChild(content);
    
    document.body.appendChild(gameComplete);
    gameComplete.style.display = 'flex';
}

// 應用主題
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    currentTheme = theme;
}

// 切換難度
function changeDifficulty(newDifficulty) {
    // 更新按鈕樣式
    document.querySelectorAll('.btn-difficulty').forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
    });
    
    const activeButton = document.querySelector(`[data-difficulty="${newDifficulty}"]`);
    activeButton.classList.add('active');
    activeButton.style.backgroundColor = difficultySettings[newDifficulty].color;
    
    // 更新難度
    difficulty = newDifficulty;
    
    // 重新開始遊戲
    startNewGame();
    
    // 顯示難度提示
    showDifficultyMessage(newDifficulty);
}

// 顯示難度提示
function showDifficultyMessage(difficulty) {
    const message = document.createElement('div');
    message.className = 'difficulty-message';
    message.style.backgroundColor = difficultySettings[difficulty].color;
    message.textContent = difficultySettings[difficulty].description;
    
    document.body.appendChild(message);
    
    // 添加動畫效果
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 500);
    }, 2000);
}