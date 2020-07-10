export default class InputHandler {
    constructor(game) {
        document.addEventListener('keydown', event => {
            switch (event.keyCode) {
                case 65:
                    game.player.moveLeft();
                    break;
                case 68:
                    game.player.moveRight();
                    break;

                case 37:
                    game.player.moveLeft();
                    break;

                case 39:
                    game.player.moveRight();
                    break;

                case 13:

                    if (game.currentGameState === game.GAMESTATES.BETWEENCYCLE){
                    game.currentCycle += 1;
                    game.timer = 0;
                    game.generalData.betweenRoundTime.push(game.betweenRoundTimer)
                    game.betweenRoundTimer = 0;
                    game.startNewGame();
                    }
                    break;
            }
        });

        game.submitButton.addEventListener('click', event => {
            if(game.player.currentTarget.currentCustomer != undefined){
                if (game.player.canSelect && game.player.currentTarget.currentCustomer.readyToServe && game.hasMovedSlider){
                    game.hasMovedSlider = false;
                    // get reward from alien
                    game.player.currentTarget.currentCustomer.giveReward(game.xSlider.value, game.ySlider.value);
                    // update display
                    game.totalRewardText.change(`Total $: ${game.totalReward}`);
                    game.rewardText.change(game.reward);
                    // save data
                    game.saveTrialData(game.player.currentTarget.currentCustomer, parseInt(game.xSlider.value), parseInt(game.ySlider.value));

                    game.timer = 0;
                    game.currentTrial += 1;
                    game.trialText.change(`Customers left: ${game.totalTrials - game.currentTrial}`);

                    // update waiting time for aliens after receiving reward
                    if (game.numSimultaneousAliens == game.tableList.length){
                        for (let table in game.tableList){
                            game.tableList[table].currentCustomer.updateWaitingTime();
                        }
                    }
                    // advance to next trial if not bonus round
                    if (game.totalTrials - game.currentTrial == 0){
                        game.lastAlienServed = true;
                    } else if(game.currentGameState !== game.GAMESTATES.BONUSROUND) {
                        game.newTrial();
                    } else {
                        game.newBonusTrial()
                    }
                } else if (game.player.canSelect && game.player.currentTarget.currentCustomer.readyToServe && !game.hasMovedSlider) {
                    game.sliderWarning.show = true;

                }
            }
        });

        game.xSlider.addEventListener('input', event => {
            if (window.getSelection){
                window.getSelection().removeAllRanges();
            } else if (document.selection){
                document.selection.empty();
            }


            if (game.xSlider.value < game.xSliderMin){
                game.xSlider.value = game.xSliderMin
            }else if (game.xSlider.value > game.xSliderMax) {
                game.xSlider.value = game.xSliderMax
            }
            game.xValueText.change(game.xSlider.value);
            game.xIngredient.update(game.xSlider.value);

            game.hasMovedSlider = true;
            game.sliderWarning.show = false;


            this.gradient = ((game.xSlider.value - game.xSlider.min)/(game.xSlider.max - game.xSlider.min));
            this.modifiedRgba = game.xSliderColor1.slice(0, -2);
            this.modifiedRgba += `${this.gradient})`;
            this.xColor = `linear-gradient(90deg, ${this.modifiedRgba} ${this.gradient*100}%, ${game.xSliderColor2} ${this.gradient*100}%)`;
            game.xSlider.style.background = this.xColor;

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

        game.ySlider.addEventListener('input', event => {

            if (window.getSelection){
                window.getSelection().removeAllRanges();
            } else if (document.selection){
                document.selection.empty();
            }

            if (game.ySlider.value < game.ySliderMin){
                game.ySlider.value = game.ySliderMin
            }else if (game.ySlider.value > game.ySliderMax) {
                game.ySlider.value = game.ySliderMax
            }
            game.yValueText.change(game.ySlider.value);

            game.hasMovedSlider = true;
            game.sliderWarning.show = false;

            this.gradient = ((game.ySlider.value - game.ySlider.min)/(game.ySlider.max - game.ySlider.min))
            this.modifiedRgba = game.ySliderColor1.slice(0, -2);
            this.modifiedRgba += `${this.gradient})`;
            this.yColor = `linear-gradient(90deg, ${this.modifiedRgba} ${this.gradient*100}%, ${game.ySliderColor2} ${this.gradient*100}%)`;
            game.ySlider.style.background = this.yColor;
            game.yIngredient.update(game.ySlider.value);
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

    }
}
