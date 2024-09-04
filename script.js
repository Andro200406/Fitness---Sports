const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const voiceButton = document.getElementById("voice-button");

// Event listeners for sending messages
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});
voiceButton.addEventListener("click", startVoiceRecognition);

// Function to send and handle user messages
function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;
    addMessageToChat("user-message", message);
    handleUserInput(message);
    userInput.value = "";
}

// Voice recognition setup
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessageToChat("user-message", transcript);
        handleUserInput(transcript);
    };

    recognition.onerror = (event) => {
        alert('Voice recognition error: ' + event.error);
    };
}

// Function to handle and generate chatbot responses
function handleUserInput(input) {
    input = input.toLowerCase();
    let response = "I'm here to help with your fitness journey! Ask me about exercises, diet tips, warm-ups, or mental health advice.";

    if (input.includes("exercise") || input.includes("workout")) {
        response = "Please specify your goal: weight loss, muscle gain, or general fitness.";
    } else if (input.includes("diet") || input.includes("food") || input.includes("nutrition")) {
        response = "Focus on balanced meals with the right macros for your goals.";
    } else if (input.includes("warm-up") || input.includes("pre-workout")) {
        response = "Start with dynamic stretches like arm swings and leg swings.";
    } else if (input.includes("mental") || input.includes("mind") || input.includes("relax")) {
        response = "Try mindfulness exercises like deep breathing and meditation.";
    }

    addMessageToChat("bot-message", response);
}

// Function to add messages to chat
function addMessageToChat(className, text) {
    const message = document.createElement("div");
    message.className = `message ${className}`;
    message.innerHTML = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Particles.js configuration
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false
        },
        "size": {
            "value": 3,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "retina_detect": true
});
