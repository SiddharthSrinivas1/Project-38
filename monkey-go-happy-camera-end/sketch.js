var gameBackgroundImage, gameBackground;
var player, player_running, player_stop;
var ground;
var restart, restartImage;
var gameOver, gameOverImage;

var foodGroup, bananaImage, bananasImage;
var obstaclesGroup, obstacleImage;

var score = 0, gameEnd = 0;
var gameState = "play";

function preload()
{
  gameBackgroundImage = loadImage("jungle2.jpg");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  bananaImage = loadImage("Banana.png");
  bananasImage = loadImage("Bananas.png");
  obstacleImage = loadImage("stone.png");
  
  player_stop = loadImage("Monkey.png");
  player_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");
}

function setup()
{
  createCanvas(800, 400);
  
  gameBackground = createSprite(0, 0, 800, 400);
  gameBackground.addImage(gameBackgroundImage);
  gameBackground.scale = 1.5;
  gameBackground.x = gameBackground.width / 2;
  gameBackground.velocityX = -4;
  
  player = createSprite(100, 340, 20, 50);
  player.addAnimation("Running", player_running);
  player.addAnimation("Stop", player_stop);
  player.scale = 0.2;
  
  ground = createSprite(400, 350, 800, 10);
  ground.velocityX = -4;
  ground.x = ground.width / 2;
  ground.visible = false;
  
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 1;
  gameOver.visible = false;
  
  restart = createSprite(300, 140);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  foodGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw()
{
  background("white");
  
  if(gameState === "play")
  {
    ground.x = camera.x - 100;
    player.x = camera.x - 250;

    gameBackground.velocityX = -4;
    ground.velocityX = -4;

    if(ground.x < 0)
    {
      ground.x = ground.width / 2;
    }

    if(gameBackground.x < 100)
    {
      gameBackground.x = gameBackground.width / 2;
    }

    if(foodGroup.isTouching(player))
    {
      foodGroup.destroyEach();
      score = score + 2;
    }

    switch(score)
    {
      case 10:
        player.scale = 0.12;
        break;
      case 20:
        player.scale = 0.14;
        break;
      case 30:
        player.scale = 0.16;
        break;
      case 40:
        player.scale = 0.18;
        break;
      default: break;
    }

    if(keyDown("space") )
    {
      player.velocityY = -12;
    }
    player.velocityY = player.velocityY + 0.8;
    player.collide(ground);

    spawnFood();
    spawnObstacles();

    if(obstaclesGroup.isTouching(player))
    {
      obstaclesGroup.destroyEach();
      player.scale = 0.1;
      gameEnd++;
    }
    
    if(gameEnd > 1)
    {
      gameState = "end";
    }
  }
  else if(gameState === "end")
  {
    ground.velocityX = 0;
    gameBackground.velocityX = 0;
    
    player.velocityX = 0;
    player.velocityY = 0;
    player.changeAnimation("Stop", player_stop);
    
    foodGroup.destroyEach();
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart))
    {
      reset();
    }
  } 
  
  drawSprites();
  
  textSize(20);
  fill("white");
  stroke("white");
  text("Score: "+ score,500,50);
}

function reset()
{
  gameState = "play";
  gameEnd = 0;
  score = 0;
  
  player.scale = 0.1;
  player.changeAnimation("Running", player_running);
  
  gameOver.visible = false;
  restart.visible = false;
  
  foodGroup.destroyEach();
  obstaclesGroup.destroyEach();
}

function spawnFood()
{
  if (frameCount % 80 === 0)
  {
    var banana = createSprite(600, 250, 40, 10);
    banana.y = random(120, 200);
    
    var num = Math.round(random(1, 2)) ;
    if(num === 1)
    {
      banana.addImage(bananaImage);
    }
    else if(num === 2)
    {
      banana.addImage(bananasImage);
    }
    
    banana.scale = 0.05;
    banana.velocityX = -5;
    banana.lifetime = 300;
    
    banana.depth = player.depth;
    player.depth = player.depth + 1;

    foodGroup.add(banana);
  }
}

function spawnObstacles()
{
  if(frameCount % 300 === 0)
  {
    var obstacle = createSprite(800, 350, 10, 40);
    obstacle.addImage(obstacleImage);
    obstacle.setCollider("rectangle", 0, 0, obstacle.width, obstacle.height);
    obstacle.velocityX = -6;
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}