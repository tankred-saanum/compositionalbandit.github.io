import Player from './player.js'
import InputHandler from './input.js'
import Table from './table.js'
import Alien from './alien.js'
import TextBox from './textBox.js'
import RewardText from './rewardText.js'
import Ingredient from './ingredient.js'
import {linear, periodic, rbf, linearPeriodic, linearRbf, periodicRbf,
     getRandomInt, getRandomFloat} from './rewardFunctions.js'



export default class Game{
    constructor(width, height){

        // define canvas and its dimensions

        this.timer = 0;
        this.betweenRoundTimer = 0;

        this.canvas = document.getElementById("gameScreen");
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth //- 15;
        this.canvas.height = window.innerHeight //- 15;

        this.GAME_WIDTH = this.canvas.width;
        this.GAME_HEIGHT = this.canvas.height;

        // object to switch between game states
        this.GAMESTATES = {
            RUNNING: 1,
            BONUSROUND: 2,
            BETWEENCYCLE: 3,
            FINISHED: 4

        };

        // define object containing participant data, later to be saved as json

        this.participantData = {
            cycle: [],
            trials: [],
            moves: [],
            servedTable: [],
            alienFeatures: [],
            alternativeAliens: [],
            xValue: [],
            yValue: [],
            xRange: [],
            yRange: [],
            deliberationTime: [],
            reward: [],
            exploration: [],
            bonusTrial: [],
            betweenRoundTime: []
        }

        // Make background gradients for each cycle:
        //cycle 1:
        this.bgGradient1 = this.ctx.createLinearGradient(Math.floor(this.GAME_WIDTH/2), 0, Math.floor(this.GAME_WIDTH/2), this.GAME_HEIGHT);
        this.bgGradient1.addColorStop(0,"rgb(16, 6, 40)");
        this.bgGradient1.addColorStop(1, "rgb(223, 232, 255)");

        //cycle 2:
        this.bgGradient2 = this.ctx.createLinearGradient(Math.floor(this.GAME_WIDTH/2), 0, Math.floor(this.GAME_WIDTH/2), this.GAME_HEIGHT);
        this.bgGradient2.addColorStop(0,"rgb(0, 20, 32)");
        this.bgGradient2.addColorStop(1, "rgb(255, 181, 199)");
        // cycle 3
        this.bgGradient3 = this.ctx.createLinearGradient(Math.floor(this.GAME_WIDTH/2), 0, Math.floor(this.GAME_WIDTH/2), this.GAME_HEIGHT);
        this.bgGradient3.addColorStop(0,"rgb(40, 6, 6)");
        this.bgGradient3.addColorStop(1, "rgb(255, 222, 89)");

        this.gradientCycles = [this.bgGradient1, this.bgGradient2, this.bgGradient3];

        // Store HTML elements in variables and save in list//
        this.xSlider = document.getElementById("xSlider");
        this.ySlider = document.getElementById("ySlider");
        this.submitButton = document.getElementById("submitButton");
        this.htmlList = [this.xSlider, this.ySlider, this.submitButton];

        // reshape html elements
        this.reshapeHTML()

        // Define textboxes where min, max and current values of sliders are shown
        this.sliderInfo = [];

        this.xSliderRect = this.xSlider.getBoundingClientRect();
        this.ySliderRect = this.ySlider.getBoundingClientRect();

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
        this.totalRewardTextSize = Math.floor(this.GAME_WIDTH*0.03);
        this.totalRewardText = new TextBox(this, this.btnLeft, this.GAME_HEIGHT*0.65,
             `Total $: 0`, "left", this.totalRewardTextSize, false, this.totalRewardTextColor);
        this.miscText.push(this.totalRewardText);

        this.trialTextColor = this.totalRewardTextColor;
        this.trialTextSize = this.totalRewardTextSize;
        this.trialText = new TextBox(this, this.btnLeft, this.GAME_HEIGHT*0.55,
             `Trials left: 4`, "left", this.trialTextSize, false, this.trialTextColor);
        this.miscText.push(this.trialText);

        ///// Define slider colors/////
        this.xSliderColor1 = "rgba(255, 41, 41, 1)";
        this.xSliderColor2 = "rgba(5, 129, 250, 1)";
        this.ySliderColor1 = "rgba(255, 41, 41, 1)";
        this.ySliderColor2 = "rgba(5, 129, 250, 1)";





        // Define how many cycles, i.e. the number of consecutive bandit tasks.
        // create helper variable to store player moves, and exploration
        this.currentCycle = 0;
        this.totalCycles = 3;
        this.playerMoves = [];
        this.highscores = {
            symbol1: [0, undefined, undefined],
            symbol2: [0, undefined, undefined],
            compositional: [0, undefined, undefined]
        }


        /// Define parameters for reward functions in all cycles///
        // parameters for linear function
        this.linearParamsCycle1 = [3, 0.8] // intercept and beta coefficient
        this.linearParamsCycle2 = [13, -1.2]
        this.linearParamsCycle3 = [5, 1.3]

        this.linearParams = [this.linearParamsCycle1, this.linearParamsCycle2, this.linearParamsCycle3]
        // parameters for periodic function
        this.periodicParamsCycle1 = [6, 10, 3, 1.4]; // 0: intercept, 1: beta (smoothness), 2: shift, 3: cycle length
        this.periodicParamsCycle2 = [18, 11, 4, 2];
        this.periodicParamsCycle3 = [18, 11, 4, 2];

        // rbf parameters
        this.rbfParams = [9, 17, 0.7, 6];

        this.allParameters = [[this.linearParamsCycle1, this.periodicParamsCycle1],
            [this.linearParamsCycle2, this.periodicParamsCycle2], [[this.linearParamsCycle3, this.periodicParamsCycle3], this.rbfParams]];

        // define which reward functions should appear in which cycle
        this.rfCycle1 = [linear, periodic];
        this.rfCycle2 = [linear, periodic];
        this.rfCycle3 = [linearPeriodic, rbf];

        this.allRewardFunctions = [this.rfCycle1, this.rfCycle2, this.rfCycle3];

        // Pre load images with loadImages method.
        this.loadImages();


    }

    reshapeHTML(){
        // Define dimensions of html elements after configuring canvas dimensions
        this.sliderWidth = Math.floor(this.GAME_WIDTH * 0.35);
        this.sliderHeight = Math.floor(this.GAME_HEIGHT * 0.03);
        this.sliderLeft = Math.floor(this.GAME_WIDTH/2) - Math.floor(this.sliderWidth/2);
        this.sliderTop = Math.floor(this.GAME_HEIGHT - (this.slider));
        this.btnWidth = Math.floor(this.GAME_WIDTH *0.2);
        this.btnHeight = Math.floor(this.GAME_HEIGHT * 0.2);
        this.btnLeft = Math.floor(this.GAME_WIDTH * 0.75);
        this.btnTop = Math.floor(this.GAME_HEIGHT * 0.7);



        this.xSlider.style.width = `${this.sliderWidth}px`;
        this.xSlider.style.height = `${this.sliderHeight}px`;
        this.xSlider.style.left = `${this.sliderLeft}px`;
        this.xSlider.style.top = `${Math.floor(this.GAME_HEIGHT - (10*this.sliderHeight))}px`;

        this.ySlider.style.width = `${this.sliderWidth}px`;
        this.ySlider.style.height = `${this.sliderHeight}px`;
        this.ySlider.style.left = `${this.sliderLeft}px`;
        this.ySlider.style.top = `${Math.floor(this.GAME_HEIGHT - (4*this.sliderHeight))}px`;

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
        this.tableImage.src = "assets/tables/table.png"

        // load ingredient imgs
        this.allIngredients = [];
        for (let i = 0; i < this.totalCycles; i++){
            this.xIngredientImgs = []
            this.yIngredientImgs = []
            this.currentFolder = `assets/ingredients/cycle${i}`;
            for (let j = 0; j <= 15; j++){
                this.xIngredientImgs[j] = new Image();
                this.xIngredientImgs[j].src = `${this.currentFolder}/x/${j}.png`
            }
            for (let k = 0; k <= 15; k++){
                this.yIngredientImgs[k] = new Image();
                this.yIngredientImgs[k].src = `${this.currentFolder}/y/${k}.png`
            }
            this.allIngredients[`cycle${i}`] = [this.xIngredientImgs, this.yIngredientImgs];

        }

        // load alien imgs
        this.allAlienImgs = []
        for (let i = 0; i < this.totalCycles; i++){
            this.alienImgs = [];
            this.alienAnimationImgs = [];
            this.currentFolder = `assets/aliens/cycle${i}/standing`;
            for (let j = 0; j < 10; j++){
                this.image = new Image()
                this.image.src = `${this.currentFolder}/${j}.png`;
                this.alienImgs.push(this.image);

            }
            this.currentFolder = `assets/aliens/cycle${i}/animation`;
            for (let k = 1; k <= 4; k++){
                this.image = new Image()
                this.image.src = `${this.currentFolder}/alien_step${k}.png`;
                this.alienAnimationImgs.push(this.image);

            }
            this.allAlienImgs[`cycle${i}`] = [this.alienImgs, this.alienAnimationImgs];

        }

        // load player imgs
        this.playerImgs = [];
        this.leftAnimations = [];
        this.rightAnimations = [];
        this.currentFolder = `assets/player`;
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

    startNewGame(){
        // creates the tables, as well as the first 3 aliens to start off the
        // game:

        this.currentGameState = this.GAMESTATES.RUNNING;
        this.bonusTrial = false;

        for (let elem in this.htmlList){
            this.htmlList[elem].style.display = "block";
        }

        this.lastAlienServed = false;


        // define game settings
        this.totalReward = 0;
        this.reward = 0;
        this.totalTrials = 30;
        this.trialsSymbol1 = Math.floor(this.totalTrials/3);
        this.trialsSymbol2 = Math.floor(this.totalTrials/3);
        this.trialsCompositional = this.totalTrials - (this.trialsSymbol1 + this.trialsSymbol2);
        this.trialMargin = Math.floor(this.totalTrials/8);
        this.trialList = [this.trialsSymbol1, this.trialsSymbol2, this.trialsCompositional];
        this.specialTrials = 20;
        this.noXTrials = 2;
        this.noXTrialNumbers = [5, 9];
        this.noYTrials = 2;
        this.noYTrialNumbers = [3, 7];
        this.currentTrial = 0;

        // set background to the right color gradient, depending on current cycle
        this.background = this.gradientCycles[this.currentCycle]


        // Assign images to the ingredients
        this.xIngredientImgs = this.allIngredients[`cycle${this.currentCycle}`][0];
        this.yIngredientImgs = this.allIngredients[`cycle${this.currentCycle}`][1];

        // create ingredients
        this.xIngredient = new Ingredient(this, this.GAME_WIDTH*0.065, this.GAME_HEIGHT - 2* (this.GAME_WIDTH*0.15), this.xIngredientImgs);
        this.yIngredient = new Ingredient(this, this.GAME_WIDTH*0.065, this.GAME_HEIGHT - this.xIngredient.width, this.yIngredientImgs);

        // assign images to aliens
        this.currentAlienImgs = this.allAlienImgs[`cycle${this.currentCycle}`];


        //Configure sliders

        this.xRange = [0, 10];
        this.yRange = [0, 10];
        this.xSlider.min = this.xRange[0];
        this.xSlider.max = this.xRange[1];
        this.ySlider.min = this.yRange[0];
        this.ySlider.max = this.yRange[1];
        this.xSlider.value = 0;
        this.ySlider.value = 0;
        this.changeSliderParams(this.xRange, this.yRange);

        //
        // this.xIngredient.update(this.xSlider.value);
        // this.yIngredient.update(this.ySlider.value);

        this.xValueText.change(this.xSlider.value);
        this.yValueText.change(this.ySlider.value);

        // reset trial and reward texts
        this.totalRewardText.change(`Total $: ${this.totalReward}`);
        this.trialText.change(`Trials left: ${this.totalTrials - this.currentTrial}`);


        // create tables and first 3 aliens
        this.tableList = [];
        for (let i = 0; i < 3; i++) {
            this.tableList[i] = new Table(this, i+1, this.tableImage);
        }


        this.alienList = [];
        for (let i = 0; i < 3; i++) {
            this.features = this.generateRandomAlien();
            this.currentRF = this.defineRewardFunction(this.features[0]);

            this.alien = new Alien(this, this.features[0], this.features[1], this.currentAlienImgs[1],
                 this.tableList[i], this.currentRF[0], this.currentRF[1]);
            this.alienList.push(this.alien);
        }


        this.player = new Player(this, this.GAME_WIDTH, this.GAME_HEIGHT, this.tableList,
             this.playerImgs[0], this.playerImgs[1], this.playerImgs[2]);

        // If this is first cycle, create a new input handler, else stick to the old one
        if (this.currentCycle == 0){
            this.inputHandler = new InputHandler(this);
        }


    }


    defineRewardFunction(features){

        if (features[0] == 0){
            // Give first function for this cycle and appropriate parameters
            this.function1 = this.allRewardFunctions[this.currentCycle][0];
            this.params1 = this.allParameters[this.currentCycle][0];
        } else {
            // Give second rf and appropriate params
            this.function1 = this.allRewardFunctions[this.currentCycle][1];
            this.params1 = this.allParameters[this.currentCycle][1];
        }
        if (features.length > 2){
            // If this alien has more than 1 symbol
            if (features[2] == 0){
                // Give appropriate rf and params
                this.function2 = this.allRewardFunctions[this.currentCycle][0];
                this.params2 = this.allParameters[this.currentCycle][0];
            }else {
                this.function2 = this.allRewardFunctions[this.currentCycle][1];
                this.params2 = this.allParameters[this.currentCycle][1];
            }
            return [[this.function1, this.function2], [this.params1, this.params2]]
        }
        return [[this.function1], [this.params1]]

    }

    generateRandomAlien(){
        // procedure for generating aliens with a set of features randomly,
        // depending on the number of trials left for each alien type. Returns
        // alien features as a list of 0's and 1's.

        // this list contains all combinations of symbols and colors, 0 meaning first symbol/color, 1 meaning second symbol/color
        this.alienCombinations = [[0, 0], [0, 1], [1, 0], [1, 1], [0, 0, 1, 1],
         [0, 1, 1, 0], [0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 1], [1, 1, 1, 0]];

        if (this.trialList[0] > this.trialMargin){
            this.combinationsIndex = getRandomInt(0, 1);
            this.alienType = this.alienCombinations[this.combinationsIndex];
            // if (this.combinationsIndex >= 2){
            //     this.trialList[1] -= 1;
            // } else {
            this.trialList[0] -= 1;



        } else if (this.trialList[0] != 0) {
            if (this.trialList[1] != 0){
                this.combinationsIndex = getRandomInt(0, 3);
            } else {
                this.combinationsIndex = getRandomInt(0, 1);
            }

            this.alienType = this.alienCombinations[this.combinationsIndex];
            if (this.combinationsIndex >= 2){
                this.trialList[1] -= 1;
            } else {
                this.trialList[0] -= 1;
            }
        } else if (this.trialList[1] > this.trialMargin) {
            this.combinationsIndex = getRandomInt(2, 3);
            this.alienType = this.alienCombinations[this.combinationsIndex];
            this.trialList[1] -= 1;
        } else if (this.trialList[1] != 0) {
            if (this.trialList[2] != 0){
                this.combinationsIndex = getRandomInt(2, this.alienCombinations.length - 1);
            } else {
                this.combinationsIndex = getRandomInt(2, 3);
            }

            this.alienType = this.alienCombinations[this.combinationsIndex];
            if (this.combinationsIndex <= 3){
                this.trialList[1] -= 1;
            } else {
                this.trialList[2] -= 1;
            }
        } else {
            this.combinationsIndex = getRandomInt(4, this.alienCombinations.length - 1);
            this.alienType = this.alienCombinations[this.combinationsIndex];
        }


        //
        //  else if (this.trialList[0] != 0 || this.trialList[1] != 0) {
        //     if (this.trialList[0] == 0){
        //         this.combinationsIndex = getRandomInt(2, this.alienCombinations.length - 1);
        //     } else if (this.trialList[1] == 0) {
        //         this.combinationsIndex = getRandomInt(0, this.alienCombinations.length - 3);
        //         if (this.combinationsIndex >= 2){
        //             this.combinationsIndex += 2;
        //         }
        //     } else {
        //         this.combinationsIndex = getRandomInt(0, this.alienCombinations.length - 1)
        //
        //     }
        //
        //
        //     this.alienType = this.alienCombinations[this.combinationsIndex];
        //
        //     if (this.combinationsIndex >= 4){
        //         this.trialList[2] -= 1;
        //     } else if (this.combinationsIndex >= 2) {
        //         this.trialList[1] -= 1;
        //     } else {
        //         this.trialList[0] -= 1;
        //     }
        //
        // } else {
        //
        //     this.combinationsIndex = getRandomInt(4, this.alienCombinations.length - 1);
        //     this.alienType = this.alienCombinations[this.combinationsIndex];
        //
        // }

        this.alienFeatures = this.alienType;
        this.alienImage = this.currentAlienImgs[0][this.combinationsIndex];
        return [this.alienFeatures, this.alienImage]



    }

    createRandomRange(noIngredient){
        // creates a random range
        if (noIngredient){
            this.min = 0;
            this.max = 0;
        } else {
            this.min = getRandomInt(0, 3)
            this.max = getRandomInt(8, 10)

        }

        return [this.min, this.max];

    }


    changeSliderParams(xRange, yRange){


        this.xSliderMin = xRange[0];
        this.xMinText.change(this.xSliderMin)

        this.xSliderMax = xRange[1];
        this.xMaxText.change(this.xSliderMax);
        if (this.xSlider.value < this.xSliderMin){
            this.xSlider.value = this.xSliderMin;
        } else if (this.xSlider.value > this.xSliderMax) {
            this.xSlider.value = this.xSliderMax;
        }


        this.ySliderMin = yRange[0];
        this.yMinText.change(this.ySliderMin);

        this.ySliderMax = yRange[1];
        this.yMaxText.change(this.ySliderMax);

        if (this.ySlider.value < this.ySliderMin){
            this.ySlider.value = this.ySliderMin;
        } else if (this.ySlider.value > this.ySliderMax) {
            this.ySlider.value = this.ySliderMax;
        }


        this.xIngredient.update(this.xSlider.value);
        this.yIngredient.update(this.ySlider.value);

        this.xValueText.change(this.xSlider.value);
        this.yValueText.change(this.ySlider.value);


        if (this.xSliderMax == this.xSliderMin){
            this.xGradient = 0;
            this.yGradient = ((this.ySlider.value - this.ySlider.min)/(this.ySlider.max - this.ySlider.min));
            this.xSlider.style.opacity = 0.3;
            this.ySlider.style.opacity = 0.85;
        } else if(this.ySliderMax == this.ySliderMin){
            this.yGradient = 0;
            this.xGradient = ((this.xSlider.value - this.xSlider.min)/(this.xSlider.max - this.xSlider.min));
            this.xSlider.style.opacity = 0.85;
            this.ySlider.style.opacity = 0.3;
        } else {
            this.xGradient = ((this.xSlider.value - this.xSlider.min)/(this.xSlider.max - this.xSlider.min));
            this.yGradient = ((this.ySlider.value - this.ySlider.min)/(this.ySlider.max - this.ySlider.min));
            this.xSlider.style.opacity = 0.85;
            this.ySlider.style.opacity = 0.85;
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




    newTrial() {
        // Creates a new trial with a new Alien whose features are pseudo-randomly
        // generated. It also pseudorandomly decides whether or not the trial
        // is going to be special, and if it is, what the new range for x,y values will be

        if (this.totalTrials - this.currentTrial > 2){
            this.newAlienFeatures = this.generateRandomAlien();
            this.currentRF = this.defineRewardFunction(this.newAlienFeatures[0]); // assign reward functions and parameters
            this.newAlien = new Alien(this, this.newAlienFeatures[0],
                this.newAlienFeatures[1], this.currentAlienImgs[1], this.player.currentTarget, this.currentRF[0], this.currentRF[1]);
            this.alienList.push(this.newAlien); // append to alienList
        }

        // procedure for defining whether trial is special or not.
        if (this.noXTrialNumbers.includes(this.currentTrial)){
            this.noX = true;
            this.noY = false;
            this.trialIsSpecial = 1;
        } else if (this.noYTrialNumbers.includes(this.currentTrial)) {
            this.noX = false;
            this.noY = true;
            this.trialIsSpecial = 1;
        } else if (this.specialTrials > 0) {
            this.noX = false;
            this.noY = false;
            this.trialIsSpecial = getRandomInt(0, 1);
        }

        if (this.trialIsSpecial == 1){
            this.specialTrials -= 1;
            this.xRange = this.createRandomRange(this.noX);
            this.yRange = this.createRandomRange(this.noY);
        } else {
            this.xRange = [0, 10];
            this.yRange = [0, 10];
        }

        this.changeSliderParams(this.xRange, this.yRange);
    }

    bonusRound(){

        this.bonusTrial = true;

        this.lastAlienServed = false;
        this.currentTrial = 0;
        this.totalTrials = 3;
        this.bonusFeaturesList = [[0, 0], [1, 1], [0, 0, 1, 1]];
        this.imageIndices = [0, 3, 4]
        for (let i = 0; i < 3; i++){
            this.currentImageIndex = this.imageIndices[i];
            this.standingImg = this.currentAlienImgs[0][this.currentImageIndex];
            this.currentRF = this.defineRewardFunction(this.bonusFeaturesList[i]);
            this.bonusAlien = new Alien(this, this.bonusFeaturesList[i], this.standingImg,
                 this.currentAlienImgs[1], this.tableList[i], this.currentRF[0], this.currentRF[1]);
            this.alienList.push(this.bonusAlien);

        }




        this.bonusXRange = [10, 15];
        this.bonusYRange = this.bonusXRange;

        this.xSlider.min = this.bonusXRange[0];
        this.xSlider.max = this.bonusXRange[1];
        this.ySlider.min = this.bonusYRange[0];
        this.ySlider.max = this.bonusYRange[1];

        this.changeSliderParams(this.bonusXRange, this.bonusYRange);

        this.bonusTextSize = Math.floor(this.GAME_WIDTH * 0.08);
        this.bonusRoundText = new TextBox(this, this.GAME_WIDTH/2, this.GAME_HEIGHT*0.2, "BONUS ROUND!",
                    "center", 120, false, "187, 205, 221")


    }


    saveTrialData(currentAlien, xVal, yVal){


        this.participantData.cycle.push(this.currentCycle);
        this.participantData.trials.push(this.currentTrial);
        this.participantData.moves.push(this.playerMoves);
        this.playerMoves = [];
        this.participantData.servedTable.push(this.player.targetIndex);
        this.participantData.alienFeatures.push(currentAlien.features);
        if (this.player.targetIndex == 1){
            this.participantData.alternativeAliens.push([this.tableList[0].currentCustomer.features, this.tableList[2].currentCustomer.features])
        } else if (this.player.targetIndex == 0) {
            this.participantData.alternativeAliens.push([this.tableList[1].currentCustomer.features, this.tableList[2].currentCustomer.features])
        } else {
            this.participantData.alternativeAliens.push([this.tableList[0].currentCustomer.features, this.tableList[1].currentCustomer.features])
        }
        this.participantData.xValue.push(xVal);
        this.participantData.yValue.push(yVal);
        this.participantData.xRange.push(this.xRange);
        this.participantData.yRange.push(this.yRange);
        this.participantData.deliberationTime.push(this.timer);
        this.participantData.reward.push(this.reward);
        this.participantData.exploration.push([currentAlien.xExploration, currentAlien.yExploration, currentAlien.exploration]);
        this.participantData.bonusTrial.push(this.bonusTrial);

        console.log(this.participantData);





    }

    update(dt){
        // update method
        if (this.currentGameState === this.GAMESTATES.RUNNING){
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
                this.currentGameState = this.GAMESTATES.BONUSROUND;
                this.bonusRound()
            }

        } else if (this.currentGameState === this.GAMESTATES.BONUSROUND) {
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
                if (this.currentCycle == (this.totalCycles - 1)){
                    this.currentGameState = this.GAMESTATES.FINISHED;
                } else {
                this.currentGameState = this.GAMESTATES.BETWEENCYCLE;
                }
            }

        } else {
            this.betweenRoundTimer += dt;
            for (let elem in this.htmlList){
                this.htmlList[elem].style.display = "none";
            }
        }
    }


    draw(ctx){
        // draw method
        if (this.currentGameState === this.GAMESTATES.RUNNING || this.currentGameState === this.GAMESTATES.BONUSROUND){
            this.ctx.fillStyle = this.background;
            this.ctx.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);


            if (this.currentGameState === this.GAMESTATES.BONUSROUND){
                this.bonusRoundText.draw(ctx);
            }

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



        } else if (this.currentGameState === this.GAMESTATES.BETWEENCYCLE) {
            //ctx.rect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
            ctx.fillStyle = "rgb(27, 46, 56)";
            ctx.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

            ctx.font = `bold ${this.betweenTrialTextSize}px Arial`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`You have finished task number ${this.currentCycle + 1}`,
             this.GAME_WIDTH / 2, this.GAME_HEIGHT *0.4);
             ctx.fillText(`You earned $${this.totalReward}!`,
              this.GAME_WIDTH / 2, this.GAME_HEIGHT * 0.5);
            ctx.fillText(`Please press ENTER to continue`,
              this.GAME_WIDTH / 2, this.GAME_HEIGHT *0.7);
        } else {
            ctx.fillStyle = "rgb(27, 46, 56)";
            ctx.fillRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

            ctx.font = `bold ${this.betweenTrialTextSize}px Arial`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("You have finished the experiment", this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
        }

    }
}
