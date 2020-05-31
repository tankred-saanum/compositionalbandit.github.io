export default class Ingredient{

    constructor(game, x, y, imgList) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = Math.floor(this.game.GAME_WIDTH * 0.15);
        this.height =  this.width;
        this.imgList = imgList;
        this.currentImgIndex = 0;
        this.currentImg = this.imgList[this.currentImgIndex];
        this.notAvailable = false;
        this.notAvailableText1 = "This ingredient is"
        this.notAvailableText2 = "currently not available";
        this.textSize = Math.floor(this.width*0.09);


    }

    setNotAvailable(){
        this.notAvailable = true;
    }

    setAvailable(){
        this.notAvailable = false;
    }


    update(newValue) {
        this.newValue = parseInt(newValue);

        this.currentImgIndex = this.newValue;
        this.currentImg = this.imgList[this.currentImgIndex];
    }

    draw(ctx){
        ctx.drawImage(this.currentImg, this.x, this.y, this.width, this.height);
        if(this.notAvailable){
            ctx.textAlign = "center";
            ctx.font = `bold ${this.textSize}px sans-serif`;
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillText(this.notAvailableText1, this.x + this.width/2, (this.y + this.height/2) - this.textSize);
            ctx.fillText(this.notAvailableText2, this.x + this.width/2, (this.y + this.height/2) + this.textSize);
        }


    }
}
