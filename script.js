const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const player = document.getElementById("player");
const startImage = document.getElementById("startImage");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const bestScore = document.getElementById("bestScore");
const modeButton = document.getElementById("modeButton");
const difficultyPanel = document.getElementById("difficultyPanel");
const playAgainButton = document.getElementById("playAgainButton");
const homebutton = document.getElementById("homeButton");
const pauseButton = document.getElementById("pauseButton");
const soundButton = document.getElementById("soundButton");
const bgMusic = document.getElementById("bgMusic");
let soundEnabled = localStorage.getItem("soundEnabled");

if (soundEnabled === null) {
    soundEnabled = true;
} else {
    soundEnabled = soundEnabled === "true";
}

soundButton.src = soundEnabled
? "audio1.png"
: "audio2.png";


soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    localStorage.setItem(
        "soundEnabled",
        soundEnabled
    );

    if (soundEnabled) {
        soundButton.src = "audio1.png";
        bgMusic.play();
    } else {
        soundButton.src = "audio2.png";
        bgMusic.pause();
    }
});
const pausePanel = document.getElementById("pausePanel");
console.log(pausePanel);
let paused = false;
const scoreDisplay = document.getElementById("score");
let score = 0;
let gameStarted = false;

let highScore =
    localStorage.getItem("highScore") || 0;

let owlY = 250;
let velocity = 0;
let gravity = 0.4;

let difficulty = localStorage.getItem("difficulty") || "easy";
let pipeSpeed =
difficulty === "hard" ? 8:4;
let pipes = [];

/* START GAME */

startImage.addEventListener("click", () => {

    if(soundEnabled){
        bgMusic.play();
    }

    homeScreen.style.display = "none";
    gameScreen.style.display = "block";

    paused = false;

    pausePanel.style.display = "none";

    gameStarted = true;

    owlY = 250;
    velocity = 0;

    player.style.top = "250px";

});

/* OPEN MODE MENU */

modeButton.addEventListener("click",() => {
    if(difficultyPanel.style.display === "block")
        {difficultyPanel.style.display = "none";}

    else{difficultyPanel.style.display="block";}
    
});

difficultyPanel.addEventListener("click",(e) => {
    let rect=difficultyPanel.getBoundingClientRect();
    let y= e.clientY-rect.top;

    if(
        y < rect.height/2
    ){
        difficulty = "easy";
        pipeSpeed = 4;
        console.log ("Easy Mode");
        localStorage.setItem("difficulty","easy");
    }

    else{
        difficulty = "hard";
        pipeSpeed = 8;
        console.log("Hard Mode");
        localStorage.setItem("difficulty", "hard");
    }

    difficultyPanel.style.display = "none";
});

/* FLY */

document.addEventListener("keydown", (e) => {

    if(e.code === "Space" && gameStarted){

        velocity = -9;

    }

});

/* CREATE PIPES */

setInterval(() => {

    if(!gameStarted || paused) return;

    let gapPosition =
        Math.random() * 250 + 50;

    let topPipe =
        document.createElement("img");

    topPipe.src =
        "downside obstacle.png";

    topPipe.classList.add("pipe");

    topPipe.style.left =
        window.innerWidth + "px";

    topPipe.style.top =
        (gapPosition - 290) + "px";



    let bottomPipe =
        document.createElement("img");

    bottomPipe.src =
        "upside obstacle.png";

    bottomPipe.classList.add("pipe");

    bottomPipe.style.left =
        window.innerWidth + "px";

    bottomPipe.style.bottom =
        (-gapPosition) + "px";



    gameScreen.appendChild(topPipe);
    gameScreen.appendChild(bottomPipe);

    pipes.push({

        top: topPipe,
        bottom: bottomPipe,
        x: window.innerWidth,
        scored: false

    });

}, 1500);

/* GAME LOOP */

function update(){

    if(paused){
        requestAnimationFrame(update);
        return;
    }

    if(gameStarted){
        velocity += gravity;
        owlY += velocity;
        
        player.style.top=
         owlY + "px";

    }

    if(
        owlY<-0 ||
        owlY>window.innerHeight-60
    ){
        gameOver();
    }

    for(let i = 0; i < pipes.length; i++){

    pipes[i].x -= pipeSpeed;

    pipes[i].top.style.left =
        pipes[i].x + "px";

    pipes[i].bottom.style.left =
        pipes[i].x + "px";
        
        if(
            !pipes[i].scored &&
            pipes[i].x<100
        ){

            score++;
            scoreDisplay.textContent =
            score;

            pipes[i].scored=true;
        }


    let owlRect =
        player.getBoundingClientRect();

    let topRect =
        pipes[i].top.getBoundingClientRect();

    let bottomRect =
        pipes[i].bottom.getBoundingClientRect();

    if(
        owlRect.left < topRect.right &&
        owlRect.right > topRect.left &&
        owlRect.top < topRect.bottom &&
        owlRect.bottom > topRect.top
    ){
        gameOver();
    }

    if(
        owlRect.left < bottomRect.right &&
        owlRect.right > bottomRect.left &&
        owlRect.top < bottomRect.bottom &&
        owlRect.bottom > bottomRect.top
    ){
        gameOver();
    }

}
    requestAnimationFrame(update);

}

update();
function gameOver(){
    
    if(!gameStarted) return;

    gameStarted = false;

    gameScreen.classList.add("blur");

    finalScore.textContent = score;
    bestScore.textContent = highScore;

    gameOverScreen.style.display = ("block");

   if(score > highScore){

    highScore = score;

    localStorage.setItem(
        "highScore",
        highScore
    );

}

}

document
.getElementById("playAgainButton")
.addEventListener("click",() => {
    gameOverScreen.style.display = "none";
    gameScreen.classList.remove("blur");

    score = 0;
    scoreDisplay.textContent = score;

    owlY = 250;
    velocity =0;
    player.style.top = "250px";

    player.style.top = owlY + "px";
    
    pipes.forEach (pipe => {
        pipe.top.remove();
        pipe.bottom.remove();
    });

    pipes = [];
    gameOverScreen.style.display = "none";
    gameScreen.style.display = "block";
    gameStarted = true;
});

document
.getElementById("homeButton")
.addEventListener("click",() => {
   gameOverScreen.style.display = "none";
   gameScreen.style.display = "none";
   homeScreen.style.display = "flex";


   gameScreen.classList.remove("blur");
   score = 0;
   scoreDisplay.textContent = score;

   owlY = 250;
   velocity =0;

   player.style.top = owlY + "px";

   pipes.forEach(pipe => {
    pipe.top.remove();
    pipe.bottom.remove();
   });

   pipes =[];
   gameStarted = false;

});

pauseButton.addEventListener("click", () =>{
    console.log("Pause clicked");
    paused = true;
    pausePanel.style.display = "block";

});

pausePanel.addEventListener("click", (e) =>{
    let rect= pausePanel.getBoundingClientRect();
    let y = e.clientY-rect.top;

    // TOP HALF = RESUME

    if(
        y < rect.height/2
    ){
        paused = false;
        pausePanel.style.display = "none";

    }

    // BOTTOM HALF = QUIT

    else{
         paused = false;
        pausePanel.style.display = "none";
        gameStarted = false;

        /* RESET SCORE */

        score = 0;
        scoreDisplay.textContent = score;
        player.style.top = "250px";

        /* REMOVE ALL PIPES */

        pipes.forEach( pipe => {
            pipe.top.remove();
            pipe.bottom.remove();
        });
        
        pipes = [];

        /* RETURN HOME */

        gameScreen.style.display = "none";
        homeScreen.style.display = "flex";
        }

    });