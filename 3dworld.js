const numBoxes = 20;
const boxSize = 10;
const terrainSize = numBoxes * boxSize;
const maxTerrainHeight = 100;
const maxSeaLevelHeight = 0.35 * maxTerrainHeight;



let sizeScreen = 600;
let perlinScale = 0.05;

const radius = numBoxes * boxSize * 3;
const cameraHeight = numBoxes * boxSize * 2;
const cameraRotationSpeed = 2* 10e-5;

const heightScale = 10;

const terrainLevels = {
  deepWater: 0.3,
  seaLevel: 0.35,
  sand: 0.4,
  grass: 0.65,
  darkGrass: 1,
};

const colorDict = {
  water: "#1098A6", // "blue
  shallowWater: "#1098A688", // "cyan transparent"
  sand: "#D4A463", // "yellow"
  grass: "#00ff00", // "green
  darkGrass: "#006400", // "darkgreen"
  treeTrunk: "#8B4513", // "saddlebrown"
  treeLeaves: "#228B22", // "forestgreen"
};

function setupLights() {
  ambientLight(100, 100, 100);
  directionalLight(200, 200, 200, -0.3, 1, 0.6);
}

function rotateCamera() {
  let millisec = millis() * cameraRotationSpeed;
  let camX = radius * cos(millisec);
  let camZ = radius * sin(millisec);
  camera(camX, -cameraHeight, camZ, 0, 0, 0, 0, 1, 0);
}

function getPerlinNoise(x, y) {
  return noise(x * perlinScale, y * perlinScale);
}

function assignBoxColor(noiseVal) {
  if (noiseVal < 0.3) {
    // blue like water
    return colorDict.water;
  } else if (noiseVal < 0.4) {
    // sand color
    return colorDict.sand;
  } else if (noiseVal < 0.65) {
    // green like grass
    return colorDict.grass;
  } else {
    // dark green
    return colorDict.darkGrass;
  }
}

function drawBox(i, j) {
  let x = i * boxSize;
  let y = j * boxSize;
  let perlinNoise = getPerlinNoise(i, j);

  c = assignBoxColor(perlinNoise);

  let boxHeight = map(perlinNoise, 0, 1, 0, maxTerrainHeight);


  push();
  fill(c);
  translate(x - terrainSize / 2, -boxHeight / 2, y - terrainSize / 2);
//   box(boxSize, boxHeight, boxSize);
  pop()

  if (boxHeight < maxSeaLevelHeight) {
    // console.log("water");
    drawSeaWater(x, y, boxHeight);
  }

}

function drawSeaWater(x, y, startingHeight) {
  let c = color(colorDict.shallowWater);

  let boxHeight = maxSeaLevelHeight - startingHeight;
  push()
  fill(c);
  translate(x - terrainSize / 2, -boxHeight / 2 - startingHeight - 0.01, y - terrainSize / 2);
  let scaler = 0.1
  box(boxSize, boxHeight, boxSize);
  pop()

}

function drawTerrain() {
  for (let i = 0; i < numBoxes; i++) {
    for (let j = 0; j < numBoxes; j++) {
      drawBox(i, j);
    }
  }
}

function setup() {
  createCanvas(sizeScreen, sizeScreen, WEBGL);
  noStroke();
}

function draw() {
  background(100);
  setupLights();
  rotateCamera();
  drawTerrain();
}
