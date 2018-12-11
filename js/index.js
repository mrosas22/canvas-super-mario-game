window.onload = function (){
    document.getElementById('start-button').onclick = function(){
      startGame();
    }
    let lastTime;
    function startGame (){
      myGameArea.start();
      let now = Date.now();
      let dt =  (now - lastTime) / 1000.0;
    //   update();
    //   drawEverything();
        
      //call the Player class to create the player
      player = new Player (80, 80, 220, 380)
      lastTime = now;
    //   requestAnimationFrame(startGame);
    }
    //global variables
    let enemies = [];
    let lastFire = Date.now();
    let gameTime = 0;
    let isGameOver;
    let terrainPattern;

    let score = 0;
    let scoreEl = document.getElementById('score');
    //create game area
    let myGameArea = {
      canvas : document.getElementById('my-canvas'),
      start : function(){
        this.canvas.width = 6656;
        this.canvas.height = 468;
        this.context = this.canvas.getContext ('2d');
        //schedule updates
        this.interval = setInterval(update, 20);
      },
      frames: 0,
      //clear the canvas
      clear : function (){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
    //   score: function() {
	// 	points = (Math.floor(this.frames/120))
	// 	this.context.font = '18px serif';
	// 	this.context.fillStyle = 'green';
	// 	this.context.fillText('Score: '+points, 800, 50);
	//     },

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
    //update game objects
    function update (){
        // gameTime += dt;
        updateGameArea();
        //check for collisions
        handleCollisions();

        scoreEl.innerHTML = score;
    }
    //hanlde input
     function moveForward(){
        player.speedX += 1;
    }
    function moveBackwards(){
        player.speedX -=1;
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
            //     player.speedY -= 10;
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
    
    //Updating the Scene
    function updateGameArea (){
        myGameArea.frames +=1;
        if (myGameArea.frames % 360 === 0) {
          x = myGameArea.canvas.width;
        //   randomNum = Math.floor(Math.random()* );
          enemies.push(new Enemy(80, 80, "green", x, 380));
        }
        
        drawEverything()
        
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
                    // Add score
                    score += 1;
                }
        
            });
        });
        enemies.forEach(function(enemy){
            if (checkCollision(enemy, player)){
                gameOver();
            }
        })
        
      }

    //draw eveything in canvas
    function drawEverything(){
        myGameArea.clear();
        //draw moving background
        drawBackground();
        //add the new position of the bullet to the update step
        playerBullets.forEach(function(bullet){
        bullet.update();
        });
        playerBullets.forEach(function(bullet){
            bullet.draw();
          });
        //filter the list of bullet to only add the active bullets
        playerBullets = playerBullets.filter(function(bullet){
            return bullet.active;
        });
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
        // myGameArea.score();
      
    
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
