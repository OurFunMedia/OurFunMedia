// 多語言支持
const languages = {
    'zh-TW': {
        title: '數獨遊戲',
        difficulty: '選擇難度：',
        easy: '簡單',
        medium: '中等',
        hard: '困難',
        timer: '時間：',
        errors: '錯誤：',
        newGame: '新遊戲',
        check: '檢查',
        hint: '提示',
        solve: '解答',
        clear: '清除',
        congratulations: '恭喜！',
        gameOver: '遊戲結束',
        completedMessage: '你成功完成了{difficulty}難度的數獨！時間：{minutes}分{seconds}秒，錯誤：{errors}次',
        solvedMessage: '數獨已解答完成。',
        playAgain: '再玩一次',
        theme: '主題：',
        light: '☀️',
        dark: '🌙',
        language: '語言：',
        flagName: '🇹🇼'
    },
    'zh-CN': {
        title: '数独游戏',
        difficulty: '选择难度：',
        easy: '简单',
        medium: '中等',
        hard: '困难',
        timer: '时间：',
        errors: '错误：',
        newGame: '新游戏',
        check: '检查',
        hint: '提示',
        solve: '解答',
        clear: '清除',
        congratulations: '恭喜！',
        gameOver: '游戏结束',
        completedMessage: '你成功完成了{difficulty}难度的数独！时间：{minutes}分{seconds}秒，错误：{errors}次',
        solvedMessage: '数独已解答完成。',
        playAgain: '再玩一次',
        theme: '主题：',
        light: '☀️',
        dark: '🌙',
        language: '语言：',
        flagName: '🇨🇳'
    },
    'en-US': {
        title: 'Sudoku Game',
        difficulty: 'Select Difficulty:',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        timer: 'Time:',
        errors: 'Errors:',
        newGame: 'New Game',
        check: 'Check',
        hint: 'Hint',
        solve: 'Solve',
        clear: 'Clear',
        congratulations: 'Congratulations!',
        gameOver: 'Game Over',
        completedMessage: 'You completed the {difficulty} sudoku! Time: {minutes}m {seconds}s, Errors: {errors}',
        solvedMessage: 'Sudoku has been solved.',
        playAgain: 'Play Again',
        theme: 'Theme:',
        light: '☀️',
        dark: '🌙',
        language: 'Language:',
        flagName: '🇺🇸'
    },
    'ja-JP': {
        title: '数独ゲーム',
        difficulty: '難易度選択：',
        easy: '簡単',
        medium: '普通',
        hard: '難しい',
        timer: '時間：',
        errors: 'エラー：',
        newGame: '新しいゲーム',
        check: 'チェック',
        hint: 'ヒント',
        solve: '解答',
        clear: 'クリア',
        congratulations: 'おめでとう！',
        gameOver: 'ゲーム終了',
        completedMessage: '{difficulty}難易度の数独を完成しました！時間：{minutes}分{seconds}秒、エラー：{errors}回',
        solvedMessage: '数独が解答されました。',
        playAgain: 'もう一度プレイ',
        theme: 'テーマ：',
        light: '☀️',
        dark: '🌙',
        language: '言語：',
        flagName: '🇯🇵'
    },
    'ko-KR': {
        title: '스도쿠 게임',
        difficulty: '난이도 선택:',
        easy: '쉬움',
        medium: '보통',
        hard: '어려움',
        timer: '시간:',
        errors: '오류:',
        newGame: '새 게임',
        check: '확인',
        hint: '힌트',
        solve: '해결',
        clear: '지우기',
        congratulations: '축하합니다!',
        gameOver: '게임 종료',
        completedMessage: '{difficulty} 난이도의 스도쿠를 완료했습니다! 시간: {minutes}분 {seconds}초, 오류: {errors}회',
        solvedMessage: '스도쿠가 해결되었습니다.',
        playAgain: '다시 플레이',
        theme: '테마:',
        light: '☀️',
        dark: '🌙',
        language: '언어:',
        flagName: '🇰🇷'
    },
    'th-TH': {
        title: 'เกมซูโดกุ',
        difficulty: 'เลือกระดับความยาก:',
        easy: 'ง่าย',
        medium: 'ปานกลาง',
        hard: 'ยาก',
        timer: 'เวลา:',
        errors: 'ข้อผิดพลาด:',
        newGame: 'เกมใหม่',
        check: 'ตรวจสอบ',
        hint: 'คำใบ้',
        solve: 'เฉลย',
        clear: 'ล้าง',
        congratulations: 'ยินดีด้วย!',
        gameOver: 'จบเกม',
        completedMessage: 'คุณได้ทำซูโดกุระดับ {difficulty} สำเร็จ! เวลา: {minutes} นาที {seconds} วินาที, ข้อผิดพลาด: {errors} ครั้ง',
        solvedMessage: 'ซูโดกุได้รับการแก้ไขแล้ว',
        playAgain: 'เล่นอีกครั้ง',
        theme: 'ธีม:',
        light: '☀️',
        dark: '🌙',
        language: 'ภาษา:',
        flagName: '🇹🇭'
    }
};

// 默認語言
let currentLanguage = 'en-US';

// 獲取文本
function getText(key, replacements = {}) {
    let text = languages[currentLanguage][key] || languages['zh-TW'][key] || key;
    
    // 替換變量
    for (const [key, value] of Object.entries(replacements)) {
        text = text.replace(`{${key}}`, value);
    }
    
    return text;
}

// 更新頁面文本
function updatePageText() {
    // 更新標題
    document.title = getText('title');
    document.querySelector('h1').textContent = getText('title');
    
    // 更新難度選擇器
    document.querySelector('.difficulty-selector h5').textContent = getText('difficulty');
    document.querySelector('[data-difficulty="easy"]').textContent = getText('easy');
    document.querySelector('[data-difficulty="medium"]').textContent = getText('medium');
    document.querySelector('[data-difficulty="hard"]').textContent = getText('hard');
    
    // 更新遊戲信息
    document.querySelector('.timer').innerHTML = `${getText('timer')}<span id="minutes">00</span>:<span id="seconds">00</span>`;
    document.querySelector('.errors').innerHTML = `${getText('errors')}<span id="error-count">0</span>`;
    
    // 更新控制按鈕
    document.getElementById('new-game').textContent = getText('newGame');
    document.getElementById('check').textContent = getText('check');
    document.getElementById('hint').textContent = getText('hint');
    document.getElementById('solve').textContent = getText('solve');
    document.querySelector('.btn-erase').textContent = getText('clear');
    
    // 更新設置欄
    document.querySelector('.theme-selector span').textContent = getText('theme');
    document.querySelector('[data-theme="light"]').textContent = getText('light');
    document.querySelector('[data-theme="dark"]').textContent = getText('dark');
    document.querySelector('.language-selector span').textContent = getText('language');
    
    // 更新語言按鈕為國旗圖示
    document.querySelectorAll('.btn-language').forEach(btn => {
        const lang = btn.getAttribute('data-language');
        if (languages[lang] && languages[lang].flagName) {
            btn.textContent = languages[lang].flagName;
            // 設置title屬性以顯示語言名稱的提示
            switch(lang) {
                case 'zh-TW': btn.title = '繁體中文'; break;
                case 'zh-CN': btn.title = '简体中文'; break;
                case 'en-US': btn.title = 'English'; break;
                case 'ja-JP': btn.title = '日本語'; break;
                case 'ko-KR': btn.title = '한국어'; break;
                case 'th-TH': btn.title = 'ไทย'; break;
            }
        }
    });
}

// 設置語言
function setLanguage(lang) {
    if (languages[lang]) {
        currentLanguage = lang;
        updatePageText();
        localStorage.setItem('sudoku-language', lang);
    }
}

// 導出函數
window.sudokuLanguage = {
    getText,
    setLanguage,
    updatePageText
};