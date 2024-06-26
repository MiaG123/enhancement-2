import GameEnv from './GameEnv.js';
import Background from './Background.js';

export class BackgroundHills extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.parallaxSpeed = 0.4;
    }

    // speed is used to background parallax behavior
    update() {
        this.speed = GameEnv.backgroundDirection * this.parallaxSpeed;
        super.update();
    }

    //Cause of limited bg cutout, keeping just incase it causes issues later
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        super.draw();
    }

}

export default BackgroundHills;