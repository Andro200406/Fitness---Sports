// Utility function to switch between pages
function transitionPage(fromPage, toPage) {
    document.getElementById(fromPage).style.display = 'none';
    document.getElementById(toPage).style.display = 'block';
}

// Signup functionality
document.getElementById('signup-button').addEventListener('click', function () {
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
document.getElementById('login-button').addEventListener('click', function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const storedSignup = JSON.parse(localStorage.getItem('userSignup'));

    if (storedSignup && storedSignup.email === email && storedSignup.password === password) {
        alert('Login successful!');
        transitionPage('login-page', 'chatbot-page');
    } else {
        alert('Invalid email or password');
    }
});

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.toggle('dark-mode');
    });
});

// PoseNet Variables
let net;
const videoElement = document.getElementById('workout-video');
const canvas = document.getElementById('pose-canvas');
const ctx = canvas.getContext('2d');

// Initialize PoseNet
async function initPoseNet() {
    net = await posenet.load();
    console.log('PoseNet model loaded.');
}

// Load and analyze the uploaded video
document.getElementById('workout-video-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.load();
    videoElement.play();
});

// Analyze Workout Form Button
document.getElementById('analyze-button').addEventListener('click', async function () {
    const workoutFeedback = document.getElementById('workout-feedback');
    workoutFeedback.textContent = "Analyzing workout form...";

    // Start pose detection on the video
    const pose = await detectPose();

    if (pose) {
        drawPose(pose);
        evaluatePose(pose);
    }
});

// Detect Pose in the Video
async function detectPose() {
    const pose = await net.estimateSinglePose(videoElement, {
        flipHorizontal: false
    });
    console.log(pose);
    return pose;
}

// Draw Pose on Canvas
function drawPose(pose) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pose.keypoints.forEach(point => {
        if (point.score > 0.5) {
            const { y, x } = point.position;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        }
    });
}

// Evaluate Pose and Provide Feedback
function evaluatePose(pose) {
    const formFeedback = document.getElementById('form-feedback');

    // Example: Check if arms are raised correctly (using keypoints of shoulders and wrists)
    const leftShoulder = pose.keypoints.find(k => k.part === 'leftShoulder');
    const leftWrist = pose.keypoints.find(k => k.part === 'leftWrist');

    if (leftShoulder && leftWrist && leftWrist.position.y < leftShoulder.position.y) {
        formFeedback.textContent = "Great! Your arms are raised correctly.";
        formFeedback.style.color = "green";
    } else {
        formFeedback.textContent = "Incorrect form! Make sure your arms are raised properly.";
        formFeedback.style.color = "red";
    }
}

// Close Modal when clicking outside or on close button
document.querySelector('.close-modal').addEventListener('click', function () {
    document.getElementById('analysis-modal').style.display = 'none';
});
window.addEventListener('click', function (event) {
    const modal = document.getElementById('analysis-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize PoseNet model when page loads
window.onload = initPoseNet;

// Start Workout Button
document.getElementById('start-workout-button').addEventListener('click', function () {
    transitionPage('chatbot-page', 'workout-page');
    loadPoseNetModel(); // Load PoseNet when starting workout
});

// Stop Workout Button
document.getElementById('stop-workout-button').addEventListener('click', function () {
    transitionPage('workout-page', 'chatbot-page');
});
