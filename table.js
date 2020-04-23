export default class Table{

    constructor(game, number, image){
        this.gameWidth = game.GAME_WIDTH;
        this.gameHeight = game.GAME_HEIGHT;

        this.number = number
        this.width = Math.floor(this.gameWidth *0.2);
        this.height = Math.floor(this.gameHeight *0.2);
        this.x = this.number * Math.floor(this.gameWidth * 0.25) - Math.floor(this.width/2);
        this.y = Math.floor(this.gameHeight / 4);
        this.center = this.x + Math.floor(this.width/2)

        this.currentCustomer = undefined;
        this.image = image



    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    }


}
