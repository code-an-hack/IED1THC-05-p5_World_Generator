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

function preload() {
  textureWater = loadImage("textures/water.jpg");
  textureSand = loadImage("textures/sand.jpg");
  textureGrass = loadImage("textures/grass.jpg");
  textureStone = loadImage("textures/stone.jpg");
}

function setup() {
  createCanvas(600, 600);
  cellWidth = width / gridColumns;
  cellHeight = height / gridRows;

  generateGridValues();
  drawIsland();
}

function generateGridValues() {
    for (let rowIndex = 0; rowIndex < gridRows; rowIndex++) {
    grid[rowIndex] = [];
    for (let columnIndex = 0; columnIndex < gridColumns; columnIndex++) {
      grid[rowIndex][columnIndex] = getCellValue(columnIndex, rowIndex);
    }
  }
}

function drawIsland() {
  noStroke();
  for (let rowIndex = 0; rowIndex < gridRows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < gridColumns; columnIndex++) {
      const cellValue = grid[rowIndex][columnIndex];
      const texture = getTextureForValue(cellValue);
      image(
        texture,
        columnIndex * cellWidth,
        rowIndex * cellHeight,
        cellWidth,
        cellHeight
      );
    }
  }
}

function getCellValue(columnIndex, rowIndex) {
    const noiseValue = noise(
      columnIndex * perlinNoiseScale,
      rowIndex * perlinNoiseScale
    );
    const radialFactor = getRadialFactor(columnIndex, rowIndex);
    return constrain(noiseValue * radialFactor, 0, 1);
  }
  
function getTextureForValue(normalizedValue) {
  if (normalizedValue < thresholdWater) return textureWater;
  if (normalizedValue < thresholdSand) return textureSand;
  if (normalizedValue < thresholdGrass) return textureGrass;
  return textureStone;
}

function getRadialFactor(columnIndex, rowIndex) {
  const centerColumn = (gridColumns - 1) / 2;
  const centerRow = (gridRows - 1) / 2;
  const maxDistanceFromCenter = dist(0, 0, centerColumn, centerRow);
  const distanceFromCenter = dist(columnIndex, rowIndex, centerColumn, centerRow);
  const normalizedDistance = distanceFromCenter / maxDistanceFromCenter;

  const start = radialGradientStart;
  const end = radialGradientEnd;

  if (normalizedDistance <= start) return 1;
  if (normalizedDistance >= end) return 0;
  return map(normalizedDistance, start, end, 1, 0);
}