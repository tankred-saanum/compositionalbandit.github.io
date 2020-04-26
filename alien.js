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

        } else {
            this.compositional = false;
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
            }
        }


    }

    giveReward(x, y) {
        this.game.alienList.push(this.game.alienList.splice(this.game.alienList.indexOf(this), 1)[0]);
        this.xtarget = this.game.GAME_WIDTH + (2*this.width);
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
            this.reward = Math.round(this.reward1 + this.reward2);

        } else {
            this.reward = Math.round(this.reward1);

        }


        this.hasBeenServed = true;
        this.game.totalReward += this.reward;
        this.game.reward = this.reward;

    }

    draw(ctx){
        ctx.drawImage(this.currentImg, this.x, this.y, this.width, this.height);

    }

}
