// get the canvas tag using .getElementById() method
const myCanvas = document.getElementById('my-canvas');

//conext has all the methods for drawing things
const ctx = myCanvas.getContext('2d');

//global variables
let score = 0;
let isOver = false;
const img = new Image();
    img.src = './images/backgroundext.png'
    // ctx.fillStyle = '#00FFFF';
const backgroundImg = {
    img: img,
    x: 0,
    speed: 1,
    move: function(){
        // this.x += this.speed;
        this.x %= myCanvas.width; 
    },
    draw: function(){
        ctx.drawImage(this.img,this.x,0, 6656, 468)
        // ctx.drawImage(this.img, this.x, 0);
        if (this.speed < 0){
            ctx.drawImage(this.img, this.x + myCanvas.width, 0,6656,468);
        }else{
            ctx.drawImage(this.img, this.x - this.img.width,0,6656, 468)
        };
    }
}

function drawBackground(){
    // ctx.fillStyle = '#00FFFF';
    
    // 1000 ===> width of the canvas which I get from the index.html
    // 500 ===> is the height of the canvas which I also get from index.html 
    backgroundImg.move();
    // ctx.fillRect(0,0, 1000, 500);
    ctx.clearRect(0, 0, 6656, 468);
    backgroundImg.draw();
    //add some text
    ctx.fillStyle = 'Green';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, 800 , 50);
}

//create player
let player = {
    // color: "#00A",
    x: 220,
    y: 380,
    width: 80,
    height: 80,
    speedX : 0,
    speedY : 0,
    image: './images/player.png',
    draw: function (){
        const playerImg = new Image();
        playerImg.src = this.image;
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height)
    },
    newPos: function(){
        player.x += player.speedX;
        // player.y += player.speedY;
    },
    shoot: function (){
        console.log('pew pew');
        let bulletPosition = this.weapon();
        playerBullets.push(Bullet({
            speed:3,
            x: bulletPosition.x,
            y: bulletPosition.y
        }))
    },
    weapon: function (){
        return {
            x: this.x + (this.width - 10),
            y: this.y + (this.height - 51)
        };
    }
};

//empty array to store bullets
let playerBullets = [];
//a constructor to create bullet instances
function Bullet (e){
    e.active = true;
    e.xVelocity = e.speed;
    e.yVelocity = 0;
    e.width = 3;
    e.height = 3;
    e.color = "red";
    //set boundaries for bullets
    e.inBounds = function(){
        return e.x >= 0 && e.x <= 6656
            && e.y >= 0 && e.y <= 468;
    };
    e.draw = function (){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    e.update = function(){
        e.x += e.xVelocity;
        e.y += e.yVelocity;

        e.active = e.active && e.inBounds();
    }
    return e;
}

//empty array to store enemies
let enemies = [new Enemy(),new Enemy()];

//a constructor to create enemies instances
function Enemy (e){
    e = e || {};
    //set the current active enemy to true
    e.active = true;
    //position of enemy in canvas
    // e.x = 1200;
    e.x = Math.floor(Math.random() * 1200)
    e.y = 380;
    e.xVelocity = 1;
    //enemy in measures
    e.width = 80;
    e.height = 80;
    //keep enemies in bounds
    e.inBounds = function(){
        return e.x >= 0 && e.x <= 6656
            && e.y >= 0 && e.y <= 468;
    };
    e.image= './images/enemy.png';
    e.draw = function (){
        const enemyImg = new Image();
        enemyImg.src = this.image;
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height)
    },
    e.update = function (){
        //enemy starts at position x which changes negatively
        e.x -= e.xVelocity;
        e.xVelocity = 1; 
        //keep enemies in bounds
        e.active = e.active && e.inBounds();
    };
    e.die = function(){
        this.active = false;
    };
    return e;
};

function moveForward(){
    player.x += 10;
    console.log('Front')
}
function moveBackwards(){
    player.x -=10;
    console.log('back')
}

//move player
document.onkeydown = function(event){
    // console.log(event.keyCode);
    switch(event.keyCode){
        case 37:// back
            moveBackwards();
            break;
        case 39: // front
            moveForward();
            break;
        // case 38: // jump
        //     marioY -= 10;
        //     break; 
        case 16: // shoot
            player.shoot()
            break;
    }
}

//stop player
document.onkeyup =  function (event){
    stopMove();
  }
  function stopMove(){
    player.speedX = 0;
    player.speedY = 0;
 }

//draw everything in canvas
function drawEverything(){
    //add the new position of the bullet to the update step
    playerBullets.forEach(function(bullet){
        bullet.update();
    });
    //filter the list of bullet to only add the active bullets
    playerBullets = playerBullets.filter(function(bullet){
        return bullet.active;
    });
    
    //add the new enemy to the array of enemies
    enemies.forEach(function(enemy){
        console.log("ENEMY UPDATED!!!", enemy);
        enemy.update();
    });
    // filter the list of enemies
    enemies = enemies.filter(function(enemy){
        return enemy.active;
    })
    enemies.forEach(function(enemy){
            enemy.draw();
    });
    //check for collisions
    handleCollisions();

    
}

//animate the canvas 
function updateMyBoard(){
        //erase the whole canvas before drawing again
        ctx.clearRect(0, 0, 6656, 468);
        //draw moving background
        drawBackground();
        //draw player
        player.draw();
        player.newPos();
        playerBullets.forEach(function(bullet){
            bullet.draw();
        });
        
        drawEverything()
        // as long as isOver stays false, keep redrawing; 
        if(isOver === false){
            //re-draw the whole scene
            requestAnimationFrame(function(){
            //sets up a recursive loop (function calls itself multiple times)
            updateMyBoard();
        })
    }
}
//rectangular collision detection algorithm
function checkCollision (obj1,obj2){
    return obj1.y +  obj1.height - 10  >= obj2.y
        && obj1.y <= obj2.y + obj2.height
        && obj1.x +  obj1.width - 10 >= obj2.x
        && obj1.x <= obj2.x + obj2.width
}
// check for collisions
function handleCollisions(){
    playerBullets.forEach(function(bullet){
        enemies.forEach(function(enemy){
            if (checkCollision(bullet, enemy)){
                enemy.die();
                bullet.active = false;
            }
        });
    });
    enemies.forEach(function(enemy){
        if (checkCollision(enemy, player)){
            //double check how to kill player
            gameOver();
        }
    })
}


function gameOver(){
    // clear the canvas 
    ctx.clearRect(0,0, 6656, 468)
    // redraw the background
    drawBackground();
    // change the value of isOver to true to finish the game
    isOver = true;
    //display Game Over
    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText("Game Over", 400, 225);
}

// call drawingLoop() to start looping (after this point it will recursively call itself)
updateMyBoard();

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * <pre>
 * (x * 255).clamp(0, 255)
 * </pre>
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};