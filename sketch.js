var ground, invisibleGround, groundImage;
var trex, trex_running, trex_collided;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var PLAY = 0;
var END = 1;
var gameState = PLAY;
var cloudsGroup;
var cactusGroup;
var score;
var gameOver, gameOverImage;
var restart, restartImage;
var die, jump, checkpoint;
var trex_collided;
var crows, crowsGroup, crowsImage
localStorage["HighestScore"]=0

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkpoint.mp3");
  //crowsImage = loadImage("crow.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, height-20, 5, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.4;

  ground = createSprite(200, height-20, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -4;

  invisibleGround = createSprite(200, height-20, 400, 10);
  invisibleGround.visible = false;

  // console.log("Hello" + 5);

  score = 0;

  cloudsGroup = new Group();
  cactusGroup = new Group();
  //crowsGroup = new Group();

  trex.debug = true;
  // trex.setCollider("rectangle",0,0,100,100);
  trex.setCollider("circle", 0, 0, 50);

  gameOver = createSprite(width/2, height/2+100);
  gameOver.addImage("over", gameOverImage);
  gameOver.scale = 1.5;

  restart = createSprite(width/2, height/2+130);
  restart.addImage("restart", restartImage);
  restart.scale = 0.3;

}

function draw() {
  background(180);
  text("Score: " + score, width/2-200, height/2+140);
  text("HighestScore: "+localStorage["HighestScore"],width/2-300,height/2+140)

  //crow.velocityX = -4;
  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -(4+score/100);

    if (keyDown("space") && trex.y >= height-130) {
      trex.velocityY = -5;
      jump.play();
    }
    
    if (touches.length>0 && trex.y >= height-130) {
      trex.velocityY = -5;
      jump.play();
      touches=[]
    }

    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
    }

    score = score + Math.round(getFrameRate()/60);

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    gameOver.visible = false;
    restart.visible = false;
   // spawnCrows();
    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();
    if (cactusGroup.isTouching(trex)) {
      gameState = END;
      die.play();
      trex.changeAnimation("collided", trex_collided);
    }
    /*if (crowsGroup.isTouching(trex)) {
      gameState = END;
      die.play();
      trex.changeAnimation("collided", trex_collided);
    }*/
  } else if (gameState === END) {
    //move the ground
    ground.velocityX = 0;

    trex.velocityX = 0;
    trex.velocityY = 0;
    cloudsGroup.setVelocityXEach(0);
    cactusGroup.setVelocityXEach(0);
    //crowsGroup.setVelocityXEach(0);

    cactusGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    //crowsGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    if (touches.length || mousePressedOver(restart)) {
      restartGame();
    }
  }

  trex.collide(invisibleGround);
  console.log(trex.y)
  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(width-10, height-35, 10, 40);
    obstacle.velocityX = -(4+score/500);

    // //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = obstacle.x/obstacle.velocityX;
    cactusGroup.add(obstacle)
    
  }
}

/*function spawnCrows() {
  if (frameCount % 100 === 0) {
    crow = createSprite(600,50);
    crow.scale = 0.1;
    crow.addImage(crowImage);
    crow.y = Math.round(random(10, 60));
    
    crow.velocityX = -4;
    crow.lifetime = 400;
    crow.depth = trex.depth;
    trex.depth = trex.depth + 1;
    crowsGroup.add(crow);
  }

}*/

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random((height-100), (height-200)));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = cloud.x/cloud.velocityX;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function restartGame() {
  gameState = PLAY;
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();
  //crowsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);

  if (localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score
  }
  score = 0;
}


