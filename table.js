export default class Table{

    constructor(game, number, image, tableSlot){
        this.gameWidth = game.GAME_WIDTH;
        this.gameHeight = game.GAME_HEIGHT;

        this.number = number;
        this.tableSlot = tableSlot;
        this.width = Math.floor(this.gameWidth *0.2);
        this.height = Math.floor(this.gameHeight *0.2);
        //this.x = this.number * Math.floor(this.gameWidth * 0.25) - Math.floor(this.width/2);
        //this.x = Math.floor(this.tableSlot) -
        this.x = (this.number * this.tableSlot) - (this.tableSlot/2) - (this.width/2);
        //console.log(this.tableSlot, this.x, this.number, this.width)
        this.y = Math.floor(this.gameHeight / 4);
        this.center = this.x + Math.floor(this.width/2)

        this.currentCustomer = undefined;
        this.image = image
        this.available = true;


    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    }


}
