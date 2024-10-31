let canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    ballRadius = 25, // Ball radius
    x = canvas.width / 2, // Start in the middle of the canvas
    y = canvas.height - 40,
    dx = 2, // Ball speed in the x direction
    dy = -2; // Ball speed in the y direction

// Paddle properties
let paddleHeight = 140;
let paddleWidth = paddleHeight * 1.5;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight + 18;

let paddleImage = new Image();
paddleImage.src = 'diwali ke diye.png'; // Paddle image source

let ballImage = new Image();
ballImage.src = 'motichoor-laddu.png'; // Ball image source

// Brick properties
let brickImage = new Image();
brickImage.src = 'gifts.png'; // Brick image source
const brickWidth = 125; // Width of each brick
const brickHeight = brickWidth * 0.55; // Height of each brick
const brickSpacing = 2; // Space between bricks
const leftMargin = 10; // Left margin for bricks

const bricksPerRow = Math.floor((canvas.width + brickSpacing) / (brickWidth + brickSpacing));
const rows = Math.floor((canvas.height / 2) / (brickHeight + brickSpacing));

// Array to store brick properties
let bricks = [];

// Initialize bricks array
for (let r = 0; r < rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < bricksPerRow; c++) {
        bricks[r][c] = { x: leftMargin + c * (brickWidth + brickSpacing), y: r * (brickHeight + brickSpacing), status: 1 }; // Status 1 indicates the brick is active
    }
}

// Mouse movement for paddle control
canvas.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left; // Get mouse X relative to canvas
    paddleX = mouseX - paddleWidth / 2; // Center the paddle on mouse
    // Keep paddle within bounds
    if (paddleX < 0) {
        paddleX = 0;
    } else if (paddleX > canvas.width - paddleWidth) {
        paddleX = canvas.width - paddleWidth;
    }
});


// Score variable
let score = 0;

// Paddle movement control
let rightPressed = false;
let leftPressed = false;

// Key event listeners for paddle movement
document.addEventListener('keydown', function(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = true;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = false;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

// Draw paddle function
function drawPaddle() {
    ctx.clearRect(0, canvas.height - paddleHeight, canvas.width, paddleHeight); // Clear previous paddle
    ctx.drawImage(paddleImage, paddleX, paddleY, paddleWidth, paddleHeight);
}

// Draw ball function
function drawBall() {
    ctx.drawImage(ballImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
}

// Draw bricks function
function drawBricks() {
    for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < bricks[r].length; c++) {
            let b = bricks[r][c];
            if (b.status === 1) { // Only draw bricks that are not broken
                ctx.drawImage(brickImage, b.x, b.y, brickWidth, brickHeight);
            }
        }
    }
}

// Update the score display
function updateScore() {
    document.getElementById('score').innerText = "Score: " + score; // Update score display in the div
}

// Main game loop
function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawBricks(); // Draw bricks
    drawPaddle(); // Draw paddle
    drawBall(); // Draw ball
    updateScore(); // Update score display

    // Ball and paddle collision detection
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx; // Bounce off the walls
    }

    if (y + dy < ballRadius) {
        dy = -dy; // Bounce off the top wall
    } else if (y + dy > canvas.height - ballRadius) {
        // Check paddle collision
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy; // Bounce off paddle
        } else {
            alert('GAME OVER!');
            document.location.reload(); // Reset the game
            return; // Exit the function
        }
    }

    // Move the ball
    x += dx;
    y += dy;

    // Paddle movement with arrow keys
    if (rightPressed) {
        paddleX += 7; // Adjust speed as needed
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth; // Keep within bounds
        }
    } else if (leftPressed) {
        paddleX -= 7; // Adjust speed as needed
        if (paddleX < 0) {
            paddleX = 0; // Keep within bounds
        }
    }

    // Check for brick collisions
    for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < bricks[r].length; c++) {
            let b = bricks[r][c];
            if (b.status === 1) { // Only check bricks that are still active
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy; // Bounce off brick
                    b.status = 0; // Mark brick as broken
                    score++; // Increase score
                    updateScore(); // Update score display
                    if (score === bricksPerRow * rows) { // If all bricks are broken
                        alert("YOU WON! Your score is: " + score); // Display score in alert
                        document.location.reload(); // Reset the game
                        return; // Exit the function
                    }
                }
            }
        }
    }

    requestAnimationFrame(init); // Call init again to create the game loop
}

// Start the game when the start button is clicked
document.getElementById('start-btn').addEventListener('click', function() {
    score = 0; // Reset score
    init(); // Start the game loop
});

// Load images and start the game
let imagesLoaded = 0;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 3) { // Wait for all images to load
        document.getElementById('start-btn').disabled = false; // Enable the start button after images load
    }
}

paddleImage.onload = imageLoaded;
ballImage.onload = imageLoaded;
brickImage.onload = imageLoaded;
