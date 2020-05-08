export default class Player {

    constructor(game, gameWidth, gameHeight, tables, standingImg, leftAnimations, rightAnimations){

        this.game = game;

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = Math.floor(this.gameWidth *0.07);
        this.height = Math.floor(this.gameHeight*0.22);

        this.tableList = tables;
        this.targetIndex = 1
        this.currentTarget = this.tableList[this.targetIndex];
        this.xTarget = this.currentTarget.center - this.width/2


        this.x = this.gameWidth/2
        this.y = this.currentTarget.y + this.height/2;

        this.speed = Math.floor(this.gameWidth*0.1);
        this.walkCounter = 0;
        this.animationChange1 = this.speed;
        this.animationChange2 = this.speed*2;
        this.animationChange3 = this.speed*3;
        this.animationChange4 = this.speed*4;


        this.standingImg = standingImg;
        this.leftAnimations = leftAnimations;
        this.rightAnimations = rightAnimations;

        this.currentImg = this.standingImg;
        this.currentWalkingImgs = this.leftAnimations;


    }

    moveLeft() {
        if (this.targetIndex != 0){
            this.targetIndex -= 1;
            this.currentTarget = this.tableList[this.targetIndex];
            this.xTarget = this.currentTarget.center - this.width/2;
            this.game.playerMoves.push("Left")
        }
        this.currentWalkingImgs = this.leftAnimations;

    }



    moveRight() {
        if (this.targetIndex < this.tableList.length - 1){
            this.targetIndex += 1;
            this.currentTarget = this.tableList[this.targetIndex];
            this.xTarget = this.currentTarget.center - this.width/2;
            this.game.playerMoves.push("Right")
        }

        this.currentWalkingImgs = this.rightAnimations;


    }

    move(dt){
        this.ds = this.speed/dt;

        if (this.x > this.xTarget){
            if (this.x - this.ds < this.xTarget){
                this.x = this.xTarget;
            } else {
                this.x -= this.ds;
            }
        }else {
            if (this.x + this.ds > this.xTarget){
                this.x = this.xTarget;
            } else {
                this.x += this.ds;
            }
        }

        this.walkCounter += this.ds;

        if (this.walkCounter < this.animationChange1){
            this.currentImg = this.currentWalkingImgs[0];
        } else if (this.walkCounter < this.animationChange2) {
            this.currentImg = this.currentWalkingImgs[1];
        } else if (this.walkCounter < this.animationChange3) {
            this.currentImg = this.currentWalkingImgs[2];
        } else if (this.walkCounter < this.animationChange4) {
            this.currentImg = this.currentWalkingImgs[3];
        } else {
            this.walkCounter = 0;
        }



    }


    update(dt) {

        if (this.x != this.xTarget){
            this.game.submitButton.style.opacity = "0.5";
            this.canSelect = false;
            this.move(dt);

        } else {
            this.canSelect = true;
            this.currentImg = this.standingImg;
            if (this.currentTarget.currentCustomer.readyToServe == true){
                this.game.submitButton.style.opacity = "1";
            } else {
                this.game.submitButton.style.opacity = "0.5";
            }
        }

    }
    draw(ctx) {
        ctx.drawImage(this.currentImg, this.x, this.y, this.width, this.height);

    }
}
