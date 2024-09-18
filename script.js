// Utility function to switch between pages
function transitionPage(fromPage, toPage) {
    document.getElementById(fromPage).style.display = 'none';
    document.getElementById(toPage).style.display = 'block';
}

// Signup functionality
document.getElementById('signup-button').addEventListener('click', function() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (name && email && password) {
        const signupData = { name, email, password };
        localStorage.setItem('userSignup', JSON.stringify(signupData));
        alert('Signup successful!');
        transitionPage('signup-page', 'login-page');
    } else {
        alert('Please fill all the fields');
    }
});

// Login functionality
document.getElementById('login-button').addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const storedSignup = JSON.parse(localStorage.getItem('userSignup'));

    if (storedSignup && storedSignup.email === email && storedSignup.password === password) {
        alert('Login successful!');
        transitionPage('login-page', 'chatbot-page');
        const workoutDietSuggestion = suggestWorkoutAndDiet();
        const botMessage = document.createElement('div');
        botMessage.classList.add('message', 'bot-message');
        botMessage.innerText = workoutDietSuggestion;
        document.getElementById('chat-box').appendChild(botMessage);
    } else {
        alert('Invalid email or password');
    }
});

// Personalized workout and diet suggestions
function suggestWorkoutAndDiet() {
    const userDetails = JSON.parse(localStorage.getItem('userSignup'));
    let workoutSuggestion = `Based on your sign-up details, ${userDetails.name}, here are some workout suggestions:`;

    workoutSuggestion += "\n- Strength training\n- HIIT\n- Cardio workouts";
    return workoutSuggestion;
}

// Chatbot message handling
document.getElementById('send-message').addEventListener('click', function() {
    const userMessage = document.getElementById('user-message').value;
    const chatBox = document.getElementById('chat-box');

    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'user-message');
    userMessageDiv.innerText = userMessage;
    chatBox.appendChild(userMessageDiv);

    const botReply = getBotReply(userMessage);
    const botMessageDiv = document.createElement('div');
    botMessageDiv.classList.add('message', 'bot-message');
    botMessageDiv.innerText = botReply;
    chatBox.appendChild(botMessageDiv);

    document.getElementById('user-message').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Bot reply function with NLP for fitness queries
function getBotReply(userMessage) {
    const responses = {
        greeting: ["Hello! How can I assist you today?", "Hi there! What can I help you with?"],
        workout: ["I can suggest some exercises. What are you looking for?", "Let me recommend some workouts based on your goals."],
        diet: ["I can help with diet tips. What are your dietary preferences?", "Looking for some diet suggestions? Let me know your goals."],
        challenge: ["I have some fitness challenges ready for you!", "Up for a new fitness challenge?"]
    };

    if (userMessage.toLowerCase().includes("hi") || userMessage.toLowerCase().includes("hello")) {
        return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (userMessage.toLowerCase().includes("workout") || userMessage.toLowerCase().includes("exercise")) {
        return responses.workout[Math.floor(Math.random() * responses.workout.length)];
    } else if (userMessage.toLowerCase().includes("diet")) {
        return responses.diet[Math.floor(Math.random() * responses.diet.length)];
    } else {
        return "I'm here to help with your fitness journey!";
    }
}

// Dashboard with Chart.js
document.getElementById('dashboard-button').addEventListener('click', function() {
    transitionPage('chatbot-page', 'dashboard-page');
    loadProgressChart();
});

function loadProgressChart() {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Weight Progress (kg)',
                data: [75, 74, 73, 72],
                borderColor: '#28a745',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Achievements Display
document.getElementById('achievements-button').addEventListener('click', function() {
    loadAchievements();
});

function loadAchievements() {
    const achievementList = document.getElementById('achievement-list');
    const achievements = [
        { name: "First Workout", completed: true },
        { name: "5-Day Workout Streak", completed: false },
    ];

    achievementList.innerHTML = ''; // Clear previous
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement.name + (achievement.completed ? ' ✅' : ' ❌');
        achievementList.appendChild(li);
    });

    document.getElementById('achievements').style.display = 'block';
}

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.toggle('dark-mode');
    });
});

// Push notifications (only works in some browsers)
function requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

function sendWorkoutReminder() {
    if (Notification.permission === 'granted') {
        const notification = new Notification("Time to workout!", {
            body: "Don't forget to complete your workout today!",
            icon: "workout-icon.png"
        });
    }
}

// Trigger workout reminder on login
document.getElementById('login-button').addEventListener('click', function() {
    sendWorkoutReminder();
});
