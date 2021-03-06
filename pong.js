$(document).ready(function(){
    var canvas = $('#gameCanvas')[0];
    canvas.width = window.innerWidth - 14;
    canvas.height = window.innerHeight - 50;
    var canvasContext = canvas.getContext('2d');
    var ballX = 400;
    var ballSpeedX = 5;
    var ballY = 300;
    var ballSpeedY = 2;
    var paddle1Y = 300;
    var paddle2Y = 300;
    var player1Score = 0;
    var player2Score = 0;
    var paused = true;
    var BASE_BALL_SPEED = 4;

    const WINNING_SCORE = 5;
    const Y_MODIFIER = 2;
    const PADDLE_X_BUFFER = 50;
    const BALL_RADIUS = 5;
    const AI_MAX_SPEED = 10;
    const PADDLE_HEIGHT = 100;
    const PADDLE_WIDTH = 10;
    const PADDLE1X = PADDLE_X_BUFFER + PADDLE_WIDTH;
    const PADDLE2X = canvas.width - PADDLE_X_BUFFER - PADDLE_WIDTH;
    const NET_WIDTH = 5;

    canvasContext.font = "20px sans-serif";
    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove',
        function(event) {
            var mousePos = calculateMousePos(event);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        }
    );

    function calculateMousePos(event) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = event.clientX - rect.left - root.scrollLeft;
        var mouseY = event.clientY - rect.top - root.scrollTop;
        return {
            x:mouseX,
            y:mouseY
        };
    }

    function handleMouseClick() {
        if(paused){
            paused = false;
            player1Score = 0;
            player2Score = 0;
        }
    }

    var frames = 60;
    setInterval(update, 1000/frames);
    function update() {
        move();
        draw();
    }

    function move() {
        if (paused) {
            return;
        }
        moveAI();
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        if(ballX >= (canvas.width - (2 * BALL_RADIUS))){
            player1Score++;
            ballReset();
        } else if(ballX <= (2 * BALL_RADIUS)){
            player2Score++;
            ballReset();
        } else if((PADDLE1X + ballSpeedX <= ballX) & (ballX <= PADDLE1X) & (paddle1Y <= ballY) & (ballY <= paddle1Y + PADDLE_HEIGHT)) {
            var delta = BASE_BALL_SPEED * (ballY - (paddle1Y + (PADDLE_HEIGHT/2))) / (PADDLE_HEIGHT/2);
            ballSpeedX = BASE_BALL_SPEED + Math.abs(delta);
            ballSpeedY = Y_MODIFIER * delta;
            BASE_BALL_SPEED += 0.2
        } else if((PADDLE2X <= ballX) & (ballX <= PADDLE2X + ballSpeedX) & (paddle2Y <= ballY) & (ballY <= paddle2Y + PADDLE_HEIGHT)) {
            var delta = BASE_BALL_SPEED * (ballY - (paddle2Y + (PADDLE_HEIGHT/2))) / (PADDLE_HEIGHT/2);
            ballSpeedX = -BASE_BALL_SPEED - Math.abs(delta);
            ballSpeedY = Y_MODIFIER * delta;
            BASE_BALL_SPEED += 0.2
        }

        if (ballY >= (canvas.height - (2 * BALL_RADIUS)) || ballY <= (2 * BALL_RADIUS)) {
            ballSpeedY = -ballSpeedY;
        }
    }

    function moveAI() {
        var mid = paddle2Y + (PADDLE_HEIGHT / 2);
        var speed;
        if ((ballY < paddle2Y) || (ballY > paddle2Y + PADDLE_HEIGHT)){
            speed = AI_MAX_SPEED;
        } else {
            speed = AI_MAX_SPEED * Math.abs(ballY - mid) / (PADDLE_HEIGHT/2);
        }
        if (mid >= ballY){
            paddle2Y -= speed;
        } else {
            paddle2Y += speed;
        }
    }

    function draw() {
        //background
        colourRect(0, 0, canvas.width, canvas.height, 'black');
        if (paused) {
            canvasContext.fillStyle = 'white';
            canvasContext.font = "40px sans-serif";
            if(player1Score >= WINNING_SCORE){
                canvasContext.fillText("Player 1 Won!", canvas.width / 2 - canvasContext.measureText("Player 1 Won!").width / 2, canvas.height / 2);
            } else if(player2Score >= WINNING_SCORE){
                canvasContext.fillText("Player 2 Won!", canvas.width / 2 - canvasContext.measureText("Player 2 Won!").width / 2, canvas.height / 2);
            }
            canvasContext.font = "20px sans-serif";
            canvasContext.fillText("Click to start a new game.", canvas.width / 2 - canvasContext.measureText("Click to start a new game.").width / 2, 500);
            return;
        }
        //net
        for(var i = 10; i < canvas.height; i += 40){
            colourRect(canvas.width/2 - NET_WIDTH/2, i, NET_WIDTH, 20, 'white');
        }
        //ball
        colourCirc(ballX, ballY, BALL_RADIUS, 'white');
        //left paddle
        colourRect(PADDLE_X_BUFFER, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
        //right paddle
        colourRect(PADDLE2X, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
        //scores
        canvasContext.fillText(player1Score.toString(), 100, 100);
        canvasContext.fillText(player2Score.toString(), canvas.width - 100, 100);
    }

    function colourRect(leftX, topY, width, height, colour) {
        canvasContext.fillStyle = colour;
        canvasContext.fillRect(leftX, topY, width, height);
    }

    function colourCirc(centerX, centerY, radius, colour) {
        canvasContext.fillStyle = colour;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
        canvasContext.fill();
    }

    function ballReset() {
        BASE_BALL_SPEED = 5;
        if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
            paused = true;
        }
        if(ballSpeedX > 0){
            ballSpeedX = -BASE_BALL_SPEED
        } else {
            ballSpeedX = BASE_BALL_SPEED
        }
        ballSpeedY = 0;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }
});