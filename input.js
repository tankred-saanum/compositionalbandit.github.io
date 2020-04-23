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
                case 13:

                    if (game.currentGameState === game.GAMESTATES.BETWEENCYCLE){
                    game.currentCycle += 1;
                    game.startNewGame();
                    }
                    break;
            }
        });

        game.submitButton.addEventListener('click', event => {
            if (game.player.canSelect && game.player.currentTarget.currentCustomer.readyToServe){


                game.player.currentTarget.currentCustomer.giveReward(game.xSlider.value, game.ySlider.value);

                //game.player.currentTarget.currentCustomer.xtarget = 4000;
                game.rewardText.change(game.reward);
                if (game.currentTrial + 1 == game.totalTrials){
                    if (game.currentCycle + 1 < game.totalCycles) {
                        game.lastAlienServed = true;
                    } else {
                        game.currentGameState = game.GAMESTATES.FINISHED;
                    }
                } else {
                    game.newTrial();
                }
            }

            });

        game.xSlider.addEventListener('input', event => {
            game.xValueText.change(game.xSlider.value);
            game.xIngredient.update(game.xSlider.value);
            this.gradient = ((game.xSlider.value-game.xSlider.min)/(game.xSlider.max - game.xSlider.min));
            this.modifiedRgba = game.xSliderColor1.slice(0, -2);
            this.modifiedRgba += `${this.gradient})`;
            this.xColor = `linear-gradient(90deg, ${this.modifiedRgba} ${this.gradient*100}%, ${game.xSliderColor2} ${this.gradient*100}%)`;
            game.xSlider.style.background = this.xColor;
        });

        game.xSlider.addEventListener('mouseenter', event => {
            if (game.xSlider.max != game.xSlider.min){
                game.xSlider.style.opacity = 1;
            }
        })

        game.xSlider.addEventListener('mouseleave', event => {
            if (game.xSlider.max != game.xSlider.min){
            game.xSlider.style.opacity = 0.85;
            }
        })

        game.ySlider.addEventListener('input', event => {
            game.yValueText.change(game.ySlider.value);
            this.gradient = ((game.ySlider.value-game.ySlider.min)/(game.ySlider.max - game.ySlider.min));
            this.modifiedRgba = game.ySliderColor1.slice(0, -2);
            this.modifiedRgba += `${this.gradient})`;
            this.yColor = `linear-gradient(90deg, ${this.modifiedRgba} ${this.gradient*100}%, ${game.ySliderColor2} ${this.gradient*100}%)`;
            game.ySlider.style.background = this.yColor;
            game.yIngredient.update(game.ySlider.value);
        });


        game.ySlider.addEventListener('mouseenter', event => {
            if (game.ySlider.max != game.ySlider.min){
                game.ySlider.style.opacity = 1;
            }
        })

        game.ySlider.addEventListener('mouseleave', event => {
            if (game.ySlider.max != game.ySlider.min){
            game.ySlider.style.opacity = 0.85;
            }
        })

    }
}
