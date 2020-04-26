export default class TextBox {
    constructor(game, x, y, text1, align = "end", size = 40, fade = false, rgb = "21, 221, 151") {
        this.game = game;

        this.fade = fade;

        if (this.fade){
            this.alpha = 0;
        } else {
            this.alpha = 1;
        }
        this.align = align;
        this.x = x;
        this.y = y;
        this.text1 = text1;
        this.size = size;
        this.upperBoundSize = Math.floor(this.size * 1.3);
        this.lowerBoundSize = this.size;
        this.rgb = rgb
        this.color = `rgba(${this.rgb}, ${this.alpha})`;
        this.textHasChanged = false;
        this.hasFaded = false;

    }

    change(newText1) {
        if (newText1 != this.text1){
            this.textHasChanged = true;
            this.targetSize = this.upperBoundSize;
        } else {
            this.textHasChanged = false;
        }

        this.text1 = newText1;

    }

    update() {
        if (this.textHasChanged){
            if (this.size < this.targetSize){
                this.size += 1;
            } else if (this.size > this.targetSize) {
                this.size -= 1;
            } else {
                if (this.targetSize == this.upperBoundSize){
                    this.targetSize = this.lowerBoundSize;
                }
            }
        }

        if (this.fade){
            if (this.alpha < this.targetAlpha && this.targetAlpha === 1){
                this.alpha += 0.025;
            } else if (this.alpha > this.targetAlpha && this.targetAlpha ===0) {
                this.alpha -= 0.008;
            } else {
                if (this.targetAlpha == 1){
                    this.targetAlpha = 0;
                } else {
                    this.hasFaded = true;
                }
            }
        }
    }

    draw(ctx) {
        ctx.font = `bold ${this.size}px sans-serif`;
        this.color = `rgba(${this.rgb}, ${this.alpha})`;
        ctx.textAlign = this.align;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text1, this.x, this.y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.alpha})`;
        ctx.strokeText(this.text1, this.x, this.y);

    }


}
