// Starting Coordinates for Player
var startCoordinateX = 200;
var startCoordinateY = 400;

// Game grid X and Y edge llcoordinates
var gridEdgeLeft = 0;
var gridEdgeRight = 405;
var gridEdgeBottom = 0;

//Move Player variables
var moveLateral = 101;
var moveVertical = 86;

// Enemy lane coordinates
var topRow = 62;
var middleRow = 145;
var bottomRow = 230;

// Enemy bug width and height
var bugWidth = 86;
var bugHeight = 51;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x <= startCoordinateY){
        this.x += this.speed * dt;
    }
    else {
        this.x = gridEdgeLeft;
    }
    // Handle collisions 
    if (player.x < this.x + bugWidth 
        && player.x + bugWidth > this.x 
        && player.y < this.y + bugHeight 
        && bugHeight + player.y > this.y) {
        player.collisionReset();
    }
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
class Player {
    constructor(x, y, move){
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
    }
}

// Player class requires an update(), render() and a handler() method.
// update()
Player.prototype.update = function() {
    if (this.x < gridEdgeLeft) {
        this.x = gridEdgeLeft;
    }
    else if (this.x > startCoordinateY) {
        this.x = startCoordinateY;
    }
    else if (this.y > startCoordinateY) {
        this.y = startCoordinateY;
    }
}

// render()
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// handler()
Player.prototype.handleInput = function(key) {
    if (key == 'left' && this.x > gridEdgeLeft) {
        this.x -= moveLateral;
    }
    else if (key == 'right' && this.x < gridEdgeRight) {
        this.x += moveLateral;
    }
    else if (key == 'up' && this.y > gridEdgeBottom) {
        this.y -= moveVertical;
    }
    else if (key == 'down' && this.y < gridEdgeRight) {
        this.y += moveVertical;
    }
    if (this.y < gridEdgeBottom)  {
        player.waterReset();
        window.openModal();
    }
}

// Return player to start position on collision with enemy
Player.prototype.collisionReset = function() {
    this.x = startCoordinateX;
    this.y = startCoordinateY;
}

// Return player to start position on reaching water
Player.prototype.waterReset = function() {
    this.x = startCoordinateX;
    this.y = startCoordinateY;
}

// Now instantiate your objects.
// Place the player object in a variable called player
var player = new Player(startCoordinateX, startCoordinateY);

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// set 3 enemies on the board with a random variable speed
var allEnemiesPosition = [topRow, middleRow, bottomRow];

allEnemiesPosition.forEach(function(positionY) {
    enemy = new Enemy(gridEdgeLeft, positionY, 100 + Math.floor(Math.random() * 150));
    allEnemies.push(enemy);
    });

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


// modal from https://lowrey.me/modals-in-pure-es6-javascript/
class Modal {
  constructor(overlay) {
    this.overlay = overlay;
    const closeButton = overlay.querySelector('.button-close')
    closeButton.addEventListener('click', this.close.bind(this));
    overlay.addEventListener('click', e => {
      if (e.srcElement.id === this.overlay.id) {
        this.close();
      }
    });
  }
  open() {
    this.overlay.classList.remove('is-hidden');
  }

  close() {
    this.overlay.classList.add('is-hidden');
  }
}
const modal = new Modal(document.querySelector('.modal-overlay'));
window.openModal = modal.open.bind(modal);
