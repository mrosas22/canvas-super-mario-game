// get the canvas tag using .getElementById() method
const myCanvas = document.getElementById('my-canvas');

//conext has all the methods for drawing things
const ctx = myCanvas.getContext('2d');

//global variables
let score = 0;
let isOver = false;
const img = new Image();
    img.src = './images/background.png'
    // ctx.fillStyle = '#00FFFF';
const backgroundImg = {
    img: img,
    x: 0,
    speed: -1,
    move: function(){
        this.x += this.speed;
        this.x %= myCanvas.width; 
    },
    draw: function(){
        ctx.drawImage(this.img,this.x,0, 1200, 500)
        // ctx.drawImage(this.img, this.x, 0);
        if (this.speed < 0){
            ctx.drawImage(this.img, this.x + myCanvas.width, 0,1200,500);
        }else{
            ctx.drawImage(this.img, this.x - this.img.width,0,1200, 500)
        };
    }
}

function drawBackground(){
    // ctx.fillStyle = '#00FFFF';
    
    // 1000 ===> width of the canvas which I get from the index.html
    // 500 ===> is the height of the canvas which I also get from index.html 
    backgroundImg.move();
    // ctx.fillRect(0,0, 1000, 500);
    ctx.clearRect(0, 0, 100, 500);
    backgroundImg.draw();
    //add some text
    ctx.fillStyle = 'Green';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, 800 , 50);
}

// drawBackground();
const fireballImg = new Image();
const marioImg = new Image();

// "src" has to point as the image is used in HTML file
fireballImg.src = './images/fireball.png';
marioImg.src = './images/mario.png';

let fireballX = 800;
let fireballY = 200;

let marioX = 0;
let marioY = 200;

//move superman
document.onkeydown = function(event){
    // console.log(event.keyCode);
    switch(event.keyCode){
        case 37:// left
            marioX -= 10;
            break;
        case 39: // right
            marioX += 10;
            break;
        case 38: // up
            marioY -= 10;
            break; 
        case 40: // down
            marioY += 10;
            break;
    }
}

//animate the canvas
 
function drawingLoop(){
    //erase the whole canvas before drawing again
    ctx.clearRect(0, 0, 1200, 500);

    drawBackground();
    // start moving fireball by changing it X coordinate in every loop call
    fireballX -= 5;
    // when the fireball disappears from the canvas
    if(fireballX < -50){
        // set its x again to fireballX=1000
        fireballX = 1200;
        // and for each ball pick random Y in range 0 to 450 (which is height of the canvas - the height of the fireball)
        fireballY = Math.floor(Math.random() * 400);
    }

    drawEverything()
    // as long as isOver stays false, keep redrawing; 
    if(isOver === false){
    //re-draw the whole scene
    requestAnimationFrame(function(){
        //sets up a recursive loop (function calls itself multiple times)
        drawingLoop();
    })
}
}

function drawEverything(){
    
    ctx.drawImage(fireballImg,fireballX, fireballY, 80, 80);

    ctx.drawImage(marioImg, marioX, marioY, 150, 150);

    if (checkCollision(marioX,marioY, fireballX, fireballY)){
        // console.log('crashed!!!')
        gameOver();
    }

    // manage the score here
    if(fireballX === 0){
        score++;
    }
}
// all 4 conditions need to be true in order to return true 
function checkCollision (obj1x, obj1y, obj2x, obj2y){
    // supermanY + superman-height >= fireballY
    return obj1y + 150 - 30 >= obj2y
        // supermanY <= fireballY + fireball-height
        && obj1y <= obj2y + 80
        // supermanX + superman-width >= fireballX
        && obj1x + 150 - 50 >= obj2x
        // supermanX <= fireballX + fireball-width
        && obj1x <= obj2x + 50
}

function gameOver(){
    // clear the canvas because I don't want to see alive superman and the fireball
    ctx.clearRect(0,0, 1200, 500)
    // redraw the background
    drawBackground();
    // create defeated_superman image
    const defeatedMario = new Image();
    // point to the src where is the image itself
    defeatedMario.src = "./images/defeated-mario.png"
    //load defeteated superman img with coordinates x,y
    defeatedMario.onload = function (){
        ctx.drawImage(defeatedMario, 480, 290, 150, 150)
    }
    //// change the value of isOver to true to finish the game
    isOver = true;
    //display Game Over
    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText("Game Over", 400, 225);
}

// call drawingLoop() to start looping (after this point it will recursively call itself)
drawingLoop();