import Game from './game.js'

////////////////////////////////////////////
// create firebase database and reference
var database = firebase.database()
var ref = database.ref("participantData")
///////////////////////////////////////////

let currentPage = 1
// Hide HTML elements used in game
let xSlider = document.getElementById("xSlider");
xSlider.style.display = "none";
let ySlider = document.getElementById("ySlider");
ySlider.style.display = "none";
let submitBtn = document.getElementById("submitButton")
submitBtn.style.display = "none";


// Get fullscreen button and start button
let fullscreenBtn = document.getElementById("fullscreenBtn");
let startBtn = document.getElementById("start");
let fullscreenWarning = document.getElementById("fullscreenWarning");

let htmlElems = [fullscreenBtn, startBtn, fullscreenWarning];

function checkDevice(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.getElementById(`page${currentPage}`).style.display = "none";
        document.getElementById("wrongDevicePage").style.display = "block";
    }
}
checkDevice();


startBtn.onclick = function(){
    if(document.fullscreenElement == document.documentElement){
        startGame();
        for (let elem in htmlElems){
            htmlElems[elem].style.display = "none";
        }
    } else {
        fullscreenWarning.style.display = "block";
    }
};

fullscreenBtn.addEventListener('click', event => {
    if (document.fullscreenElement == document.documentElement){
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
        fullscreenWarning.style.display = "none";
    }


});

function startGame(){
    let game  = new Game(ref);
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
