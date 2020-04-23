import Game from '/game.js'

// Hide HTML elements used in game
let xSlider = document.getElementById("xSlider");
xSlider.style.display = "none";
let ySlider = document.getElementById("ySlider");
ySlider.style.display = "none";
let submitBtn = document.getElementById("submitButton")
submitBtn.style.display = "none";


// Get fullscreen button and start button
let fullscreenBtn = document.getElementById("fullscreenBtn");
fullscreenBtn.style.position = "absolute"
fullscreenBtn.style.top = "200px"
let inFullscreen = false;

let startBtn = document.getElementById("start");
startBtn.style.position = "absolute";
startBtn.style.top = "100px"


startBtn.onclick = function(){
    if(inFullscreen){
        startGame();
    }
};

fullscreenBtn.addEventListener('click', event => {
    document.documentElement.requestFullscreen();
    fullscreenBtn.style.display = "none";
    inFullscreen = true;

});

function startGame(){
    startBtn.style.display = "none";
    let game  = new Game(1400, 600);
    game.startNewGame();
    let lastTime = 0;

    function gameLoop(timestamp){
        let dt = timestamp - lastTime;
        lastTime = timestamp;




        game.update(dt);
        game.draw(game.ctx);

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}
