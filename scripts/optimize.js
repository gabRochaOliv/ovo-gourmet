const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const Terser = require('terser');

const dirs = ['img', 'img/ovosDePistache', 'img/pessoas'];
const MAX_WIDTH_HERO = 1200;
const MAX_WIDTH_GRID = 800;

async function optimizeImages() {
    for (const dir of dirs) {
        const fullDir = path.join(__dirname, '..', dir);
        if (!fs.existsSync(fullDir)) continue;

        const files = fs.readdirSync(fullDir);
        for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg|webp)$/i)) {
                const filePath = path.join(fullDir, file);
                const name = path.parse(file).name;
                // Avoid optimizing the same webp file multiple times if name matches
                if (file.endsWith('.webp') && fs.statSync(filePath).size < 300000) {
                    console.log(`Skipping already optimized: ${file}`);
                    continue;
                }

                const outPath = path.join(fullDir, `${name}.webp`);
                let maxWidth = MAX_WIDTH_GRID;
                if (name === 'toposite' || name === 'cozinhando') {
                    maxWidth = MAX_WIDTH_HERO;
                }

                try {
                    await sharp(filePath)
                        .resize({ width: maxWidth, withoutEnlargement: true })
                        .webp({ quality: 75 })
                        .toFile(outPath + '.tmp');

                    fs.renameSync(outPath + '.tmp', outPath);
                    console.log(`Optimized ${file} -> ${name}.webp`);
                } catch (e) {
                    console.error(`Error optimizing ${file}:`, e);
                }
            }
        }
    }
}

async function minifyAssets() {
    // CSS
    const cssPath = path.join(__dirname, '..', 'style.css');
    if (fs.existsSync(cssPath)) {
        const cssCode = fs.readFileSync(cssPath, 'utf8');
        const minifiedCss = new CleanCSS({}).minify(cssCode).styles;
        fs.writeFileSync(cssPath, minifiedCss);
        console.log('Minified style.css');
    }

    // JS
    const jsPath = path.join(__dirname, '..', 'script.js');
    if (fs.existsSync(jsPath)) {
        const jsCode = fs.readFileSync(jsPath, 'utf8');
        const minifiedJs = await Terser.minify(jsCode);
        fs.writeFileSync(jsPath, minifiedJs.code);
        console.log('Minified script.js');
    }
}

async function run() {
    await optimizeImages();
    await minifyAssets();
}

run();
