window.onload = function (){
    document.getElementById('start-button').onclick = function(){
      startGame();
    }
  
    function startGame (){
      myGameArea.start();
      //call the Player class to create the player
      player = new Player (80, 80, 220, 380)
    }
    //global variables
    let enemies = [];
    let isOver = false;
    //create game area
    let myGameArea = {
      canvas : document.getElementById('my-canvas'),
      start : function(){
        this.canvas.width = 6656;
        this.canvas.height = 468;
        this.context = this.canvas.getContext ('2d');
        //schedule updates
        this.interval = setInterval(updateGameArea, 20);
      },
      frames: 0,
      //clear the canvas
      clear : function (){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
      stop: function(){
        clearInterval(this.interval);
      }
    }
    //create background image
    const img = new Image();
      img.src = './images/backgroundext.png'
    const backgroundImg = {
      img: img,
      x: 0,
      speed: 1,
      draw: function(){
        ctx = myGameArea.context;
          ctx.drawImage(this.img,this.x,0, 6656, 468)
          if (this.speed < 0){
              ctx.drawImage(this.img, this.x + 6656, 0,6656,468);
          }else{
              ctx.drawImage(this.img, this.x - this.img.width,0,6656, 468)
          };
      }
    }
    //create function to draw Background and animation
    function drawBackground(){
      ctx = myGameArea.context;
      //clear canvas
      ctx.clearRect(0, 0, 6656, 468);
      backgroundImg.draw();
      //add some text
      // ctx.fillStyle = 'Green';
      // ctx.font = '30px Arial';
      // ctx.fillText(`Score: ${score}`, 800 , 50);
  }
  
  
    //create player
    function Player (width, height, x, y){
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;
      this.image = "./images/player.png";
      this.update = function (){
        ctx = myGameArea.context;
        const playerImg = new Image();
        playerImg.src = this.image;
        ctx.drawImage(playerImg,this.x, this.y, this.width, this.height);
      };
      this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
      };
      this.shoot =  function (){
        console.log('pew pew');
        let bulletPosition =  this.weapon ();
        playerBullets.push(Bullet({
          speed: 3,
          x: bulletPosition.x,
          y: bulletPosition.y
        }))
      };
      this.weapon = function (){
        return {
          x: this.x + (this.width - 10),
          y: this.y + (this.height - 51)
        }
      }
    }
  
    //constructor to create enemies instances
    function Enemy (width, height, color, x, y){
      //set the current active enemy to true
      this.active = true;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.xVelocity = 1;
      //keep enemies in bounds
      this.inBounds = function(){
          return this.x >= 0 && this.x <= 6656
              && this.y >= 0 && this.y <= 468;
      };
      this.image= './images/enemy.png';
      this.draw = function (){
          const enemyImg = new Image();
          enemyImg.src = this.image;
          ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height)
      },
      this.update = function (){
          //enemy starts at position x which changes negatively
          this.x -= this.xVelocity;
          this.xVelocity = 1; 
          this.active = this.active && this.inBounds();
      };
      this.die = function(){
          this.active = false;
      };
    
    };
    //empty array to store bullets
    let playerBullets = [];
    //constructor to create bullet instances
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
  
    //draw eveything in canvas
    function drawEverything(){
      //add the new position of the bullet to the update step
      playerBullets.forEach(function(bullet){
          bullet.update();
      });
      //filter the list of bullet to only add the active bullets
      playerBullets = playerBullets.filter(function(bullet){
          return bullet.active;
      });
      
      //check for collisions
      handleCollisions();
    }
  
    //updating the canvas
    function updateGameArea (){
      myGameArea.clear();
      //draw moving background
      drawBackground();
      myGameArea.frames +=1;
      if (myGameArea.frames % 120 === 0) {
        x = myGameArea.canvas.width;
        height = Math.floor(Math.random()* x);
        enemies.push(new Enemy(80, 80, "green", x, 380));
      }
      //add the new enemy to the array of enemies
      enemies.forEach(function(enemy){
          enemy.update();
      });
      // filter the list of enemies
      enemies = enemies.filter(function(enemy){
          return enemy.active;
      })
      enemies.forEach(function(enemy){
              enemy.draw();
      });
  
      player.newPos();
      player.update();
      playerBullets.forEach(function(bullet){
        bullet.draw();
      });
      drawEverything()
      
    }
  
    //move player
    function moveForward(){
        player.speedX += 1;
        console.log('Front')
    }
    function moveBackwards(){
        player.speedX -=1;
        console.log('back')
    }
      
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
              gameOver();
          }
      })
    }
  
    //finish the game
    function gameOver(){
      // clear the canvas 
      myGameArea.clear();
      // redraw the background
      drawBackground();
      // change the value of isOver to true to finish the game
      isOver = true;
      myGameArea.stop()
      //display Game Over
      ctx.font = 'bold 70px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText("Game Over", 400, 225);
    }
  
    startGame();
  }