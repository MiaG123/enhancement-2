import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class SpawnPlatform extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage, spawnInterval) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.isHidden = true; // Initially hide the platform
        this.spawnInterval = spawnInterval; // Interval between platform spawns
        this.spawnPlatform(); // Start spawning platforms
    }

    spawnPlatform() {
        // Show the platform
        this.isHidden = false;
        this.size(); // Update size and position

        // Hide the platform after a delay
        setTimeout(() => {
            this.isHidden = true;
            this.size(); // Update size and position

            // Schedule the next platform spawn
            setTimeout(() => {
                this.spawnPlatform();
            }, this.spawnInterval);
        }, this.showDelay);
    }

    // Required, but no update action
    update() {
        //console.log(this.platformY)
    }

    // Draw position is always 0,0
    draw() {
        if (!this.isHidden) {
            this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        }
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
        if (!this.isHidden) {
            this.canvas.style.width = `${scaledWidth}px`;
            this.canvas.style.height = `${scaledHeight}px`;
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = `${platformX}px`;
            this.canvas.style.top = `${platformY}px`;
        } else {
            // Hide the platform
            this.canvas.style.display = 'none';
        }
    }
}

export default SpawnPlatform;