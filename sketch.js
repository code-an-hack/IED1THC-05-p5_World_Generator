const gridColumns = 50;
const gridRows = 50;
const perlinNoiseScale = 0.12;
const radialGradientStart = 0.2;
const radialGradientEnd = 0.7;

let grid = [];
let cellWidth;
let cellHeight;

const thresholdWater = 0.2;
const thresholdSand = 0.4;
const thresholdGrass = 0.6;
const thresholdStone = 0.8;

let textureWater;
let textureSand;
let textureGrass;
let textureStone;
let textureRock;
let textureBush;

const rocksValueMin = 0.3;
const rocksValueMax = 0.55;
const rocksDensity = 0.05;
const rockSize = 8;

const bushValueMin = 0.35;
const bushValueMax = 0.7;
const bushDensity = 0.15;
const bushSize = 20;

function preload() {
  textureWater = loadImage("textures/water.jpg");
  textureSand = loadImage("textures/sand.jpg");
  textureGrass = loadImage("textures/grass.jpg");
  textureStone = loadImage("textures/stone.jpg");
  textureRock = loadImage("assets/rock.png");
  textureBush = loadImage("assets/bush.png");
}

function setup() {
  createCanvas(600, 600);
  cellWidth = width / gridColumns;
  cellHeight = height / gridRows;

  generateGridValues();
  drawIsland();
  const rocksPositions = placeAssets(rocksValueMin, rocksValueMax, rocksDensity);
  const bushPositions = placeAssets(bushValueMin, bushValueMax, bushDensity);
  drawAssets(rocksPositions, textureRock, rockSize);
  drawAssets(bushPositions, textureBush, bushSize);
}

function generateGridValues() {
  for (let i = 0; i < gridRows; i++) {
    grid[i] = [];
    for (let j = 0; j < gridColumns; j++) {
      grid[i][j] = getCellValue(j, i);
    }
  }
}

function drawIsland() {
  noStroke();
  for (let i = 0; i < gridRows; i++) {
    for (let j = 0; j < gridColumns; j++) {
      const cellValue = grid[i][j];
      const texture = getTextureForValue(cellValue);
      image(texture, j * cellWidth, i * cellHeight, cellWidth, cellHeight);
    }
  }
}

function placeAssets(valueMin, valueMax, density) {
  const positions = [];
  const n = max(1, floor(gridColumns * gridRows * density));
  for (let i = 0; i < n; i++) {
    const x = random(width);
    const y = random(height);
    const col = floor(x / cellWidth);
    const row = floor(y / cellHeight);
    if (col < 0 || col >= gridColumns || row < 0 || row >= gridRows) continue;
    const v = grid[row][col];
    if (v >= valueMin && v <= valueMax) positions.push({ x, y });
  }
  return positions;
}

function drawAssets(positions, texture, size) {
  if (!texture || texture.width <= 0) return;
  const half = size / 2;
  for (let i = 0; i < positions.length; i++) {
    const { x, y } = positions[i];
    image(texture, x - half, y - half, size, size);
  }
}

function getCellValue(col, row) {
  const n = noise(col * perlinNoiseScale, row * perlinNoiseScale);
  return constrain(n * getRadialFactor(col, row), 0, 1);
}
  
function getTextureForValue(normalizedValue) {
  if (normalizedValue < thresholdWater) return textureWater;
  if (normalizedValue < thresholdSand) return textureSand;
  if (normalizedValue < thresholdGrass) return textureGrass;
  return textureStone;
}

function getRadialFactor(col, row) {
  const cx = (gridColumns - 1) / 2;
  const cy = (gridRows - 1) / 2;
  const maxD = dist(0, 0, cx, cy);
  const d = dist(col, row, cx, cy);
  const t = d / maxD;
  if (t <= radialGradientStart) return 1;
  if (t >= radialGradientEnd) return 0;
  return map(t, radialGradientStart, radialGradientEnd, 1, 0);
}