let sizeScreen = 600;
let numTiles = 40;
let tileSize = sizeScreen / numTiles;
let perlinScale = 0.005;

function keyPressed() {
  if (key == " ") {
    noiseSeed(millis());
  }
}

function assignTileColor(x, y){
  let noiseVal = noise(x * perlinScale, y * perlinScale);

   if (noiseVal < 0.3){
     // blue like water
      return color(0, 0, 200);
    }
    else if (noiseVal < 0.35){
      // sand color
      return color(255, 255, 0);
    }
    else if (noiseVal < 0.7){
      // green like grass
      return color(0, 200, 0);
    }else {
      // dark green
      return color(0, 100, 0);
    }
}

function drawTerrain(){
  for(let i = 0; i < numTiles; i++){
    for(let j = 0; j < numTiles; j++){
      let x = i * tileSize;
      let y = j * tileSize;
      c = assignTileColor(x, y);
      fill(c);
      rect(x, y, tileSize, tileSize);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  drawTerrain();
}


