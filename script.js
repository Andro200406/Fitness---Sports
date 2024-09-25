let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let net = null;
let exerciseReps = { squat: 0, pushup: 0 }; // Track reps for multiple exercises
let squatDown = false;
let pushupDown = false;
let currentExercise = 'squat'; // Track current exercise
let isWorkoutActive = false;

async function loadPoseNet() {
    net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75
    });
    console.log('PoseNet model loaded.');
}

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

function calculateAngle(A, B, C) {
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    const angle = Math.acos((BC ** 2 + AB ** 2 - AC ** 2) / (2 * BC * AB));
    return angle * (180 / Math.PI); 
}

async function detectPose() {
    const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false
    });

    drawPose(pose);
    evaluateExercise(pose); // Evaluate the current exercise form

    if (isWorkoutActive) {
        requestAnimationFrame(detectPose);
    }
}

function drawPose(pose) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    pose.keypoints.forEach(point => {
        if (point.score > 0.6) {
            ctx.beginPath();
            ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
        }
    });
}

function evaluateExercise(pose) {
    if (currentExercise === 'squat') {
        evaluateSquat(pose);
    } else if (currentExercise === 'pushup') {
        evaluatePushup(pose);
    }
}

function evaluateSquat(pose) {
    const leftHip = pose.keypoints.find(k => k.part === 'leftHip');
    const leftKnee = pose.keypoints.find(k => k.part === 'leftKnee');
    const leftAnkle = pose.keypoints.find(k => k.part === 'leftAnkle');

    if (leftHip.score > 0.6 && leftKnee.score > 0.6 && leftAnkle.score > 0.6) {
        const squatAngle = calculateAngle(leftHip.position, leftKnee.position, leftAnkle.position);
        
        if (squatAngle < 90) {
            if (!squatDown) {
                squatDown = true;
                document.getElementById('form-feedback').textContent = "Squat down!";
            }
        } else if (squatAngle > 160) {
            if (squatDown) {
                exerciseReps.squat++;
                squatDown = false;
                document.getElementById('form-feedback').textContent = `Squat reps: ${exerciseReps.squat}`;
            }
        } else {
            document.getElementById('form-feedback').textContent = "Squat form looks good!";
        }
    }
}

function evaluatePushup(pose) {
    const leftShoulder = pose.keypoints.find(k => k.part === 'leftShoulder');
    const leftElbow = pose.keypoints.find(k => k.part === 'leftElbow');
    const leftWrist = pose.keypoints.find(k => k.part === 'leftWrist');

    if (leftShoulder.score > 0.6 && leftElbow.score > 0.6 && leftWrist.score > 0.6) {
        const pushupAngle = calculateAngle(leftShoulder.position, leftElbow.position, leftWrist.position);
        
        if (pushupAngle < 90) {
            if (!pushupDown) {
                pushupDown = true;
                document.getElementById('form-feedback').textContent = "Lower down for push-up!";
            }
        } else if (pushupAngle > 160) {
            if (pushupDown) {
                exerciseReps.pushup++;
                pushupDown = false;
                document.getElementById('form-feedback').textContent = `Push-up reps: ${exerciseReps.pushup}`;
            }
        } else {
            document.getElementById('form-feedback').textContent = "Push-up form looks good!";
        }
    }
}

// Start workout button handler
document.getElementById('start-workout').addEventListener('click', () => {
    if (!isWorkoutActive) {
        isWorkoutActive = true;
        exerciseReps.squat = 0; 
        exerciseReps.pushup = 0; // Reset reps for all exercises
        detectPose();
    }
});

// Stop workout button handler
document.getElementById('stop-workout').addEventListener('click', () => {
    isWorkoutActive = false;
    document.getElementById('form-feedback').textContent = `Workout stopped. Total Squats: ${exerciseReps.squat}, Total Push-ups: ${exerciseReps.pushup}`;
});

// Exercise selector (you can implement this in your HTML)
document.getElementById('exercise-selector').addEventListener('change', (event) => {
    currentExercise = event.target.value; // Update the current exercise based on user selection
});

// Initialize
async function init() {
    await setupCamera();
    await loadPoseNet();
}

init();
