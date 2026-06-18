// Game State
const gameState = {
    currentScreen: 'home',
    gameMode: 'classic',
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    currentQuestionIndex: 0,
    answered: false,
    timeLeft: 30
};

// Trivia Questions Database
const triviaQuestions = [
    {
        question: "Which country won the first FIFA World Cup?",
        options: ["Brazil", "Uruguay", "Germany", "Italy"],
        correct: 1,
        category: "History"
    },
    {
        question: "How many times has Brazil won the World Cup?",
        options: ["3 times", "4 times", "5 times", "6 times"],
        correct: 2,
        category: "History"
    },
    {
        question: "Which player has won the most Ballon d'Or awards?",
        options: ["Pelé", "Diego Maradona", "Cristiano Ronaldo", "Lionel Messi"],
        correct: 3,
        category: "Players"
    },
    {
        question: "In which year was the first World Cup held?",
        options: ["1920", "1930", "1950", "1970"],
        correct: 1,
        category: "History"
    },
    {
        question: "Which country hosted the 2014 World Cup?",
        options: ["South Africa", "Germany", "Brazil", "Russia"],
        correct: 2,
        category: "History"
    },
    {
        question: "Who is the all-time leading goal scorer in World Cup history?",
        options: ["Pelé", "Cristiano Ronaldo", "Miroslav Klose", "Gerd Müller"],
        correct: 2,
        category: "Players"
    },
    {
        question: "How many players are on a soccer team on the field?",
        options: ["9 players", "10 players", "11 players", "12 players"],
        correct: 2,
        category: "Rules"
    },
    {
        question: "Which country won the 2018 World Cup?",
        options: ["Germany", "Brazil", "France", "Belgium"],
        correct: 2,
        category: "History"
    },
    {
        question: "What is the maximum number of substitutes allowed in a World Cup match?",
        options: ["2 substitutes", "3 substitutes", "5 substitutes", "7 substitutes"],
        correct: 1,
        category: "Rules"
    },
    {
        question: "Which country has hosted the World Cup the most times?",
        options: ["Germany", "Brazil", "France", "Mexico"],
        correct: 2,
        category: "History"
    },
    {
        question: "How long is each half of a soccer match?",
        options: ["30 minutes", "35 minutes", "45 minutes", "50 minutes"],
        correct: 2,
        category: "Rules"
    },
    {
        question: "Which player won the Golden Ball (Best Player) at the 2022 World Cup?",
        options: ["Kylian Mbappé", "Lionel Messi", "Gianluigi Donnarumma", "Harry Kane"],
        correct: 1,
        category: "Players"
    },
    {
        question: "What happens if a player receives two yellow cards in a match?",
        options: ["Free kick", "Red card", "Penalty kick", "Corner kick"],
        correct: 1,
        category: "Rules"
    },
    {
        question: "Which country won the 2022 FIFA World Cup?",
        options: ["Argentina", "France", "Brazil", "Netherlands"],
        correct: 0,
        category: "History"
    },
    {
        question: "How many teams participate in the FIFA World Cup group stage?",
        options: ["24 teams", "28 teams", "32 teams", "36 teams"],
        correct: 2,
        category: "History"
    },
    {
        question: "Which country is famous for their 'Tiki-Taka' playing style?",
        options: ["Germany", "Spain", "Italy", "Netherlands"],
        correct: 1,
        category: "Teams"
    },
    {
        question: "What is the diameter of a soccer ball?",
        options: ["20-22 cm", "22-24 cm", "24-26 cm", "26-28 cm"],
        correct: 1,
        category: "Rules"
    },
    {
        question: "Which player is known as 'The King of Football'?",
        options: ["Diego Maradona", "Pelé", "Ronaldinho", "Zinedine Zidane"],
        correct: 1,
        category: "Players"
    },
    {
        question: "How many times has Germany won the World Cup?",
        options: ["2 times", "3 times", "4 times", "5 times"],
        correct: 2,
        category: "History"
    },
    {
        question: "What does a red card mean in soccer?",
        options: ["Warning", "Direct ejection from match", "Penalty kick", "Yellow card"],
        correct: 1,
        category: "Rules"
    }
];

// Initialize Leaderboard
function initLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('wcTrivia_leaderboard')) || [];
    displayLeaderboard(leaderboard);
}

// Update Leaderboard
function updateLeaderboard(score) {
    let leaderboard = JSON.parse(localStorage.getItem('wcTrivia_leaderboard')) || [];
    leaderboard.push({
        name: `Player ${leaderboard.length + 1}`,
        score: score,
        date: new Date().toLocaleDateString()
    });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem('wcTrivia_leaderboard', JSON.stringify(leaderboard));
    return leaderboard;
}

// Display Leaderboard
function displayLeaderboard(leaderboard) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p style="color: #999; padding: 20px;">No scores yet! Be the first! 🎯</p>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <div class="leaderboard-rank">${index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</div>
            <div class="leaderboard-name">${entry.name}</div>
            <div class="leaderboard-score">${entry.score} pts</div>
        `;
        leaderboardList.appendChild(item);
    });
}

// Start Game
function startGame(mode) {
    gameState.gameMode = mode;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.correctAnswers = 0;
    gameState.totalQuestions = mode === 'speed' ? 10 : mode === 'legendary' ? 20 : 15;
    gameState.currentQuestionIndex = 0;
    gameState.answered = false;

    switchScreen('game-screen');
    loadQuestion();
}

// Load Question
function loadQuestion() {
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
        endGame();
        return;
    }

    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
    const question = triviaQuestions[randomIndex];
    
    gameState.answered = false;
    gameState.timeLeft = gameState.gameMode === 'speed' ? 20 : 30;

    // Update Progress
    const progress = ((gameState.currentQuestionIndex) / gameState.totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';

    // Display Question
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('question-info').textContent = `Question ${gameState.currentQuestionIndex + 1} of ${gameState.totalQuestions} • ${question.category}`;

    // Display Answers
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index, question.correct);
        answersContainer.appendChild(btn);
    });

    // Show Timer for Speed Mode
    const timerContainer = document.getElementById('timer-container');
    if (gameState.gameMode === 'speed') {
        timerContainer.style.display = 'flex';
        startTimer();
    } else {
        timerContainer.style.display = 'none';
    }
}

// Select Answer
function selectAnswer(selectedIndex, correctIndex) {
    if (gameState.answered) return;
    gameState.answered = true;

    const answerBtns = document.querySelectorAll('.answer-btn');
    const isCorrect = selectedIndex === correctIndex;

    answerBtns.forEach((btn, index) => {
        btn.classList.add('disabled');
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    if (isCorrect) {
        gameState.score += gameState.gameMode === 'speed' ? 25 : gameState.gameMode === 'legendary' ? 20 : 10;
        gameState.streak++;
        gameState.correctAnswers++;
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        createConfetti();
        playSound('success');
    } else {
        gameState.streak = 0;
        playSound('error');
    }

    updateScore();
    
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

// Start Timer
function startTimer() {
    const timerText = document.getElementById('timer-text');
    const timerCircle = document.getElementById('timer-circle');
    
    const interval = setInterval(() => {
        gameState.timeLeft--;
        timerText.textContent = gameState.timeLeft;
        
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (gameState.timeLeft / (gameState.gameMode === 'speed' ? 20 : 30)) * circumference;
        timerCircle.style.strokeDashoffset = offset;

        if (gameState.timeLeft <= 0) {
            clearInterval(interval);
            if (!gameState.answered) {
                selectAnswer(-1, -2);
            }
        }
    }, 1000);
}

// Update Score Display
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('streak').textContent = gameState.streak;
}

// End Game
function endGame() {
    const leaderboard = updateLeaderboard(gameState.score);
    
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-streak').textContent = gameState.bestStreak;
    document.getElementById('final-correct').textContent = `${gameState.correctAnswers}/${gameState.totalQuestions}`;

    // Display Achievements
    const achievementSection = document.getElementById('achievement-section');
    achievementSection.innerHTML = '';
    
    const achievements = getAchievements();
    if (achievements.length > 0) {
        achievementSection.innerHTML = '<h3>🏅 Achievements Unlocked!</h3>';
        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.textContent = achievement;
            achievementSection.appendChild(badge);
        });
    }

    // Update Results Title
    const percentage = (gameState.correctAnswers / gameState.totalQuestions) * 100;
    let title = 'Game Over!';
    if (percentage === 100) {
        title = '🎉 PERFECT SCORE! 🎉';
    } else if (percentage >= 80) {
        title = '🌟 Excellent! 🌟';
    } else if (percentage >= 60) {
        title = '👍 Good Job! 👍';
    } else if (percentage >= 40) {
        title = '💪 Keep Trying! 💪';
    }
    document.getElementById('results-title').textContent = title;

    switchScreen('results-screen');
}

// Get Achievements
function getAchievements() {
    const achievements = [];
    
    if (gameState.correctAnswers === gameState.totalQuestions) {
        achievements.push('🎯 Perfect Score!');
    }
    if (gameState.bestStreak >= 5) {
        achievements.push('🔥 On Fire!');
    }
    if (gameState.score >= 200) {
        achievements.push('💰 High Scorer!');
    }
    if (gameState.gameMode === 'legendary' && gameState.correctAnswers >= 15) {
        achievements.push('👑 Legendary Master!');
    }
    if (gameState.bestStreak >= 10) {
        achievements.push('⚡ Unstoppable!');
    }
    
    return achievements;
}

// Switch Screen
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenId;
}

// Go Home
function goHome() {
    switchScreen('home-screen');
    initLeaderboard();
}

// Quit Game
function quitGame() {
    if (confirm('Are you sure you want to quit? Your progress will be lost!')) {
        goHome();
    }
}

// Create Confetti
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = ['#1e40af', '#dc2626', '#059669', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        
        container.appendChild(confetti);
        
        const duration = Math.random() * 2 + 2;
        const xMove = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { 
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight + 10}px) translateX(${xMove}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Play Sound
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    if (type === 'success') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'error') {
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Initialize
window.addEventListener('load', () => {
    initLeaderboard();
});
