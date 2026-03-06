const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inPath = path.join(__dirname, '..', 'img', 'toposite.png'); // original
const baseDir = path.join(__dirname, '..', 'img');

async function run() {
    // 400px for mobile
    await sharp(inPath)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(path.join(baseDir, 'toposite-400.webp'));

    // 800px for tablets / small desktop
    await sharp(inPath)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(path.join(baseDir, 'toposite-800.webp'));

    // 1200px max
    await sharp(inPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(path.join(baseDir, 'toposite-1200.webp'));

    console.log('Hero srcset images generated');
}

run();
