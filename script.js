// JavaScript for Chatbot Functionality with Smooth Transitions
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Enhanced Exercise Knowledge Base with Benefits, Muscles Trained, and Warm-up
const EXERCISES = {
    "weight loss": [
        {
            name: "Running",
            benefits: "Great for cardiovascular health and burning calories.",
            muscles: "Legs, core.",
            warmup: "5 minutes brisk walking or dynamic leg swings."
        },
        {
            name: "HIIT",
            benefits: "Boosts metabolism and burns fat efficiently.",
            muscles: "Full body workout.",
            warmup: "Jumping jacks, arm circles, and light jogging for 5 minutes."
        }
    ],
    "muscle gain": [
        {
            name: "Squats",
            benefits: "Builds lower body strength.",
            muscles: "Quadriceps, hamstrings, glutes.",
            warmup: "Bodyweight squats and leg stretches."
        },
        {
            name: "Bench Press",
            benefits: "Enhances upper body muscle growth.",
            muscles: "Chest, shoulders, triceps.",
            warmup: "Arm circles, light push-ups, and shoulder mobility drills."
        },
        {
            name: "Lunges",
            benefits: "Targets multiple lower body muscles and improves balance.",
            muscles: "Quadriceps, glutes, hamstrings.",
            warmup: "Leg swings, bodyweight lunges."
        },
        {
            name: "Push-up",
            benefits: "Strengthens upper body and core.",
            muscles: "Chest, triceps, core.",
            warmup: "Arm circles, light plank hold."
        }
    ],
    // Add more exercise categories similarly with benefits and warm-ups
};

// Expanded Diet Tips with Meal Plans for Specific Goals
const DIET_TIPS = {
    "weight loss": [
        "Focus on a calorie deficit with lean proteins, vegetables, and healthy fats.",
        "Sample Meal Plan: Breakfast - Greek yogurt with berries; Lunch - Grilled chicken salad; Dinner - Baked salmon with broccoli."
    ],
    "muscle gain": [
        "Increase protein intake with chicken, fish, eggs, and legumes.",
        "Sample Meal Plan: Breakfast - Scrambled eggs with avocado toast; Lunch - Steak with sweet potato; Dinner - Chicken stir-fry with brown rice."
    ],
    // Add more diet plans based on workout types
};

// Warm-up Tips and Advice
const WARMUP_TIPS = [
    "Start with dynamic stretches like arm swings, leg swings, and torso twists.",
    "Include a light cardio session, such as jogging or skipping, for 5-10 minutes.",
    "Gradually increase the intensity of your warm-up to prepare muscles for exercise."
];

// Mental Health Tips
const MENTAL_HEALTH_TIPS = [
    "Practice mindfulness and deep breathing exercises.",
    "Take short breaks to stretch and relax during work.",
    "Try meditation apps for guided relaxation and mental clarity.",
];

// Event listeners for sending messages
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// Function to send and handle user messages
function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessageToChat("user-message", message);
    handleUserInput(message);
    userInput.value = "";
}

// Function to handle and generate chatbot responses
function handleUserInput(input) {
    input = input.toLowerCase();
    let response = "I'm here to help with your fitness journey! Ask me about exercises, diet tips, warm-ups, or mental health advice.";

    // Check for exercise-related queries
    if (input.includes("exercise") || input.includes("workout")) {
        if (input.includes("weight loss")) response = formatExerciseResponse(EXERCISES["weight loss"]);
        else if (input.includes("muscle gain")) response = formatExerciseResponse(EXERCISES["muscle gain"]);
        else response = "Please specify your goal: weight loss, muscle gain, or general fitness.";
    }

    // Check for diet-related queries
    else if (input.includes("diet") || input.includes("food") || input.includes("nutrition")) {
        if (input.includes("weight loss")) response = getRandomItem(DIET_TIPS["weight loss"]);
        else if (input.includes("muscle gain")) response = getRandomItem(DIET_TIPS["muscle gain"]);
        else response = getRandomItem(flattenObject(DIET_TIPS));
    }

    // Check for warm-up queries
    else if (input.includes("warm-up") || input.includes("pre-workout")) {
        response = getRandomItem(WARMUP_TIPS);
    }

    // Check for mental health queries
    else if (input.includes("stress") || input.includes("mental") || input.includes("mind") || input.includes("relax")) {
        response = getRandomItem(MENTAL_HEALTH_TIPS);
    }

    addMessageToChat("bot-message", response);
}

// Function to format exercise response
function formatExerciseResponse(exercises) {
    return exercises.map(exercise => `
        <strong>${exercise.name}</strong><br>
        <em>Benefits:</em> ${exercise.benefits}<br>
        <em>Muscles Trained:</em> ${exercise.muscles}<br>
        <em>Warm-up:</em> ${exercise.warmup}
    `).join('<br><br>');
}

// Function to add messages to chat
function addMessageToChat(className, text) {
    const message = document.createElement("div");
    message.className = `message ${className}`;
    message.innerHTML = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to flatten an object into an array of values
function flattenObject(obj) {
    return Object.values(obj).flat();
}
// JavaScript for Particles.js configuration
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
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
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
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        }
    },
    "retina_detect": true
});
