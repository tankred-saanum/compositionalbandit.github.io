export default class Player {

    constructor(game, gameWidth, gameHeight, tables){

        this.game = game;
        this.img1 = new Image();
        this.img1.src = "assets/images/alien_type_1.png";
        this.currentImg = this.img1;

        this.walkCounter = 0;

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.width = this.gameWidth *0.1;
        this.height = this.gameHeight*0.2;

        this.tableList = tables;
        this.targetIndex = 1
        this.currentTarget = this.tableList[this.targetIndex];
        this.xTarget = this.currentTarget.center - this.width/2


        this.x = this.gameWidth/2
        this.y = this.currentTarget.y + this.height/2;

        this.currentSpeed = Math.floor(this.gameWidth*0.1);


    }
    draw(ctx) {
        ctx.drawImage(this.currentImg, this.x, this.y, this.width, this.height);

    }
    moveLeft() {
        if (this.targetIndex != 0){
            this.targetIndex -= 1;
            this.currentTarget = this.tableList[this.targetIndex];
            this.xTarget = this.currentTarget.center - this.width/2;
        }
        this.left = true;
        this.right = false;

        // this.walkCounter += 5;
        // if (0 < this.walkCounter && this.walkCounter < 30){
        //     if (this.left){
        //         this.currentImg = this.leftOne;
        //     }
        // }
        // else if (30 < this.walkCounter && this.walkCounter < 60) {
        //     if (this.left) {
        //         this.currentImg = this.leftThree;
        //     }
        // }
        // else if (60 < this.walkCounter && this.walkCounter < 90) {
        //     if (this.left) {
        //         this.currentImg = this.leftTwo;
        //     }
        // }
        // else if (90 < this.walkCounter && this.walkCounter < 120) {
        //     if (this.left) {
        //         this.currentImg = this.leftThree;
        //     }
        // }
        // else if (this.walkCounter > 120) {
        //     this.walkCounter = 0;
        // }
    }



    moveRight() {
        if (this.targetIndex < this.tableList.length - 1){
            this.targetIndex += 1;
            this.currentTarget = this.tableList[this.targetIndex];
            this.xTarget = this.currentTarget.center - this.width/2;
        }

        this.left = false;
        this.right = true;

    }


    update(dt) {

        if (this.x != this.xTarget){
            this.game.submitButton.style.opacity = "0.5"
            this.canSelect = false;
            if (this.x < this.xTarget){
                if (this.x + this.currentSpeed/dt > this.xTarget){
                    this.x = this.xTarget;
                } else {
                    this.x += this.currentSpeed/dt;
                }

            } else{
                if (this.x - this.currentSpeed/dt < this.xTarget){
                    this.x = this.xTarget;
                } else {
                    this.x -= this.currentSpeed/dt;
                }
            }
        } else {
            this.canSelect = true;
            if (this.currentTarget.currentCustomer.readyToServe == true){
                this.game.submitButton.style.opacity = "1";
            } else {
                this.game.submitButton.style.opacity = "0.5";
            }
        }

        // - 5 && this.position.x < this.currentTarget.x + 5)
        //
        // if (this.position.x > this.destinationOne.x - 5 && this.position.x < this.destinationOne.x +5){
        //     this.destinationOne.current = true;
        //     this.destinationTwo.current = false;
        //     this.destinationThree.current = false;
        //     this.canSelect = true;
        //     stop()
        //
        //
        //
        // } else if (this.position.x == this.destinationTwo.x) {
        //     this.destinationOne.current = false;
        //     this.destinationTwo.current = true;
        //     this.destinationThree.current = false;
        //     this.canSelect = true;
        //
        //
        // } else if (this.position.x == this.destinationThree.x) {
        //     this.destinationOne.current = false;
        //     this.destinationTwo.current = false;
        //     this.destinationThree.current = true;
        //     this.canSelect = true;
        //
        // } else {
        //     this.canSelect = false;
        //     this.position.x += this.currentSpeed/ dt;
        //
        // }

        //
        // if (this.position.x < 0) {
        //     this.position.x = 0;
        // }
        // else if (this.position.x + this.width >= this.gameWidth) {
        //     this.position.x = this.gameWidth - this.width;
        //}
    }
}
