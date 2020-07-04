import Alien from './alien.js'
//import Game from './gamev2.js'
import Ingredient from './ingredient.js'
import TutorialInputHandler from './tutorialInput.js'
import Table from './table.js'
import Player from './player.js'
import TextBox from './textBox.js'
import RewardText from './rewardText.js'

export default class TutorialGame{
    constructor(){

        this.canvas = document.getElementById("gameScreen");
        this.ctx = this.canvas.getContext('2d');

        this.background = "rgb(135, 145, 213)";

        this.canvas.style.position = 'absolute';
        this.canvas.width = Math.floor(window.innerWidth*0.95) //- 15;
        this.canvas.height = Math.floor(window.innerHeight*0.8) //- 15;

        this.canvasX = (window.innerWidth/2) - (this.canvas.width/2)
        // this.canvasY = (window.innerHeight/2) - (this.canvas.height/2)
        this.canvasY = (window.innerHeight) - (this.canvas.height) //- 20
        this.canvas.style.left = `${this.canvasX}px`
        this.canvas.style.top = `${this.canvasY}px`
        this.canvas.style.display = "block";
        this.reward = 0;
        this.totalReward = 0;
        this.timer = 0;
        this.totalTrials = 3;
        this.currentTrial = 0;
        this.run = true;

        this.GAME_WIDTH = this.canvas.width;
        this.GAME_HEIGHT = this.canvas.height;


        this.xSlider = document.getElementById("xSlider");
        this.ySlider = document.getElementById("ySlider");
        this.xSlider.value = 0;
        this.ySlider.value = 0;
        this.submitButton = document.getElementById("submitButton");
        this.htmlList = [this.xSlider, this.ySlider, this.submitButton];

        this.GAMESTATES = {
            RUNNING: 1,
            BONUSROUND: 2,
            BETWEENCYCLE: 3,
            FINISHED: 4

        };
        this.currentGameState = this.GAMESTATES.RUNNING;
        this.bonusTrial = false;

        this.contextDict = {};

        this.reshapeHTML(this.canvasX, this.canvasY)
        for (let elem in this.htmlList){
            this.htmlList[elem].style.display = "block";
        }

        this.lastAlienServed = false;

        // reshape html elements

        this.sliderInfo = [];

        this.xSliderRect = this.xSlider.getBoundingClientRect();
        this.ySliderRect = this.ySlider.getBoundingClientRect();

        this.xSliderRect.x -= this.canvasX;
        this.ySliderRect.x -= this.canvasX
        this.xSliderRect.y -= this.canvasY
        this.ySliderRect.y -= this.canvasY


        this.xSliderColor1 = "rgba(255, 41, 41, 1)";
        this.xSliderColor2 = "rgba(5, 129, 250, 1)";
        this.ySliderColor1 = "rgba(255, 41, 41, 1)";
        this.ySliderColor2 = "rgba(5, 129, 250, 1)";
        this.xGradient = ((this.xSlider.value - this.xSlider.min)/(this.xSlider.max - this.xSlider.min));
        this.yGradient = ((this.ySlider.value - this.ySlider.min)/(this.ySlider.max - this.ySlider.min));
        this.xSlider.style.opacity = 0.85;
        this.ySlider.style.opacity = 0.85;
        // this.xIngredient.setAvailable()
        // this.yIngredient.setAvailable()


        this.modifiedXColor = this.xSliderColor1.slice(0, -2);
        this.modifiedXColor += `${this.xGradient})`;
        this.modifiedYColor = this.ySliderColor1.slice(0, -2);
        this.modifiedYColor += `${this.yGradient})`;

        this.xColor = `linear-gradient(90deg, ${this.modifiedXColor} ${this.xGradient*100}%, ${this.xSliderColor2} ${this.xGradient*100}%)`;
        this.yColor = `linear-gradient(90deg, ${this.modifiedYColor} ${this.yGradient*100}%, ${this.ySliderColor2} ${this.yGradient*100}%)`;
        this.xSlider.style.background = this.xColor;
        this.ySlider.style.background = this.yColor;



        this.betweenTrialTextSize = Math.floor(this.GAME_WIDTH * 0.04);
        this.textMargin = Math.floor(this.GAME_WIDTH * 0.02);
        this.sliderTextSize = Math.floor(this.GAME_WIDTH * 0.037);
        // X slider texts:
        // Min:
        this.xMinText = new TextBox(this, (this.xSliderRect.x - this.textMargin),
            (this.xSliderRect.y + this.xSliderRect.height), this.xSlider.min, "end", this.sliderTextSize);
        this.sliderInfo.push(this.xMinText);
        // Max:
        this.xMaxText = new TextBox(this, (this.xSliderRect.right + this.textMargin),
            (this.xSliderRect.y + this.xSliderRect.height), this.xSlider.max, "start", this.sliderTextSize);
        this.sliderInfo.push(this.xMaxText);
        // Value:
        this.xValueText = new TextBox(this, (this.xSliderRect.right - Math.floor(this.xSliderRect.width/2)),
            this.xSliderRect.y - this.textMargin, this.xSlider.value, "center", this.sliderTextSize);
        this.sliderInfo.push(this.xValueText);


        // Y slider texts:
        // Min:
        this.yMinText = new TextBox(this, (this.ySliderRect.x - this.textMargin),
            (this.ySliderRect.y + this.ySliderRect.height), this.ySlider.min, "end", this.sliderTextSize);
        this.sliderInfo.push(this.yMinText);
        // Max:
        this.yMaxText = new TextBox(this, (this.ySliderRect.right + this.textMargin),
            (this.ySliderRect.y + this.ySliderRect.height), this.ySlider.max, "start", this.sliderTextSize);
        this.sliderInfo.push(this.yMaxText);
        // Value:

        this.yValueText = new TextBox(this, (this.ySliderRect.right - Math.floor(this.ySliderRect.width/2)),
            this.ySliderRect.y - this.textMargin, this.ySlider.value, "center", this.sliderTextSize);
        this.sliderInfo.push(this.yValueText);


        this.miscText = [];

        this.rewardTextColor = "244, 79, 52";
        this.rewardTextSize = Math.floor(this.GAME_WIDTH*0.07);
        this.rewardText = new RewardText(this, this.GAME_WIDTH/2, this.GAME_HEIGHT/2,
             0, "center", this.rewardTextSize, true, this.rewardTextColor);

        this.miscText.push(this.rewardText);

        this.totalRewardTextColor = "255, 190, 0"///"102, 94, 201";
        this.totalRewardTextSize = Math.floor(this.GAME_WIDTH*0.025);
        this.totalRewardText = new TextBox(this, this.btnLeft, this.GAME_HEIGHT*0.65,
             `Total $: 0`, "left", this.totalRewardTextSize, false, this.totalRewardTextColor);
        this.miscText.push(this.totalRewardText);


        this.trialTextColor = this.totalRewardTextColor;
        this.trialTextSize = this.totalRewardTextSize;
        this.trialText = new TextBox(this, this.btnLeft, this.GAME_HEIGHT*0.55,
             `Customers left: 3`, "left", this.trialTextSize, false, this.trialTextColor);
        this.miscText.push(this.trialText);
        //////////////////////

        this.loadImages()


        // Assign images to the ingredients
        this.xIngredientImgs = this.allIngredients[0];
        this.yIngredientImgs = this.allIngredients[1];

        // create ingredients
        this.ingredientsX = Math.floor(this.GAME_WIDTH*0.0065)
        this.xIngredient = new Ingredient(this, this.ingredientsX, this.GAME_HEIGHT - 2* (this.GAME_WIDTH*0.15), this.xIngredientImgs);
        this.yIngredient = new Ingredient(this, this.ingredientsX, this.GAME_HEIGHT - this.xIngredient.width, this.yIngredientImgs);
        // this.xIngredient = new Ingredient(this, this.GAME_WIDTH*0.065, this.GAME_HEIGHT - 2* (this.GAME_WIDTH*0.15), this.xIngredientImgs);
        // this.yIngredient = new Ingredient(this, this.GAME_WIDTH*0.065, this.GAME_HEIGHT - this.xIngredient.width, this.yIngredientImgs);

        this.xRange = [0, 10];
        this.yRange = [0, 10];

        //////////////////////
        // this.tableImage = new Image();
        // this.tableImage.src = "assets_v2/tables/table.png"
        // this.tableList = [];
        // for (let i = 0; i < 3; i++) {
        //     this.tableList[i] = new Table(this, i+1, this.tableImage);
        // }
        this.numTables = 3;
        this.tableSlot = this.GAME_WIDTH/this.numTables
        this.tableList = [];
        for (let i = 0; i < this.numTables; i++) {
            this.tableList[i] = new Table(this, i+1, this.tableImage, this.tableSlot);
            //this.tableIndices.push(i)
        }


        this.alienList = [];
        this.alienFeatures = [[0, 0], [1, 1], [0, 0]]
        this.transform = [0, 1]
        this.inputDims = [0, 1]
        for (let i = 0; i < 3; i++) {
            this.features = this.alienFeatures[i];
            this.standing = this.allAlienImgs[0][i]
            this.currentRF = undefined//this.defineRewardFunction(this.features[0]);


            this.alien = new Alien(this, this.features, this.standing, this.allAlienImgs[1],
                 this.tableList[i], this.currentRF, this.currentRF, undefined, this.transform,
                this.inputDims);
            this.alienList.push(this.alien);
        }

        this.playerMoves = [];
        this.player = new Player(this, this.GAME_WIDTH, this.GAME_HEIGHT, this.tableList,
             this.playerImgs[0], this.playerImgs[1], this.playerImgs[2]);

        // If this is first cycle, create a new input handler, else stick to the old one

        this.inputHandler = new TutorialInputHandler(this);


    }
    changeSliderParams(xRange, yRange){


        this.xSliderMin = xRange[0];
        this.xMinText.change(this.xSliderMin)

        this.xSliderMax = xRange[1];
        this.xMaxText.change(this.xSliderMax);



        this.ySliderMin = yRange[0];
        this.yMinText.change(this.ySliderMin);

        this.ySliderMax = yRange[1];
        this.yMaxText.change(this.ySliderMax);


        this.xSlider.value = 0;
        this.ySlider.value = 0;
        this.xIngredient.update(this.xSlider.value);
        this.yIngredient.update(this.ySlider.value);

        this.xValueText.change(this.xSlider.value);
        this.yValueText.change(this.ySlider.value);


        if (this.xSliderMax == this.xSliderMin){
            this.xGradient = 0;
            this.yGradient = ((this.ySlider.value - this.ySlider.min)/(this.ySlider.max - this.ySlider.min));
            this.xSlider.style.opacity = 0.3;
            this.ySlider.style.opacity = 0.85;
            this.xIngredient.setNotAvailable();
        } else if(this.ySliderMax == this.ySliderMin){
            this.yGradient = 0;
            this.xGradient = ((this.xSlider.value - this.xSlider.min)/(this.xSlider.max - this.xSlider.min));
            this.xSlider.style.opacity = 0.85;
            this.ySlider.style.opacity = 0.3;
            this.yIngredient.setNotAvailable();
        } else {
            this.xGradient = ((this.xSlider.value - this.xSlider.min)/(this.xSlider.max - this.xSlider.min));
            this.yGradient = ((this.ySlider.value - this.ySlider.min)/(this.ySlider.max - this.ySlider.min));
            this.xSlider.style.opacity = 0.85;
            this.ySlider.style.opacity = 0.85;
            this.xIngredient.setAvailable()
            this.yIngredient.setAvailable()
        }

        this.modifiedXColor = this.xSliderColor1.slice(0, -2);
        this.modifiedXColor += `${this.xGradient})`;
        this.modifiedYColor = this.ySliderColor1.slice(0, -2);
        this.modifiedYColor += `${this.yGradient})`;

        this.xColor = `linear-gradient(90deg, ${this.modifiedXColor} ${this.xGradient*100}%, ${this.xSliderColor2} ${this.xGradient*100}%)`;
        this.yColor = `linear-gradient(90deg, ${this.modifiedYColor} ${this.yGradient*100}%, ${this.ySliderColor2} ${this.yGradient*100}%)`;
        this.xSlider.style.background = this.xColor;
        this.ySlider.style.background = this.yColor;

    }

    reshapeHTML(x_offset, y_offset){
        // Define dimensions of html elements after configuring canvas dimensions
        this.sliderWidth = Math.floor(this.GAME_WIDTH * 0.35);
        this.sliderHeight = Math.floor(this.GAME_HEIGHT * 0.03);
        this.sliderLeft = Math.floor(this.GAME_WIDTH/2) - Math.floor(this.sliderWidth/2) + x_offset;
        //this.sliderTop = Math.floor(this.GAME_HEIGHT - (this.slider)) + y_offset;
        this.btnWidth = Math.floor(this.GAME_WIDTH *0.2);
        this.btnHeight = Math.floor(this.GAME_HEIGHT * 0.2);
        this.btnLeft = Math.floor(this.GAME_WIDTH * 0.75) + x_offset;
        this.btnTop = Math.floor(this.GAME_HEIGHT * 0.7) + y_offset;



        this.xSlider.style.width = `${this.sliderWidth}px`;
        this.xSlider.style.height = `${this.sliderHeight}px`;
        this.xSlider.style.left = `${this.sliderLeft}px`;
        this.xSlider.style.top = `${Math.floor(this.GAME_HEIGHT - (10*this.sliderHeight)) + y_offset}px`;

        this.ySlider.style.width = `${this.sliderWidth}px`;
        this.ySlider.style.height = `${this.sliderHeight}px`;
        this.ySlider.style.left = `${this.sliderLeft}px`;
        this.ySlider.style.top = `${Math.floor(this.GAME_HEIGHT - (4*this.sliderHeight)) + y_offset}px`;

        this.submitButton.style.width = `${this.btnWidth}px`;
        this.submitButton.style.height = `${this.btnHeight}px`;
        this.submitButton.style.left = `${this.btnLeft}px`;
        this.submitButton.style.top = `${this.btnTop}px`;

        // Show html elements
        for (let element in this.htmlList){
            this.htmlList[element].style.display = "block";
        }


    }


    loadImages(){
        // method for loading images from folder

        // load table image

        this.tableImage = new Image();
        this.tableImage.src = "assets_v2/tables/table.png"

        // load ingredient imgs
        this.allIngredients = [];
        this.xIngredientImgs = []
        this.yIngredientImgs = []
        this.currentFolder = `tutorial_imgs`;
        for (let j = 0; j <= 15; j++){
            this.xIngredientImgs[j] = new Image();
            this.xIngredientImgs[j].src = `${this.currentFolder}/x/${j}.png`
        }
        for (let k = 0; k <= 15; k++){
            this.yIngredientImgs[k] = new Image();
            this.yIngredientImgs[k].src = `${this.currentFolder}/y/${k}.png`
        }
        this.allIngredients.push(this.xIngredientImgs)
        this.allIngredients.push(this.yIngredientImgs)


        // load alien imgs
        this.alienImgs = [];
        this.alienAnimationImgs = [];
        this.currentFolder = `tutorial_imgs/standing`;
        for (let j = 0; j < 3; j++){
            this.image = new Image()
            this.image.src = `${this.currentFolder}/${j}.png`;
            this.alienImgs.push(this.image);

        }
        this.currentFolder = `tutorial_imgs/animation`;
        for (let k = 1; k <= 4; k++){
            this.image = new Image()
            this.image.src = `${this.currentFolder}/alien_step${k}.png`;
            this.alienAnimationImgs.push(this.image);

        }
        this.allAlienImgs = [this.alienImgs, this.alienAnimationImgs];




        // load player imgs
        this.playerImgs = [];
        this.leftAnimations = [];
        this.rightAnimations = [];
        this.currentFolder = `assets_v2/player`;
        for (let i = 0; i < 9; i++){
            this.image = new Image();
            this.image.src = `${this.currentFolder}/${i}.png`
            if (i < 4){
                this.leftAnimations.push(this.image);
            } else if (i < 8) {
                this.rightAnimations.push(this.image);
            } else {
                this.playerImgs.push(this.image);
            }
        }
        this.playerImgs.push(this.leftAnimations);
        this.playerImgs.push(this.rightAnimations);

    }



    update(dt){
        // update method
        this.timer += dt;

        this.player.update(dt);

        for (let alien in this.alienList){
            this.alienList[alien].update(dt);
        }

        for (let sliderText in this.sliderInfo){
            this.sliderInfo[sliderText].update()
        }
        for (let miscInfo in this.miscText){
            this.miscText[miscInfo].update();
        }

        if (this.lastAlienServed && this.rewardText.hasFaded){
            for (let elem in this.htmlList){
                this.htmlList[elem].style.display = "none";
            }
            this.canvas.style.display = "none";
            this.run = false;
        }

        // } else if (this.currentGameState === this.GAMESTATES.BONUSROUND) {
        //     this.timer += dt;
        //     this.player.update(dt);
        //
        //     for (let alien in this.alienList){
        //         this.alienList[alien].update(dt);
        //     }
        //
        //     for (let sliderText in this.sliderInfo){
        //         this.sliderInfo[sliderText].update()
        //     }
        //     for (let miscInfo in this.miscText){
        //         this.miscText[miscInfo].update();
        //     }
        //
        //     if (this.lastAlienServed && this.rewardText.hasFaded){
        //         if (this.currentCycle == (this.totalCycles - 1)){
        //             this.currentGameState = this.GAMESTATES.FINISHED;
        //
        //             this.saveToDatabase()
        //
        //
        //         } else {
        //         this.currentGameState = this.GAMESTATES.BETWEENCYCLE;
        //         }
        //     }
        //
        // } else {
        //     this.betweenRoundTimer += dt;
        //     for (let elem in this.htmlList){
        //         this.htmlList[elem].style.display = "none";
        //     }
        // }
    }


    draw(ctx){
        // draw method

        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);


        // if (this.currentGameState === this.GAMESTATES.BONUSROUND){
        //     this.bonusRoundText.draw(ctx);
        // }

        for (let i = this.alienList.length - 1; i >= 0; i--){
            this.alienList[i].draw(ctx);
        }

        for(let table in this.tableList){
            this.tableList[table].draw(ctx);
        }

        this.player.draw(ctx);

        for (let textBox in this.sliderInfo){
            this.sliderInfo[textBox].draw(ctx);
        }

        for (let miscInfo in this.miscText){
            this.miscText[miscInfo].draw(ctx);
        }



        this.xIngredient.draw(ctx);
        this.yIngredient.draw(ctx);



        //  else if (this.currentGameState === this.GAMESTATES.BETWEENCYCLE) {
        //     //ctx.rect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        //     ctx.fillStyle = "rgb(27, 46, 56)";
        //     ctx.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        //
        //     ctx.font = `bold ${this.betweenTrialTextSize}px Arial`;
        //     ctx.fillStyle = "white";
        //     ctx.textAlign = "center";
        //     ctx.fillText(`You have finished task number ${this.currentCycle + 1}`,
        //      this.GAME_WIDTH / 2, this.GAME_HEIGHT *0.4);
        //      ctx.fillText(`You earned $${this.totalReward}!`,
        //       this.GAME_WIDTH / 2, this.GAME_HEIGHT * 0.5);
        //     ctx.fillText(`Please press ENTER to continue`,
        //       this.GAME_WIDTH / 2, this.GAME_HEIGHT *0.7);
        // } else {
        //     ctx.fillStyle = "rgb(27, 46, 56)";
        //     ctx.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        //
        //     ctx.font = `bold ${this.betweenTrialTextSize}px Arial`;
        //     ctx.fillStyle = "white";
        //     ctx.textAlign = "center";
        //     ctx.fillText("You have finished the experiment", this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
        // }

    }
}
