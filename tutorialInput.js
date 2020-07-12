//import InputHandler from './input.js'

export default class TutorialInputHandler{
    constructor(game){

        this.game = game
        this.tutorialStages = {
            MOVE: false,
            SLIDERS: true,
            SERVE: false,
            SERVEALL: false
        }

        this.initialInfo = document.getElementById("tutorialDiv");
        this.moveInfo = document.getElementById("moveDiv");
        this.sliderInstructions = document.getElementById("sliderDiv");
        this.servingInfo = document.getElementById("serveDiv");
        this.serveAllInfo = document.getElementById("serveAllDiv");
        this.continueDiv = document.getElementById("continueDiv");
        this.continueButton = document.getElementById("nextStage");

        this.nextStage(this.initialInfo, this.sliderInstructions)
        game.canvas.focus()

        this.currentDivIdx = 1;
        //this.stageList = [this.tutorialStages.MOVE, this.tutorialStages.SLIDERS, this.tutorialStages.SERVE, this.tutorialStages.SERVEALL]
        this.divList = [this.moveInfo, this.sliderInstructions, this.servingInfo, this.serveAllInfo]

        document.addEventListener('keydown', event => {
            switch (event.keyCode) {
                case 65:
                    game.player.moveLeft();
                    this.checkMovement();
                    break;
                case 68:
                    game.player.moveRight();
                    this.checkMovement();
                    break;

                case 37:
                    game.player.moveLeft();
                    this.checkMovement();
                    break;

                case 39:
                    game.player.moveRight();
                    this.checkMovement();
                    break;

                case 13:
                    // end game here depending on condition and proceed to next page
                    break;
                    // if (game.currentGameState === game.GAMESTATES.BETWEENCYCLE){
                    // game.currentCycle += 1;
                    // game.timer = 0;
                    // game.generalData.betweenRoundTime.push(game.betweenRoundTimer)
                    // game.betweenRoundTimer = 0;
                    // game.startNewGame();
                    // }
                    // break;
            }
        });

        game.submitButton.addEventListener('click', event => {
            if (game.player.canSelect && game.player.currentTarget.currentCustomer.readyToServe && (this.tutorialStages.SERVE == true
            || this.tutorialStages.SERVEALL == true)){

                // get reward from alien
                game.player.currentTarget.currentCustomer.giveRandomReward();
                // update display
                game.totalRewardText.change(`Total $: X`);
                game.rewardText.change("X");
                // save data
                //game.saveTrialData(game.player.currentTarget.currentCustomer, parseInt(game.xSlider.value), parseInt(game.ySlider.value));

                game.timer = 0;
                game.currentTrial += 1;
                this.checkServe()
                game.trialText.change(`Customers left: ${game.totalTrials - game.currentTrial}`);

                // update waiting time for aliens after receiving reward
                // for (let table in game.tableList){
                //     game.tableList[table].currentCustomer.updateWaitingTime();
                // }
                // advance to next trial if not bonus round
                if (game.totalTrials - game.currentTrial == 0){
                    game.lastAlienServed = true;
                // } else if(game.currentGameState !== game.GAMESTATES.BONUSROUND) {
                //     game.newTrial();
            } else {
                game.newTrial();
                }
            }

            });


        game.xSlider.addEventListener('input', event => {
            // if (game.xSlider.value < game.xSliderMin){
            //     game.xSlider.value = game.xSliderMin
            // }else if (game.xSlider.value > game.xSliderMax) {
            //     game.xSlider.value = game.xSliderMax
            // }

            if (window.getSelection){
                window.getSelection().removeAllRanges();
            } else if (document.selection){
                document.selection.empty();
            }
            game.xValueText.change(game.xSlider.value);
            game.xIngredient.update(game.xSlider.value);
            this.gradient = ((game.xSlider.value - game.xSlider.min)/(game.xSlider.max - game.xSlider.min));
            this.modifiedRgba = game.xSliderColor1.slice(0, -2);
            this.modifiedRgba += `${this.gradient})`;
            this.xColor = `linear-gradient(90deg, ${this.modifiedRgba} ${this.gradient*100}%, ${game.xSliderColor2} ${this.gradient*100}%)`;
            game.xSlider.style.background = this.xColor;

            this.checkSlider()

        });

        game.xSlider.addEventListener('mouseenter', event => {
            if (game.xSliderMax != game.xSliderMin){
                game.xSlider.style.opacity = 1;
            }
        })

        game.xSlider.addEventListener('mouseleave', event => {
            if (game.xSliderMax != game.xSliderMin){
            game.xSlider.style.opacity = 0.85;
            }
        })

        //game.ySlider.addEventListener('input', event => {
        game.ySlider.addEventListener('input', event => {
            // if (game.ySlider.value < game.ySliderMin){
            //     game.ySlider.value = game.ySliderMin
            // }else if (game.ySlider.value > game.ySliderMax) {
            //     game.ySlider.value = game.ySliderMax
            // }


            if (window.getSelection){
                window.getSelection().removeAllRanges();
            } else if (document.selection){
                document.selection.empty();
            }

            game.yValueText.change(game.ySlider.value);
            this.gradient = ((game.ySlider.value - game.ySlider.min)/(game.ySlider.max - game.ySlider.min))
            this.modifiedRgba = game.ySliderColor1.slice(0, -2);
            this.modifiedRgba += `${this.gradient})`;
            this.yColor = `linear-gradient(90deg, ${this.modifiedRgba} ${this.gradient*100}%, ${game.ySliderColor2} ${this.gradient*100}%)`;
            game.ySlider.style.background = this.yColor;
            game.yIngredient.update(game.ySlider.value);

            this.checkSlider()
        });


        game.ySlider.addEventListener('mouseenter', event => {
            if (game.ySliderMax != game.ySliderMin){
                game.ySlider.style.opacity = 1;
            }
        })

        game.ySlider.addEventListener('mouseleave', event => {
            if (game.ySliderMax != game.ySliderMin){
            game.ySlider.style.opacity = 0.85;
            }
        })

        this.continueButton.addEventListener("click", event =>{
            this.nextStage(this.continueDiv, this.divList[this.currentDivIdx + 1])
            this.currentDivIdx += 1;
            if (this.currentDivIdx == 1){
                this.tutorialStages.SLIDERS = true;
            } else if (this.currentDivIdx == 2) {
                this.tutorialStages.SERVE = true;
            } else if (this.currentDivIdx == 3) {
                this.tutorialStages.SERVEALL = true;
            }

            game.canvas.focus()
            //this.stageList[this.currentDivIdx] = true;
        })
    }

    nextStage(hide, show){
        hide.style.display = "none";
        show.style.display = "block";

    }

    checkMovement(){
        if(this.tutorialStages.MOVE == true){
            this.tutorialStages.MOVE = false;
            this.nextStage(this.divList[this.currentDivIdx], this.continueDiv)
        }
    }

    checkSlider(){
        if(this.tutorialStages.SLIDERS == true){
            this.tutorialStages.SLIDERS = false;
            this.nextStage(this.divList[this.currentDivIdx], this.continueDiv)
        }
    }

    checkServe(){
        if(this.tutorialStages.SERVE == true){
            this.tutorialStages.SERVE = false;
            this.nextStage(this.divList[this.currentDivIdx], this.continueDiv)
        }
    }

}
