//Create variables here
var dog;
var dogImg;
var happyDog;
var database;
var foodS;
var foodStock;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var feedDodBool=false;

function preload()
{
  	//load images here
  dogImg=loadImage("Images/Dog.png")
  happyDog = loadImage("Images/happydog.png")

}

function setup() {
  createCanvas(1000, 500);
  
  database = firebase.database();
  foodStock = database.ref("Food");
  foodStock.on("value", readStock);
  // foodStock.set(20);

  dog = createSprite(850,250,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();
}


function draw() {  

  background(46,139,87);

  

  // if(keyWentDown(UP_ARROW)){
  //   writeStock(foodS)
  //   dog.addImage(happyDog);
  // }

  drawSprites();

  foodObj.display();
  
  noStroke();
  textSize(20)
  fill("white")
  text(foodS, 225, 100)

  fedTime = database.ref("FeedTime");
  fedTime.on("value", function(data){
    lastFed = data.val();
  })
  
  //stroke("black");


  //add styles here

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed % 12 + "PM", 320, 30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM", 350, 30);
  }else{
    text("Last Feed : "+ lastFed + "AM", 320, 30);
  }

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  
  database.ref("/").update({
    Food:x
  });
}

function feedDog(){
  dog.addImage(happyDog);
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    imageMode(CENTER);
        feedDodBool=true;
  }
  // foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food :  foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  feedDodBool=false;
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}