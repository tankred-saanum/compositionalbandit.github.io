import TextBox from './textBox.js'

export default class RewardText extends TextBox{
    constructor(game, x, y, text1, align = "end", size =70, fade = false, rgb = "red"){
        super(game, x, y, text1, align, size, fade, rgb);
        this.upperBoundSize = Math.floor(this.size * 1.5);

    }


    change(newText){
        this.textHasChanged = true;
        this.hasFaded = false;
        this.targetSize = this.upperBoundSize;
        this.targetAlpha = 1;
        this.text1 = `$ ${newText}`;

    }
}
