const sizeScreen = 800;
let perlinScale = 0.05;

const numBoxes = 55;
const boxSize = 10;
const terrainSize = numBoxes * boxSize;
const maxTerrainHeight = 100;
const maxSeaLevelHeight = 0.35 * maxTerrainHeight;

const radius = numBoxes * 15; 
const cameraHeight = numBoxes * 10;
let timePerlin;
let useTimePerlin = true;

let stopCameraRotation = false;
let cameraRotationAngle = 0;
let cameraRotationSpeed = 3.5 * 10e-4;

const Tree = {
  trunkHeight: boxSize * 0.7,
  trunkWidth: boxSize / 4,
  leavesHeight: boxSize * 0.5,
  leavesWidth: boxSize / 1.5,
};

const terrainLevels = {
  deepWater: 0.2,
  sand: 0.4,
  grass: 0.65,
  minTreeHeight: 0.7,
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

function keyPressed() {
  if (key == "s") {
    console.log("stopCameraRotation");
    stopCameraRotation = !stopCameraRotation;
  }
  if (key == "r") {
    cameraRotationSpeed = -cameraRotationSpeed;
  }
  if (key == "n") {
    sampleNewNoieSeed();
  }
  if (key == "t") {
    useTimePerlin = !useTimePerlin;
  }
}

function checkKeyInput() {
  if (keyIsDown(UP_ARROW)) {
    cameraRotationSpeed *= 1.1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    cameraRotationSpeed /= 1.1;
  }
}

function setupLights() {
  ambientLight(100, 100, 100);
  directionalLight(200, 200, 200, -0.3, 1, 0.6);
}

function rotateCamera() {
  if (stopCameraRotation) return;
  cameraRotationAngle = (cameraRotationAngle + cameraRotationSpeed) % (2 * PI);
  let camX = radius * cos(cameraRotationAngle);
  let camZ = radius * sin(cameraRotationAngle);
  camera(camX, -cameraHeight, camZ, 0, 0, 0, 0, 1, 0);
}

function sampleTime(){
  if (useTimePerlin)
    timePerlin = millis() * 0.00005;
}

function sampleNewNoieSeed() {
  noiseSeed(random(100000));
}

function getPerlinNoise(x, y) {
  return noise(x * perlinScale, y * perlinScale, timePerlin);
}

function assignTerrainColor(noiseVal) {
  if (noiseVal < terrainLevels.deepWater) {
    return colorDict.water;
  } else if (noiseVal < terrainLevels.sand) {
    // sand color
    return colorDict.sand;
  } else if (noiseVal < terrainLevels.grass) {
    // green like grass
    return colorDict.grass;
  } else {
    // dark green
    return colorDict.darkGrass;
  }
}

function drawBox(x, y, z, c) {
  fill(c);
  push();
  translate(x - terrainSize / 2, -y / 2, z - terrainSize / 2);
  box(boxSize, y, boxSize);
  pop();
}

function drawSeaWater() {
  let c = color(colorDict.shallowWater);
  push();
  fill(c);
  translate(-boxSize / 2, -maxSeaLevelHeight / 2, -boxSize / 2);
  box(terrainSize - 0.1, maxSeaLevelHeight, terrainSize - 0.1);
  pop();
}

function drawTree(x, y, z) {
  let c = color(colorDict.treeTrunk);
  push();
  fill(c);
  translate(
    x - terrainSize / 2,
    -y - Tree.trunkHeight / 2,
    z - terrainSize / 2
  );
  box(Tree.trunkWidth, Tree.trunkHeight, Tree.trunkWidth);
  pop();

  c = color(colorDict.treeLeaves);
  push();
  fill(c);
  translate(
    x - terrainSize / 2,
    -y - Tree.trunkHeight - Tree.leavesHeight / 2,
    z - terrainSize / 2
  );
  box(Tree.leavesWidth, Tree.leavesHeight, Tree.leavesWidth);
  pop();
}

function drawTerrainTile(i, j) {
  let x = i * boxSize;
  let z = j * boxSize;
  let perlinNoise = getPerlinNoise(i, j);
  let boxHeight = map(perlinNoise, 0, 1, 0, maxTerrainHeight);
  let c = assignTerrainColor(perlinNoise);

  drawBox(x, boxHeight, z, c);
  if (perlinNoise > terrainLevels.minTreeHeight) {
    drawTree(x, boxHeight, z);
  }
}

function drawTerrain() {
  for (let i = 0; i < numBoxes; i++) {
    for (let j = 0; j < numBoxes; j++) {
      drawTerrainTile(i, j);
    }
  }

  drawSeaWater();
}

function setup() {
  createCanvas(sizeScreen, sizeScreen, WEBGL);
  noStroke();
  describe('A pink square with a red heart in the bottom-right corner.', LABEL);
}

function draw() {
  checkKeyInput();
  background(100);
  setupLights();
  rotateCamera();
  sampleTime()
  drawTerrain();
}