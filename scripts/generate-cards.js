#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const suits = {
  'spades': { symbol: '♠', color: '#000000', name: 'S' },
  'hearts': { symbol: '♥', color: '#E74C3C', name: 'H' },
  'diamonds': { symbol: '♦', color: '#E74C3C', name: 'D' },
  'clubs': { symbol: '♣', color: '#000000', name: 'C' }
};

const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const outputDir = path.join(__dirname, '..', 'images', 'cards');

function generateCard(rank, suitName, suitData) {
  const color = suitData.color;
  const symbol = suitData.symbol;
  const fileName = `${rank}${suitData.name}.svg`;

  const svg = `<svg width="120" height="168" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .card-rank { font-family: 'Arial', sans-serif; font-size: 24px; font-weight: bold; fill: ${color}; }
      .card-suit-small { font-family: 'Arial', sans-serif; font-size: 20px; fill: ${color}; }
      .card-suit-large { font-family: 'Arial', sans-serif; font-size: 48px; fill: ${color}; }
    </style>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Card background -->
  <rect width="120" height="168" rx="8" fill="#ffffff" stroke="#cccccc" stroke-width="2" filter="url(#shadow)"/>

  <!-- Top left corner -->
  <text x="10" y="28" class="card-rank">${rank}</text>
  <text x="10" y="48" class="card-suit-small">${symbol}</text>

  <!-- Bottom right corner (rotated) -->
  <g transform="translate(110, 140) rotate(180)">
    <text x="0" y="20" class="card-rank">${rank}</text>
    <text x="0" y="40" class="card-suit-small">${symbol}</text>
  </g>

  <!-- Center suit symbol -->
  <text x="60" y="100" class="card-suit-large" text-anchor="middle">${symbol}</text>
</svg>`;

  return { fileName, svg };
}

function generateCardBack() {
  const svg = `<svg width="120" height="168" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="cardPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#0f4c75"/>
      <circle cx="10" cy="10" r="3" fill="#3282b8"/>
    </pattern>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Card background -->
  <rect width="120" height="168" rx="8" fill="#ffffff" stroke="#cccccc" stroke-width="2" filter="url(#shadow)"/>

  <!-- Inner pattern area -->
  <rect x="8" y="8" width="104" height="152" rx="6" fill="url(#cardPattern)"/>

  <!-- Center design -->
  <circle cx="60" cy="84" r="25" fill="none" stroke="#bbdefb" stroke-width="3"/>
  <circle cx="60" cy="84" r="18" fill="none" stroke="#bbdefb" stroke-width="2"/>
</svg>`;

  return { fileName: 'back.svg', svg };
}

// Generate all 52 cards
let count = 0;
for (const [suitName, suitData] of Object.entries(suits)) {
  for (const rank of ranks) {
    const { fileName, svg } = generateCard(rank, suitName, suitData);
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, svg);
    count++;
    console.log(`Generated: ${fileName}`);
  }
}

// Generate card back
const cardBack = generateCardBack();
const backPath = path.join(outputDir, cardBack.fileName);
fs.writeFileSync(backPath, cardBack.svg);
count++;
console.log(`Generated: ${cardBack.fileName}`);

console.log(`\nTotal: ${count} cards generated`);
