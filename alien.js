import {getRandomInt} from './rewardFunctions.js'

export default class Alien{

    constructor(game, features, standingImg, animationImgs, table, rewardFunction, rfParams){
        this.game = game;
        this.table = table;
        this.width = Math.floor(this.game.GAME_WIDTH * 0.1);
        this.height = Math.floor(this.game.GAME_HEIGHT * 0.3);
        this.x = -Math.floor(this.game.GAME_WIDTH*0.65);
        this.y = 0;


        this.x += this.width*this.table.number;
        this.features = features;
        this.rewardFunction = rewardFunction;
        this.params = rfParams;

        if (this.features.length > 2){
            this.compositional = true;
            this.symbol1 = false;
            this.symbol2 = false;

        } else {
            this.compositional = false;
            if(this.features[0] == 0){
                this.symbol1 = true;
                this.symbol2 = false;
            } else {
                this.symbol1 = false;
                this.symbol2 = true;
            }
        }

        this.standingImg = standingImg;
        this.animationImgs = animationImgs;
        this.currentImg = this.animationImgs[0];


        this.margin = game.GAME_HEIGHT * 0.12
        this.xtarget = this.table.center - Math.floor(this.width/2);
        this.ytarget = this.table.y - (this.height - this.margin);

        this.speed = Math.floor(game.GAME_WIDTH*0.083);

        this.animationChange1 = this.speed;
        this.animationChange2 = this.speed*2;
        this.animationChange3 = this.speed*3;
        this.animationChange4 = this.speed*4;
        this.walkCounter = getRandomInt(0, this.animationChange4);

        this.readyToServe = false;
        this.hasBeenServed = false;
        this.table.currentCustomer = this;

        this.complainCounter = 0;
        this.complainThreshold = 4;
        this.complainText = "What is taking so long?";
        //this.complainTime = 100000;
        this.textSize = Math.floor(this.game.GAME_WIDTH * 0.02);
        this.complain = false;
        //this.timerExists = false;
        this.leaveTime = 500;
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
                if (this.leaveTimer > this.leaveTime){
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

    giveReward(x, y) {
        this.complain = false;
        // this.game.alienList.push(this.game.alienList.splice(this.game.alienList.indexOf(this), 1)[0]);
        this.xValue = parseInt(x);
        this.yValue = parseInt(y);

        this.rf1 = this.rewardFunction[0];
        this.rfParams1 = this.params[0];

        if (this.features[1] == 0){
            this.input1 = this.xValue;

        } else {
            this.input1 = this.yValue;
        }
        this.reward1 = this.rf1(this.input1, this.rfParams1);

        if (this.compositional){
            this.rf2 = this.rewardFunction[1];
            this.rfParams2 = this.params[1];
            if (this.features[3] == 0){
                this.input2 = this.xValue;

            } else {
                this.input2 = this.yValue;

            }


            this.reward2 = this.rf2(this.input2, this.rfParams2);
            this.reward = Math.round((this.reward1 + this.reward2)*this.waitingPenality);

        } else {
            this.reward = Math.round((this.reward1)*this.waitingPenality);

        }


        this.hasBeenServed = true;
        this.game.totalReward += this.reward;
        this.game.reward = this.reward;

        this.xExploration = true;
        this.yExploration = true;
        this.exploration = true;
        if (this.symbol1){
            this.relevantHighscore = this.game.highscores.symbol1;
        } else if (this.symbol2) {
            this.relevantHighscore = this.game.highscores.symbol2;
        } else {
            this.relevantHighscore = this.game.highscores.compositional;
        }



        if (x == this.relevantHighscore[1]){
            this.xExploration = false;
        }
        if (y == this.relevantHighscore[2]){
            this.yExploration = false;
        }

        if (!(this.xExploration || this.yExploration)){
            this.exploration = false;
        }

        if(this.reward > this.relevantHighscore[0]){
            this.relevantHighscore[0] = this.reward;
            this.relevantHighscore[1] = x;
            this.relevantHighscore[2] = y;
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
