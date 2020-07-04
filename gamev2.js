import Player from './player.js'
import InputHandler from './input.js'
import Table from './table.js'
import Alien from './alien.js'
import TextBox from './textBox.js'
import RewardText from './rewardText.js'
import Ingredient from './ingredient.js'
import {linear, periodic, rbf, sawtooth, linearPeriodic, linearRbf, periodicRbf} from './rewardFunctions.js'
import {getRandomInt, getRandomFloat, shuffle, listToMatrix} from './utils.js'



export default class Game{
    constructor(ref){

        // define canvas and its dimensions

        //this.database = database;
        this.ref = ref;

        this.timer = 0;
        this.betweenRoundTimer = 0;

        this.canvas = document.getElementById("gameScreen");
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth //- 15;
        this.canvas.height = window.innerHeight //- 15;
        this.canvas.style.left = `0px`
        this.canvas.style.top = `0px`
        this.canvas.style.display = "block";

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

        this.generalData = {
            age:undefined,
            gender:undefined,
            betweenRoundTime: [],
            rewardTransformations: [],

        }
        this.participantData = {
            cycle: [],
            trials: [],
            moves: [],
            servedTable: [],
            alienFeatures: [],
            alternativeAliens: [],
            waitingTimes: [],
            xValue: [],
            yValue: [],
            xRange: [],
            yRange: [],
            deliberationTime: [],
            untransformedReward: [],
            reward: [],
            exploration: [],
            bonusTrial: [],
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



        this.gradientCycles = [this.bgGradient1, this.bgGradient2, this.bgGradient3, this.bgGradient1, this.bgGradient2];

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
        this.totalRewardTextSize = Math.floor(this.GAME_WIDTH*0.025);
        this.totalRewardText = new TextBox(this, this.btnLeft, this.GAME_HEIGHT*0.65,
             `Total $: 0`, "left", this.totalRewardTextSize, false, this.totalRewardTextColor);
        this.miscText.push(this.totalRewardText);

        this.trialTextColor = this.totalRewardTextColor;
        this.trialTextSize = this.totalRewardTextSize;
        this.trialText = new TextBox(this, this.btnLeft, this.GAME_HEIGHT*0.55,
             `Customers left: 4`, "left", this.trialTextSize, false, this.trialTextColor);
        this.miscText.push(this.trialText);

        ///// Define slider colors/////
        this.xSliderColor1 = "rgba(255, 41, 41, 1)";
        this.xSliderColor2 = "rgba(5, 129, 250, 1)";
        this.ySliderColor1 = "rgba(255, 41, 41, 1)";
        this.ySliderColor2 = "rgba(5, 129, 250, 1)";


        ///////////////////////////////////////

        //// indexed by cycle. once in a cycle search for array within array of arrays
        this.c1Combinations = [[[0, 0]], [[1, 1]],[[0, 0]], [[1, 1]], [[0, 0, 1, 1]]];
        this.c2Combinations = [[[0, 0]], [[1, 1]], [[0, 0, 1, 1]]];
        this.c3Combinations = [[[0, 0]], [[1, 1]], [[0, 0, 1, 1]]];
        this.c4Combinations = [[[0, 0], [0, 1]], [[1, 1]], [[0, 1, 1, 1], [0, 0, 0, 1]]];
        this.c5Combinations = [[[0, 0]], [[1, 1], [1, 0]], [[0, 0, 1, 0], [1, 0, 1, 1]]];


        this.imagesMasterList = ["0,0", "0,1", "1,0", "1,1", "0,0,1,1",
         "0,1,1,0", "0,0,1,0", "0,1,1,1", "0,0,0,1", "1,0,1,1"]


        this.compStructures = ["additive","additive","additive","additive","additive",]

        this.allAlienCombinations = [this.c1Combinations, this.c2Combinations,
             this.c3Combinations, this.c4Combinations, this.c5Combinations];

        //// counterbalance c2 and c3 cycles:
        // this.allAlienCombinations = this.counterBalance(this.allAlienCombinations, 1, 2);



        this.c1Bonus = [[0, 0], [1, 1], [0, 0, 1, 1]];
        this.c2Bonus = [[0, 0], [1, 1], [0, 0, 1, 1]];
        this.c3Bonus = [[0, 0], [1, 1], [0, 0, 1, 1]];
        this.c4Bonus = [[0, 0], [0, 1], [0, 1, 1, 1]];
        this.c5Bonus = [[1, 0], [1, 1], [0, 0, 1, 0]];

        this.allBonusCombinations = [this.c1Bonus, this.c2Bonus, this.c3Bonus, this.c4Bonus, this.c5Bonus]

        this.imagesMasterList = ["0,0", "0,1", "1,0", "1,1", "0,0,1,1",
         "0,1,1,0", "0,0,1,0", "0,1,1,1", "0,0,0,1", "1,0,1,1"]


        // for (let i = 0; i < this.allAlienCombinations.length; i ++){
        //     this.combList = this.allAlienCombinations[i];
        //     this.entry = []
        //     for (let j = 0; j < this.combList.length; j++){
        //         for (let k = 0; k < this.combList[j].length; k++){
        //             this.item = this.combList[j][k];
        //             this.item = this.item.join();
        //             this.entry.push(this.item);
        //         }
        //
        //     }
        //     this.imagesMasterList.push(this.entry);
        //
        // }



        for (let i = 0; i < this.allAlienCombinations.length; i++){
            if (this.allAlienCombinations[i].length == 3){
                this.allAlienCombinations[i] = this.counterBalance(this.allAlienCombinations[i], 0, 1)
            } else if(this.allAlienCombinations[i].length == 5) {
                this.flip = getRandomInt();
                if (this.flip == 1){
                    this.allAlienCombinations[i] = this.swap(this.allAlienCombinations[i], 0, 1)
                    this.allAlienCombinations[i] = this.swap(this.allAlienCombinations[i], 2, 3)
                }
                // Another routine for shuffling subset of larger alienCombinations
                // this.indices = [];
                // this.combinationsCopy = [...this.allAlienCombinations[i]];// copy array without referencing with spread operator
                // // the last bulk is always compositional, so we do not include it in indices to be swapped
                // for (let j = 0; j < this.allAlienCombinations[i].length - 1; j++){
                //     this.indices.push(j)
                // }
                // this.iterLength = this.indices.length;
                // for (let j = 0; j < this.iterLength; j++){
                //     this.randPickIdx = getRandomInt(0, this.indices.length - 1);
                //     this.randPick = this.indices[this.randPickIdx];
                //     this.allAlienCombinations[i][this.randPick] = this.combinationsCopy[j];
                //     this.indices.splice(this.randPickIdx, 1);
                //
                // }
            }
        }

        this.trialsInCycle = [100, 75, 75, 90, 90];
        this.numSimultaneousAliens = 3;

        this.symbolTrialsPerCycle = []

        for (let i = 0; i < this.trialsInCycle.length; i++){
            this.numTrials = Math.floor(this.trialsInCycle[i]/this.allAlienCombinations[i].length)
            this.symbolTrials = []

            for (let j = 0; j < this.allAlienCombinations[i].length; j++){
                this.typeTrials = [];
                this.typeNumTrials = Math.floor(this.numTrials/this.allAlienCombinations[i][j].length)

                for (let k = 0; k < this.allAlienCombinations[i][j].length; k++){
                    if(k == this.allAlienCombinations[i][j].length - 1){
                        this.typeTrials.push(this.numTrials - (this.typeNumTrials*k));
                    }else {
                        this.typeTrials.push(this.typeNumTrials);
                    }

                }

                //this.symbolTrials.push(this.numTrials)
                this.symbolTrials.push(this.typeTrials);
            }
            this.symbolTrialsPerCycle.push(this.symbolTrials)
        }



        //////////////////////////////////////


        // Define how many cycles, i.e. the number of consecutive bandit tasks.
        // create helper variable to store player moves, and exploration
        // make this a dictionary keeping track of all contexts
        // // TODO:
        this.currentCycle = 0;
        this.totalCycles = this.allAlienCombinations.length;
        this.playerMoves = [];



        /// Define parameters for reward functions in all cycles///

        // parameters for linear function
        this.linearParamsCycle1 = [0, 1.1] // intercept and beta coefficient
        this.linearParamsCycle2 = [0, 1.3]
        this.linearParamsCycle3 = [0, 0.9]
        this.linearParamsCycle4 = [0, 1.2]
        this.linearParamsCycle5 = [0, 1.1]


        this.periodicParamsCycle1 = [6, 10, 3, 1.4]; // 0: intercept, 1: beta, 2: shift, 3: cycle length
        this.periodicParamsCycle2 = [5, 5, 0, 0.5];
        this.periodicParamsCycle3 = [18, 11, 4, 2];

        // sawtooth parameters

        this.sawtoothParams = [5, 4]  // intercept and beta

        // rbf parameters
        this.rbfParams = [0, 10, 2.6, 7]; // -2 intercept, beta = 12, lengthscale = 2.6, optimum = 7

        this.allParameters = [
            [this.linearParamsCycle1, this.periodicParamsCycle2],
            [this.linearParamsCycle2, this.periodicParamsCycle2],
            [this.linearParamsCycle3, this.periodicParamsCycle2],
            [this.linearParamsCycle4, this.periodicParamsCycle2],
            [this.linearParamsCycle5, this.periodicParamsCycle2]
        ];


        // define which reward function the symbols apply to
        this.rfIndex1 = getRandomInt(0, 1); // defines which rf the star applies to
        this.rfIndex2 = 1 - this.rfIndex1;  // defines which rf the triangle applies to
        this.generalData.s1RF = this.rfIndex1;
        this.generalData.s2RF = this.rfIndex2;
        this.c1InputDim = getRandomInt(0, 1);  // defines which dimension red applies to
        this.c2InputDim = 1 - this.c1InputDim; // defines which dimension blue applies to
        this.colorInputDims = [this.c1InputDim, this.c2InputDim];


        this.generalData.colorInputDims = this.colorInputDims

        // define which reward functions should appear in which cycle

        this.rfCycle1 = [linear, periodic];
        this.rfCycle2 = [linear, periodic];
        this.rfCycle3 = [linear, periodic];
        this.rfCycle4 = [linear, periodic];
        this.rfCycle5 = [linear, periodic];


        this.allRewardFunctions = [this.rfCycle1, this.rfCycle2, this.rfCycle3, this.rfCycle4, this.rfCycle5];

        // Pre load images with loadImages method.
        this.loadImages();


    }

    counterBalance(arr, indexA, indexB){

        //shuffle method:
        this.shufflePositions = getRandomInt(0, 1);

        if (this.shufflePositions == 1){
            this.temporary = arr[indexA];
            arr[indexA] = arr[indexB];
            arr[indexB] = this.temporary;
        }
        return arr


    }

    swap(arr, indexA, indexB){

        //shuffle method:


        this.temporary = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = this.temporary;

        return arr


    }


    reshapeHTML(){
        // Define dimensions of html elements after configuring canvas dimensions
        this.sliderWidth = Math.floor(this.GAME_WIDTH * 0.35);
        this.sliderHeight = Math.floor(this.GAME_HEIGHT * 0.03);
        this.sliderLeft = Math.floor(this.GAME_WIDTH/2) - Math.floor(this.sliderWidth/2);
        //this.sliderTop = Math.floor(this.GAME_HEIGHT - (this.slider));
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
        this.tableImage.src = "assets_v2/tables/table.png"

        // load ingredient imgs
        this.allIngredients = [];
        for (let i = 0; i < this.totalCycles; i++){
            this.xIngredientImgs = []
            this.yIngredientImgs = []
            this.currentFolder = `assets_v2/ingredients/cycle${i}`;
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

        }
        this.allIngredients = shuffle(this.allIngredients)
        this.allIngredients = listToMatrix(this.allIngredients, 2)

        // load alien imgs
        this.allAlienImgs = []
        for (let i = 0; i < this.totalCycles; i++){
            //this.numImages = this.allAlienCombinations[i]
            //this.numImages = this.imagesMasterList[i].length
            this.numImages = 10;
            this.alienImgs = [];
            this.alienAnimationImgs = [];
            this.currentFolder = `assets_v2/aliens/cycle${i}/standing`;
            for (let j = 0; j < this.numImages; j++){
                this.image = new Image()
                this.image.src = `${this.currentFolder}/${j}.png`;
                this.alienImgs.push(this.image);

            }
            this.currentFolder = `assets_v2/aliens/cycle${i}/animation`;
            for (let k = 1; k <= 4; k++){
                this.image = new Image()
                this.image.src = `${this.currentFolder}/alien_step${k}.png`;
                this.alienAnimationImgs.push(this.image);

            }
            //this.allAlienImgs[`cycle${i}`] = [this.alienImgs, this.alienAnimationImgs];
            this.cycleImgs = [this.alienImgs, this.alienAnimationImgs];
            this.allAlienImgs.push(this.cycleImgs)

        }
        this.allAlienImgs = shuffle(this.allAlienImgs)


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


    getRandomRewardRange(){
        this.randomIntercept = getRandomInt(10, 50);
        this.randomBeta = getRandomInt(1, 5);
        return [this.randomIntercept, this.randomBeta];
    }

    startNewGame(){
        // creates the tables, as well as the first 3 aliens to start off the
        // game:

        this.currentGameState = this.GAMESTATES.RUNNING;
        this.bonusTrial = false;

        this.contextDict = {};

        for (let elem in this.htmlList){
            this.htmlList[elem].style.display = "block";
        }

        this.lastAlienServed = false;

        this.currentCompStructure = this.compStructures[this.currentCycle]


        // define game settings
        this.totalReward = 0;
        this.reward = 0;
        this.untransformedReward = 0;
        this.currentRewardRange = this.getRandomRewardRange();
        this.generalData.rewardTransformations.push(this.currentRewardRange)


        /////////////
        // Make this depend on cycle:

        this.totalTrials = this.trialsInCycle[this.currentCycle];
        this.samplingIndex = 0;
        this.currentTrial = 0;

        // this.totalTrials = 30;
        // this.trialsSymbol1 = Math.floor(this.totalTrials/3);
        // this.trialsSymbol2 = Math.floor(this.totalTrials/3);
        // this.trialsCompositional = this.totalTrials - (this.trialsSymbol1 + this.trialsSymbol2);
        // this.trialMargin = Math.floor(this.totalTrials/8);
        // this.trialList = [this.trialsSymbol1, this.trialsSymbol2, this.trialsCompositional];
        // this.specialTrials = Math.floor(this.totalTrials*0.2);
        // this.noXTrials = 2;
        // this.noXTrialNumbers = [this.trialsSymbol1 - 3, this.trialsSymbol1 + this.trialsSymbol2 - 3];
        // this.noYTrials = 2;
        // this.noYTrialNumbers = [this.trialsSymbol1 - 5, this.trialsSymbol1 + this.trialsSymbol2 - 5];
        // this.currentTrial = 0;
        // this.trialIsSpecial = 0;

        // set background to the right color gradient, depending on current cycle
        this.background = this.gradientCycles[this.currentCycle]


        // Assign images to the ingredients
        this.xIngredientImgs = this.allIngredients[this.currentCycle][0];
        this.yIngredientImgs = this.allIngredients[this.currentCycle][1];

        // create ingredients
        this.ingredientsX = Math.floor(this.GAME_WIDTH*0.0065)
        this.xIngredient = new Ingredient(this, this.ingredientsX, this.GAME_HEIGHT - 2* (this.GAME_WIDTH*0.15), this.xIngredientImgs);
        this.yIngredient = new Ingredient(this, this.ingredientsX, this.GAME_HEIGHT - this.xIngredient.width, this.yIngredientImgs);

        // assign images to aliens
        // this.currentAlienImgs = this.allAlienImgs[`cycle${this.currentCycle}`];

        this.currentAlienImgs = this.allAlienImgs[this.currentCycle];
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



        this.xValueText.change(this.xSlider.value);
        this.yValueText.change(this.ySlider.value);

        this.sliderInfoColor = "102, 207, 111"
        this.xMinText.rgb = this.sliderInfoColor;
        this.xMaxText.rgb = this.sliderInfoColor;
        this.yMinText.rgb = this.sliderInfoColor;
        this.yMaxText.rgb = this.sliderInfoColor;
        this.xValueText.rgb = this.sliderInfoColor;
        this.yValueText.rgb = this.sliderInfoColor;

        // reset trial and reward texts
        this.totalRewardText.change(`Total $: ${this.totalReward}`);
        this.trialText.change(`Customers left: ${this.totalTrials - this.currentTrial}`);


        // create tables and first 3 aliens
        this.tableList = [];
        this.tableIndices = [];
        this.numTables = 3;
        this.tableSlot = this.GAME_WIDTH/this.numTables
        for (let i = 0; i < this.numTables; i++) {
            this.tableList[i] = new Table(this, i+1, this.tableImage, this.tableSlot);
            this.tableIndices.push(i)
        }


        this.alienList = [];
        this.tableIndices = shuffle(this.tableIndices)
        for (let i = 0; i < this.numSimultaneousAliens; i++) {
            //this.currentTableIdx = getRandomInt(0, this.tableList.length - 1)
            this.currentTable = this.tableList[i] // number of simultaneous aliens must be equal or less than number of tables
            this.features = this.generateRandomAlien();
            this.currentRF = this.defineRewardFunction(this.features[0]);

            this.alien = new Alien(this, this.features[0], this.features[1], this.currentAlienImgs[1],
                 this.currentTable, this.currentRF[0], this.currentRF[1], this.currentCompStructure, this.currentRewardRange,
                this.colorInputDims);
            this.alienList.push(this.alien);
        }
        // for (let i = 0; i < this.numTables; i++) {
        //     this.features = this.generateRandomAlien();
        //     this.currentRF = this.defineRewardFunction(this.features[0]);
        //
        //     this.alien = new Alien(this, this.features[0], this.features[1], this.currentAlienImgs[1],
        //          this.tableList[i], this.currentRF[0], this.currentRF[1], this.currentCompStructure, this.currentRewardRange,
        //         this.colorInputDims);
        //     this.alienList.push(this.alien);
        // }


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
            this.function1 = this.allRewardFunctions[this.currentCycle][this.rfIndex1];
            this.params1 = this.allParameters[this.currentCycle][this.rfIndex1];
        } else {
            // Give second rf and appropriate params
            this.function1 = this.allRewardFunctions[this.currentCycle][this.rfIndex2];
            this.params1 = this.allParameters[this.currentCycle][this.rfIndex2];
        }
        if (features.length > 2){
            // If this alien has more than 1 symbol
            if (features[2] == 0){
                // Give appropriate rf and params
                this.function2 = this.allRewardFunctions[this.currentCycle][this.rfIndex1];
                this.params2 = this.allParameters[this.currentCycle][this.rfIndex1];
            }else {
                this.function2 = this.allRewardFunctions[this.currentCycle][this.rfIndex2];
                this.params2 = this.allParameters[this.currentCycle][this.rfIndex2];
            }

            if (features.length > 4){
                this.function3 = this.allRewardFunctions[this.currentCycle][2]
                this.params3 = this.allParameters[this.currentCycle][2];

                return [[this.function1, this.function2, this.function3], [this.params1, this.params2, this.params3]]
            }

            return [[this.function1, this.function2], [this.params1, this.params2]]
        }
        return [[this.function1], [this.params1]]

    }

    generateRandomAlien(){

        this.alienCombinations = this.allAlienCombinations[this.currentCycle];
        this.currentBulk = this.alienCombinations[this.samplingIndex];
        this.combinationsIndex = getRandomInt(0, this.currentBulk.length - 1);
        this.alienType = this.currentBulk[this.combinationsIndex];


        this.symbolTrialsPerCycle[this.currentCycle][this.samplingIndex][this.combinationsIndex] -= 1;

        this.alienFeatures = this.alienType;

        // this.currentImageList = this.imagesMasterList[this.currentCycle];
        this.contextAsString = this.alienFeatures.join();
        // this.imgIdx = this.currentImageList.indexOf(this.contextAsString);
        this.imgIdx = this.imagesMasterList.indexOf(this.contextAsString);
        this.alienImage = this.currentAlienImgs[0][this.imgIdx];

        if (this.symbolTrialsPerCycle[this.currentCycle][this.samplingIndex][this.combinationsIndex] == 0){
            this.allAlienCombinations[this.currentCycle][this.samplingIndex].splice(this.combinationsIndex, 1);
            this.symbolTrialsPerCycle[this.currentCycle][this.samplingIndex].splice(this.combinationsIndex, 1);
        }

        if (this.allAlienCombinations[this.currentCycle][this.samplingIndex].length == 0){
            this.samplingIndex += 1;
        }

        return [this.alienFeatures, this.alienImage];


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

    getAvailableTables(){
        let availableTables = []
        for (let table in this.tableList){

            if(this.tableList[table].available == true){
                availableTables.push(this.tableList[table])
            }
        }
        return availableTables
    }




    newTrial() {
        // Creates a new trial with a new Alien whose features are pseudo-randomly
        // generated. It also pseudorandomly decides whether or not the trial
        // is going to be special, and if it is, what the new range for x,y values will be

        if ((this.totalTrials - this.currentTrial) > (this.numSimultaneousAliens - 1)){
            this.availableTables = this.getAvailableTables();
            this.currentTableIdx = getRandomInt(0, this.availableTables.length - 1)
            this.currentTable = this.availableTables[this.currentTableIdx]
            this.newAlienFeatures = this.generateRandomAlien();
            this.currentRF = this.defineRewardFunction(this.newAlienFeatures[0]); // assign reward functions and parameters
            // this.newAlien = new Alien(this, this.newAlienFeatures[0],
            //     this.newAlienFeatures[1], this.currentAlienImgs[1], this.player.currentTarget, this.currentRF[0],
            //     this.currentRF[1], this.currentCompStructure, this.currentRewardRange, this.colorInputDims);
            this.newAlien = new Alien(this, this.newAlienFeatures[0],
                this.newAlienFeatures[1], this.currentAlienImgs[1], this.currentTable, this.currentRF[0],
                this.currentRF[1], this.currentCompStructure, this.currentRewardRange, this.colorInputDims);
            this.alienList.push(this.newAlien); // append to alienList
        }
        //this.changeSliderParams(this.xRange, this.yRange)

        // this.xSlider.value = 0;
        // this.ySlider.value = 0;
        //
        // this.xIngredient.update(this.xSlider.value);
        // this.yIngredient.update(this.ySlider.value);
        //
        // this.xValueText.change(this.xSlider.value);
        // this.yValueText.change(this.ySlider.value);

        // procedure for defining whether trial is special (=limited input space) or not.
        // if (this.noXTrialNumbers.includes(this.currentTrial)){
        //     this.noX = true;
        //     this.noY = false;
        //     this.trialIsSpecial = 1;
        // } else if (this.noYTrialNumbers.includes(this.currentTrial)) {
        //     this.noX = false;
        //     this.noY = true;
        //     this.trialIsSpecial = 1;
        // } else if (this.specialTrials > 0) {
        //     this.noX = false;
        //     this.noY = false;
        //     this.trialIsSpecial = getRandomInt(0, 1);
        // } else {
        //     this.trialIsSpecial = 0;
        // }

        // if (this.trialIsSpecial == 1){
        //     this.specialTrials -= 1;
        //     this.xRange = this.createRandomRange(this.noX);
        //     this.yRange = this.createRandomRange(this.noY);
        // } else {
        //     this.xRange = [0, 10];
        //     this.yRange = [0, 10];
        // }
        //
        // this.changeSliderParams(this.xRange, this.yRange);
    }

    newBonusTrial(){
        this.bonusFeaturesList = this.allBonusCombinations[this.currentCycle];

        if (this.currentTrial < this.bonusFeaturesList.length){
            this.bonusCombIdx = this.currentTrial;
        } else {
            this.bonusCombIdx = getRandomInt(0, this.bonusFeaturesList.length - 1)
        }
        this.features = this.bonusFeaturesList[this.bonusCombIdx]

        this.featuresAsString = this.features.join()
        this.bonusImgIdx = this.imagesMasterList.indexOf(this.featuresAsString)
        this.standingImg = this.currentAlienImgs[0][this.bonusImgIdx];
        this.currentRF = this.defineRewardFunction(this.features);
        // get available tables and pick random
        this.availableTables = this.getAvailableTables();
        this.currentTableIdx = getRandomInt(0, this.availableTables.length - 1)
        this.currentTable = this.availableTables[this.currentTableIdx]

        this.bonusAlien = new Alien(this, this.features, this.standingImg,
             this.currentAlienImgs[1], this.currentTable, this.currentRF[0], this.currentRF[1],
             this.currentCompStructure, this.currentRewardRange, this.colorInputDims);
        this.alienList.push(this.bonusAlien);


    }

    bonusRound(){

        this.bonusTrial = true;

        this.lastAlienServed = false;
        this.currentTrial = 0;
        this.totalTrials = 3;




        this.bonusXRange = [0, 15];
        this.bonusYRange = this.bonusXRange;
        this.xRange = this.bonusXRange;
        this.yRange = this.xRange;

        this.xSlider.min = this.bonusXRange[0];
        this.xSlider.max = this.bonusXRange[1];
        this.ySlider.min = this.bonusYRange[0];
        this.ySlider.max = this.bonusYRange[1];

        this.newBonusTrial()
        this.changeSliderParams(this.bonusXRange, this.bonusYRange);

        this.bonusTextSize = Math.floor(this.GAME_WIDTH * 0.08);
        this.bonusRoundText = new TextBox(this, this.GAME_WIDTH/2, this.GAME_HEIGHT*0.2, "BONUS ROUND!",
                    "center", 120, false, "187, 205, 221")

        // this.sliderInfoColor = "255, 101, 101"
        // //this.xMinText.rgb = this.sliderInfoColor;
        // this.xMaxText.rgb = this.sliderInfoColor;
        // //this.yMinText.rgb = this.sliderInfoColor;
        // this.yMaxText.rgb = this.sliderInfoColor;
        //this.xValueText.rgb = this.sliderInfoColor;
        //this.yValueText.rgb = this.sliderInfoColor;


    }


    saveTrialData(currentAlien, xVal, yVal){


        this.participantData.cycle.push(this.currentCycle);
        this.participantData.trials.push(this.currentTrial);
        this.participantData.moves.push(this.playerMoves);
        this.playerMoves = [];
        this.participantData.servedTable.push(this.player.targetIndex);
        this.participantData.alienFeatures.push(currentAlien.features);

        if(this.numSimultaneousAliens == this.tableList.length){
            if (this.tableList.length == 3){
                if (this.player.targetIndex == 1){
                    this.participantData.alternativeAliens.push([this.tableList[0].currentCustomer.features, this.tableList[2].currentCustomer.features])
                } else if (this.player.targetIndex == 0) {
                    this.participantData.alternativeAliens.push([this.tableList[1].currentCustomer.features, this.tableList[2].currentCustomer.features])
                } else {
                    this.participantData.alternativeAliens.push([this.tableList[0].currentCustomer.features, this.tableList[1].currentCustomer.features])
                }
            }


            this.waitingTimeList = [];
            for (let table in this.tableList){
                this.waitingTime = this.tableList[table].currentCustomer.complainCounter;
                this.waitingTimeList.push(this.waitingTime);
            }
            this.participantData.waitingTimes.push(this.waitingTimeList);
        }


        this.participantData.xValue.push(xVal);
        this.participantData.yValue.push(yVal);
        this.participantData.xRange.push(this.xRange);
        this.participantData.yRange.push(this.yRange);
        this.participantData.deliberationTime.push(this.timer);
        this.participantData.untransformedReward.push(this.untransformedReward)
        this.participantData.reward.push(this.reward);
        this.participantData.exploration.push([currentAlien.xExploration, currentAlien.yExploration, currentAlien.exploration]);
        this.participantData.bonusTrial.push(this.bonusTrial);



    }

    saveToDatabase(){
        this.data = {
            general: this.generalData,
            trialData: this.participantData
        }
        // this.ref.push(this.participantData);
        // this.ref.push(this.generalData);
        this.ref.push(this.data)
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
                    this.saveToDatabase()
                    for (let elem in this.htmlList){
                        this.htmlList[elem].style.display = "none";
                    }
                    this.canvas.style.display = "none";

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
