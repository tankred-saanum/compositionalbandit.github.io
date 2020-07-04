//import Game from './game.js'
import Game from './gamev2.js' // use this to try the second version of the game, employing more regimented training
import TutorialGame from './tutorialGame.js'

////////////////////////////////////////////
// create firebase database and reference
var database = firebase.database()
var ref = database.ref("participantData")
///////////////////////////////////////////

/////////////////////
// consent page:
let currentPage = 1

function nextPage(currentIndex){
    currentPage += 1;
    let oldPage = `page${currentIndex}`;
    let newPage = `page${currentIndex + 1}`;

    document.getElementById(oldPage).style.display = "none";
    document.getElementById(newPage).style.display = "block";
    window.scrollTo(0, 0);
    // if (newPage == "page4"){
    //     startTutorial();
    // }
}


document.querySelectorAll('button.instructionsButton').forEach(item => {
    item.addEventListener('click', event => {
        nextPage(currentPage);
  })
})


let gender = "";
let genderCondition = false;
document.querySelectorAll('input.genderButton').forEach(item => {
    item.addEventListener('click', event => {
        gender = item.id;
        genderCondition = true;
    })
})
let age = ""
let ageField =document.getElementById("ageField");
let ageCondition = false;
ageField.addEventListener("input", event=>{
    age = ageField.value;
    if(!isNaN(age)){
        if(parseInt(age) <120 && parseInt(age) >=18){
            ageCondition = true;
        }else {
            ageCondition = false;
        }
    } else {
        ageCondition = false;
    }
})



// Hide HTML elements used in game

let xSlider = document.getElementById("xSlider");
xSlider.style.display = "none";
let ySlider = document.getElementById("ySlider");
ySlider.style.display = "none";
let submitBtn = document.getElementById("submitButton")
submitBtn.style.display = "none";

///
// this is for later, after all the boxes are checked
// Get fullscreen button and start button
let fullscreenBtn = document.getElementById("fullscreenBtn");
let startBtn = document.getElementById("start");
//let fullscreenWarning = document.getElementById("fullscreenWarning");
let consentButton = document.getElementById("consentButton");
let tutorialButton = document.getElementById("tutorialButton")
let htmlElems = [fullscreenBtn, startBtn];
let finishTutorialDiv = document.getElementById("tutorialFinishedPage")
let tutorialPage = 2;
let consentCheck1 = document.getElementById("consent_check1");
let consentCheck2 = document.getElementById("consent_check2");
let demographicsButton = document.getElementById("demographicsButton")

consentButton.addEventListener("click", event =>{
    if(consentCheck1.checked && consentCheck2.checked){
        nextPage(currentPage);
    } else {
        alert("You need to consent to the conditions to proceed.");
    }
})
demographicsButton.addEventListener("click", event =>{
    if(ageCondition && genderCondition){
        nextPage(currentPage);
    } else {
        if(!isNaN(age) && age!=""){
            if(parseInt(age) <18){
                alert("You must be older than 18 to participate in this experiment");
            }else if(parseInt(age) >=120){
                alert("Are you really that old?");
            }
        } else {
            alert("Insert a valid age.");
        }
        if(!genderCondition){
            alert("Please specify your gender.")
        }
    }
})

tutorialButton.addEventListener("click", event => {
    tutorialButton.style.display = "none";
    startTutorial();
})
startBtn.onclick = function(){
    if(document.fullscreenElement == document.documentElement || true){
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
        // document.exitFullscreen();
        closeFullscreen()
    } else {
        //document.documentElement.requestFullscreen();
        openFullscreen(document.documentElement)
        // fullscreenWarning.style.display = "none";
    }


});

function checkDevice(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.getElementById(`page${currentPage}`).style.display = "none";
        document.getElementById("wrongDevicePage").style.display = "block";
    }
}
checkDevice();

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function startTutorial(){
    let tutorialGame = new TutorialGame()
    let lastTime = 0;

    function gameLoop(timestamp){

        let dt = timestamp - lastTime;
        lastTime = timestamp;

        tutorialGame.update(dt);
        tutorialGame.draw(tutorialGame.ctx);
        if (!tutorialGame.run){
            nextPage(currentPage);
            return;
        }
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

}

// create game and start gameloop
function startGame(){
    let game  = new Game(ref);
    game.startNewGame();
    game.generalData.age = age;
    game.generalData.gender = gender
    let lastTime = 0;


    function gameLoop(timestamp){

        let dt = timestamp - lastTime;
        lastTime = timestamp;


        if (game.currentGameState === game.GAMESTATES.FINISHED){
            document.getElementsByClassName("gamePage")[0].style.display = "none";
            document.getElementsByClassName("endPage")[0].style.display = "block";
            // nextPage(currentPage);
            return;
        }

        game.update(dt);
        game.draw(game.ctx);

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

}
