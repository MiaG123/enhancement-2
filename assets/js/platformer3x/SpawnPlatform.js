import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class SpawnPlatform extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.state = "hidden"; // Initial state
        this.collision = true;
        this.size();
    }

    // Finite State Machine methods
    show() {
        this.state = "visible";
        this.canvas.style.visibility = "visible";
    }

    hide() {
        this.state = "hidden";
        this.canvas.style.visibility = "hidden";
    }

    // Required, but no update action
    update() {
        this.collisionChecks();
    }

    collisionAction() {
        // Collision only detects mario and applies to the item block
        if (this.collisionData.touchPoints.other.id === "player" && this.name === "itemBlock") {
            if (this.relativeX === 0 || this.relativeX === this.canvas.width) {
                if (this.relativeX === 0) {
                    GameControl.startRandomEvent();
                    //console.log("randomEventtriggered", GameControl.randomEventId);
                }
                this.relativeX = -1 * this.canvas.width;
            } else if (this.relativeX === "") {
                this.relativeX = 0;
            }
    
            // Check if the player is colliding with the item block
            if (this.isColliding(player, this)) {
                // Set the item block to be visible
                this.show();
            }
        }
    }
    
    isColliding(obj1, obj2) {
        var rect1 = obj1.getBoundingClientRect();
        var rect2 = obj2.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Set platform position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;  // width of jump platform is 1/10 of height
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        //this.canvas.width = this.width;
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
        this.hide(); // Initially hide the platform
    }
}

export default SpawnPlatform;
