import TextBox from '/textBox.js'

export default class RewardText extends TextBox{
    constructor(game, x, y, text1, align = "end", fade = false, color = "red", size =70){
        super(game, x, y, text1, align, fade, color, size);

    }


    change(newText){
        this.textHasChanged = true;
        this.hasFaded = false;
        this.targetSize = this.upperBoundSize;
        this.targetAlpha = 1;
        this.text1 = `$ ${newText}`;

    }
}
