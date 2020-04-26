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

    }


    update(newValue) {
        this.newValue = parseInt(newValue);
    
        this.currentImgIndex = this.newValue;
        this.currentImg = this.imgList[this.currentImgIndex];
    }

    draw(ctx){
        ctx.drawImage(this.currentImg, this.x, this.y, this.width, this.height);


    }
}
