import {getRandomInt} from './utils.js'

export default class Alien{

    constructor(game, features, standingImg, animationImgs, table, rewardFunction, rfParams, compStructure, transformParams,
        relevantInputDims){
        this.game = game;
        this.table = table;
        this.width = Math.floor(this.game.GAME_WIDTH * 0.1);
        this.height = Math.floor(this.game.GAME_HEIGHT * 0.3);
        //this.x = -Math.floor(this.game.GAME_WIDTH*0.65);
        this.x = this.table.center - this.width/2
        // this.y = 0;
        this.y =Math.floor(-this.height*2)//Math.floor(this.game.GAME_HEIGHT*0.2)


        this.x += this.width*this.table.number;
        this.features = features;
        this.featureString = this.features.join()
        this.rewardFunction = rewardFunction;
        this.params = rfParams;

        this.operator = compStructure
        this.transformIntercept = transformParams[0];
        this.transformBeta = transformParams[1]

        this.relevantInputDims = relevantInputDims

        if (this.features.length > 2){
            this.compositional = true;

        }


        this.standingImg = standingImg;
        this.animationImgs = animationImgs;
        this.currentImg = this.animationImgs[0];


        this.margin = game.GAME_HEIGHT * 0.12
        this.xtarget = this.table.center - Math.floor(this.width/2);
        this.ytarget = this.table.y - (this.height - this.margin);

        this.speed = Math.floor(game.GAME_WIDTH*0.11);

        this.animationChange1 = this.speed;
        this.animationChange2 = this.speed*2;
        this.animationChange3 = this.speed*3;
        this.animationChange4 = this.speed*4;
        this.walkCounter = getRandomInt(0, this.animationChange4);

        this.readyToServe = false;
        this.hasBeenServed = false;
        this.table.currentCustomer = this;
        this.table.available = false;

        this.complainCounter = 0;
        this.complainThreshold = 5;
        this.complainText = "What is taking so long?";
        this.textSize = Math.floor(this.game.GAME_WIDTH * 0.02);
        this.complain = false;
        this.leaveTime = 750;
        this.leaveTimer = 0;
        this.waitingPenality = 1;

    }

    move(dt){
        // define the change in speed (delta speed), this.ds, as speed over dt
        this.ds = this.speed/dt;
        if (this.x > this.xtarget){
            if (this.x - this.ds < this.xtarget){
                this.x = this.xtarget;
            } else {
                this.x -= this.ds;
            }
        }else if (this.x < this.xtarget) {
            if (this.x + this.ds > this.xtarget){
                this.x = this.xtarget;
            } else {
                this.x += this.ds;
            }
        } else if (this.y > this.ytarget) {
            if (this.y - this.ds < this.ytarget){
                this.y = this.ytarget;
            } else {
                this.y -= this.ds;
            }
        } else if (this.y < this.ytarget) {
            if (this.y + this.ds > this.ytarget){
                this.y = this.ytarget;
            } else {
                this.y += this.ds;}
        }

        this.walkCounter += this.ds;
        if (this.walkCounter < this.animationChange1){
            this.currentImg = this.animationImgs[0];
        } else if (this.walkCounter < this.animationChange2) {
            this.currentImg = this.animationImgs[1];
        } else if (this.walkCounter < this.animationChange3) {
            this.currentImg = this.animationImgs[2];
        } else if (this.walkCounter < this.animationChange4) {
            this.currentImg = this.animationImgs[3];
        } else {
            this.walkCounter = 0;
        }
    }

    update(dt){
        if (this.x != this.xtarget || this.y != this.ytarget){
            this.readyToServe = false;
            this.move(dt)
        } else {
            this.currentImg = this.standingImg;
            if (!this.hasBeenServed){
                this.readyToServe = true;
            } else if(this.x < this.game.GAME_WIDTH){
                this.leaveTimer += (this.game.timer - this.leaveTimer);
                this.complainText = "Thank you";
                this.complain = true;
                this.readyToServe = false;
                if (this.leaveTimer > this.leaveTime){
                    this.game.hasMovedSlider = false;
                    this.game.changeSliderParams(this.game.xRange, this.game.yRange)
                    this.xtarget = this.game.GAME_WIDTH + (2*this.width);
                    this.game.alienList.push(this.game.alienList.splice(this.game.alienList.indexOf(this), 1)[0]);
                }
            }
        }


    }

    updateWaitingTime(){
        if (this.readyToServe && !this.hasBeenServed){
            this.complainCounter += 1;
            if (this.complainCounter == this.complainThreshold){
                this.complain = true;
            } else if (this.complainCounter > this.complainThreshold) {
                this.complain = true;
                this.waitingPenality = 0.5;
            }

        }
    }

    transformReward(reward, transformRange){
        this.transformedReward = (((reward - OldMin) * (transformRange[1] - transformRange[0])) / (OldMax - OldMin)) + NewMin
    }

    computeFinalReward(rewardList){
        this.finalR = 0;
        if (this.operator == "multiplicative"){
            for (let i =0; i < rewardList.length; i++){

                if (this.finalR == 0){
                    this.finalR = rewardList[i]
                } else {
                    this.finalR = this.finalR * rewardList[i];
                }
            }
        } else {
            for (let i =0; i < rewardList.length; i++){
                this.finalR += rewardList[i]
            }
        }

        return this.finalR
    }

    giveRandomReward(){
        this.hasBeenServed = true;
        //this.randReward = getRandomInt(0, 20);
        //this.game.totalReward += this.randReward;
        //this.game.reward = this.randReward;
    }

    giveReward(x, y) {
        this.complain = false;
        this.xValue = parseInt(x);
        this.yValue = parseInt(y);

        this.inputs = [this.xValue, this.yValue]

        this.input1 = this.inputs[this.relevantInputDims[this.features[1]]];

        this.rf1 = this.rewardFunction[0];
        this.rfParams1 = this.params[0];

        // if (this.features[1] == 0){
        //     this.input1 = this.xValue;
        //
        // } else {
        //     this.input1 = this.yValue;
        // }

        this.reward1 = this.rf1(this.input1, this.rfParams1);

        if (this.compositional){
            this.rf2 = this.rewardFunction[1];
            this.rfParams2 = this.params[1];
            this.input2 = this.inputs[this.relevantInputDims[this.features[3]]];
            // if (this.features[3] == 0){
            //     this.input2 = this.xValue;
            //
            // } else {
            //     this.input2 = this.yValue;
            //
            // }

            this.reward2 = this.rf2(this.input2, this.rfParams2);

            if (this.features.length > 4){
                this.rf3 = this.rewardFunction[2];
                this.rfParams3 = this.params[2]
                this.input3 = this.inputs[this.relevantInputDims[this.features[5]]];
                // if (this.features[5] == 0){
                //     this.input3 = this.xValue;
                // } else {
                //     this.input3 = this.yValue;
                // }

                this.reward3 = this.rf3(this.input3, this.rfParams3);

                this.rewardList = [this.reward1, this.reward2, this.reward3];
                this.reward = Math.round(this.computeFinalReward(this.rewardList)*this.waitingPenality)
            } else {

                this.rewardList = [this.reward1, this.reward2]
                this.reward = Math.round((this.computeFinalReward(this.rewardList)*this.waitingPenality)/2);
            }


        } else {

            this.rewardList = [this.reward1]
            this.reward = Math.round(this.computeFinalReward(this.rewardList)*this.waitingPenality);

        }

        this.untransformedReward = this.reward;
        this.reward = this.reward*this.transformBeta;
        this.reward = this.reward + this.transformIntercept;



        this.hasBeenServed = true;
        this.table.available = true;
        this.game.totalReward += this.reward;
        this.game.reward = this.reward;
        this.game.untransformedReward = this.untransformedReward;
        this.game.performance += this.untransformedReward;

        this.xExploration = true;
        this.yExploration = true;
        this.exploration = true;



        /////////////
        if(this.game.contextDict.hasOwnProperty(this.featureString)){
            this.relevantHighscore = this.game.contextDict[this.featureString]
            this.highX = this.relevantHighscore[0];
            this.highY = this.relevantHighscore[1];
            this.highR = this.relevantHighscore[2];

            if (this.highX.includes(x)){
                this.xExploration = false;

            }
            if (this.highY.includes(y)){
                this.yExploration = false;

            }
            if (!(this.xExploration || this.yExploration)){
                this.exploration = false;
            }


            if (this.reward > this.highR){
                this.choiceData = [[x], [y], this.reward]
                this.game.contextDict[this.featureString] = this.choiceData;

            } else if (this.reward == this.highR) {
                // push if not already in there // TODO:
                this.game.contextDict[this.featureString][0].push(x);
                this.game.contextDict[this.featureString][1].push(y);
            }

        } else {
            this.choiceData = [[x], [y], [this.reward]]
            this.game.contextDict[this.featureString] = this.choiceData;
        }


    }

    draw(ctx){
        ctx.drawImage(this.currentImg, this.x, this.y, this.width, this.height);
        if(this.complain){
            ctx.textAlign = "center";
            ctx.font = `bold ${this.textSize}px sans-serif`;
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillText(this.complainText, this.x + this.width/2, this.y);
        }

    }

}
