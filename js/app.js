// constants
var GRID_SPRITE_WIDTH = 101;
var GRID_SPRITE_HEIGHT = 83; 
var GRID_WIDTH = 5;
var GRID_HEIGHT = 6;

// Enemies our player must avoid
var Enemy = function (startRow, speed, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite || 'images/enemy-bug.png';
    Resources.load(this.sprite);
    this.speed = speed || 0;

    this.x = 0;
    this.y = startRow * GRID_SPRITE_HEIGHT -16|| 0;
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.x = 0;
    }
    
    if (this.x < 0) {
        this.x = 505;
    }
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player constructor, initialize player with position on grid 
// and player sprite 
var Player = function(gridX, gridY, sprite) {
    this.sprite = sprite || 'images/char-pink-girl.png';
    Resources.load(this.sprite);
    this.startGridX = gridX;
    this.startGridY = gridY;
    this.gridX = gridX || 0;
    this.gridY = gridY || 0;
    this.x = 0;
    this.y = 0;
    this.score = 0;
};

// Update player in game loop
Player.prototype.update = function () {
    this.x = this.gridX * GRID_SPRITE_WIDTH ;
    this.y = this.gridY * GRID_SPRITE_HEIGHT - 12;    
    this.checkCollisions();
    this.scored();
}

// determines if player scored (won)
Player.prototype.scored = function () {
    if (this.gridY === 0) {
        this.score += 1;
        this.gridX = this.startGridX;
        this.gridY = this.startGridY;
    }
}

// displays player sprite 
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// check with which enemy player collided 
Player.prototype.checkCollisions = function () {
    var player = this; // helper assigment 
    // player boundig box
    var plx = player.x,
        prx = player.x + GRID_SPRITE_WIDTH;
        pty = player.y;
        pdy = player.y + GRID_SPRITE_HEIGHT -12,
        collisionDetected = false;

    allEnemies.forEach(function (enemy) {
        if (collisionDetected) {
            return;
        }
        // enemy bounding box
        var elx = enemy.x,
            erx = enemy.x + GRID_SPRITE_WIDTH;
            ety = enemy.y,
            edy = enemy.y + GRID_SPRITE_HEIGHT - 12;

        // check if bounding boxes collide
        if (
            (
                (plx >= elx && plx <= erx) || (prx >= elx && prx <= erx)
            )
            && pty >= ety && pty <= edy
        ) {
            return player.collide(enemy);
        }
    })
}

// perform collision logic 
Player.prototype.collide = function (enemy) {
    this.gridX = this.startGridX;
    this.gridY = this.startGridY;
    this.score = this.score > 0 ? this.score - 1 : 0;
}

// react to user input
Player.prototype.handleInput = function (key) {

    switch (key) {
        case 'left':
            this.gridX = this.gridX > 0 ? this.gridX - 1 : 0;
            break;
        case 'right':
            this.gridX = this.gridX < (GRID_WIDTH-1) ? this.gridX + 1 : GRID_WIDTH-1;
            break;
        case 'down':
            this.gridY = this.gridY < (GRID_HEIGHT-1) ? this.gridY + 1 : GRID_HEIGHT-1;
            break;
        case 'up':
            this.gridY = this.gridY > 0 ? this.gridY - 1 : 0;
            break;
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(2,50), new Enemy(3,-40),new Enemy(3,110), new Enemy(1,93), new Enemy(4,56) ];


// construct player
var player = new Player(2,5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
