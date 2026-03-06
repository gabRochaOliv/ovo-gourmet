const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// The critical-css injection got appended with weird characters like 
// and broke the DOM. Let's completely remove it.
html = html.replace(/<style id="critical-css">.*?<\/style>/g, '');
html = html.replace('', ''); // remove weird artifact

const cssPath = path.join(__dirname, '..', 'critical.css');
let criticalCss = '';
if (fs.existsSync(cssPath)) {
    criticalCss = fs.readFileSync(cssPath, 'utf8').replace(/\0/g, '').trim();
    // remove weird chars from critical CSS just in case
    criticalCss = criticalCss.replace(/[^a-zA-Z0-9\s\{\}\:\;\'\"\.\,\-\#\%\(\)\@\/\\]/g, '');
}

// Ensure head tags
html = html.replace('</head>', `    <style id="critical-css">${criticalCss}</style>\n</head>`);

fs.writeFileSync(htmlPath, html);
console.log('Fixed HTML critical CSS formatting');
