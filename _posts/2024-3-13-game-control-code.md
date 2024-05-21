---
title: Game Control Code
comments: True
layout: post
description: How java scrit objects are collected
author: John Mortensen
type: ccc
courses: {'csse': {'week': 3}}
---

## Our Game Setup Java Script objects

```
{ name: 'quidditch', id: 'background', class: Background, data: this.assets.backgrounds.quidditch },
{ name: 'turf', id: 'platform', class: Platform, data: this.assets.platforms.turf },
{ name: 'draco', id: 'draco', class: Goomba, data: this.assets.enemies.draco, xPercentage: 0.3, minPosition: 0.05},
{ name: 'draco', id: 'draco', class: Goomba, data: this.assets.enemies.draco, xPercentage:  0.5, minPosition: 0.3 },
{ name: 'draco', id: 'draco', class: Goomba, data: this.assets.enemies.draco, xPercentage:  0.75, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
{ name: 'dementor', id: 'dementor', class: FlyingGoomba, data: this.assets.enemies.dementor, xPercentage:  0.5, minPosition:  0.05},
{ name: 'dementor', id: 'dementor', class: FlyingGoomba, data: this.assets.enemies.dementor, xPercentage:  0.9, minPosition: 0.5},
{ name: 'harry', id: 'player', class: PlayerQuidditch, data: this.assets.players.harry },
{ name: 'tree', id: 'tree', class: Tree, data: this.assets.obstacles.whompingwillow },
```
The Quidditch background, turf, draco, dementor, harry, and tree are all of the javascript objects that we added to the gave in order to make a new quiditch levle. 
When the java script objects are added into game set up they are described and then put into order based on there z-level this happens through series of classes and .js files that then become assets which are then placed into certaine game levels.

## Game Control

```
* @param {Object} newLevel - The new level to transition to.
     */
    async transitionToLevel(newLevel) {
        this.inTransition = true;

        // Destroy existing game objects
        GameEnv.destroy();

        // Load GameLevel objects
        if (GameEnv.currentLevel !== newLevel) {
            GameEnv.claimedCoinIds = [];
        }
        await newLevel.load();
        GameEnv.currentLevel = newLevel;

        // Update invert property
        GameEnv.setInvert();
        
        // Trigger a resize to redraw canvas elements
        window.dispatchEvent(new Event('resize'));

        this.inTransition = false;
    },
```
In this code our level is represented by the "new level" this code is what creates our level and loads in all of our game objects and assets.

```
gameLoop() {
        // Turn game loop off during transitions
        if (!this.inTransition) {
```
gameLoop is used in order to check that the game is in transition and if it isn't then it will update the game.
```
     * gameloop: Handles Player reaction / state updates to the collision
     */
    // Assuming you have some kind of input handling system

    handlePlayerReaction() {
        // gravity on is default for player/character
        this.gravityEnabled = true;

        // handle player reaction based on collision type
        switch (this.state.collision) {
            // 1. Player is on a jump platform
            case "jumpPlatform":
                // Player is on top of wall
                if (this.collisionData.touchPoints.this.onTopofOther) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                    this.gravityEnabled = false;

                // Player is touching the wall with right side
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: false, down: false, left: true, right: false, falling: false};
                    this.y -= 4;
                
                // Player is touching the wall with left side
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: false, down: false, left: false, right: true, falling: false};
                    this.y -= 4;
                }
                break;
               
            // 2. Player is on or touching a wall 
            case "wall":
                // Player is on top of the wall
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                    this.gravityEnabled = false;
                // Player is touching the wall with right side
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: false, down: false, left: true, right: false, falling: false};
                // Player is touching the wall with left side
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: false, down: false, left: false, right: true, falling: false};
                }
                break;

            
            // 4. Player is in default state
            case "floor":
                // Player is on the floor
                if (this.onTop) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                // Player is falling, there are no collisions, but is in default state 
                } else { 
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: true};
                }
                break;
            
            
        }
    }
```
In this example GameLoop is used to contunuisly check and update the player's state in response to a collision.

## Inspect used to examine properties

![Alt text](image.png)

In this image you can see that on the to left box I have clicked on audio coin which then opens up the styles tab bellow allowing you to see it's changes in properties such as it's desplay and sizing.

## End of level/transitioning

```
// Quidditch Game Level added to the GameEnv ...
    new GameLevel({ tag: "quidditch", callback: this.playerOffScreenCallBack, objects: quidditchGameObjects });
```
At the end of each level you will see the callback: this.playerOffScreenCallBack is used to stop the game and timer and then restart it once the certain requirments have been met.

```
gameOverCallBack: async function () {
    const id = document.getElementById("gameOver");
    id.hidden = false;
    GameControl.stopTimer()
    // Wait for the restart button to be clicked
    await this.waitForButtonRestart('restartGame');
    id.hidden = true;

    // Change currentLevel to start/restart value of null
    GameEnv.currentLevel = false;

    return true;
  },
```
This code shows that once the call back happens it will display the gameover image stop the timer and the restart the game from the next level

```
homeScreenCallback: function () {
    // gameBegin hidden means the game has started
    const id = document.getElementById("gameBegin");
    return id.hidden;
  },
```
In this code we can see that once a new level begins the "homeScreen" will then become hidden completing the transition from level to level.