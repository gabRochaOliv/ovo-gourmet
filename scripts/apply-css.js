const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const cssPath = path.join(__dirname, '..', 'critical.css');

let html = fs.readFileSync(htmlPath, 'utf8');
let criticalCss = fs.readFileSync(cssPath, 'utf8').trim();
// clean up the binary encoding artifacts from PowerShell redirection if they exist
criticalCss = criticalCss.replace(/\0/g, '');

// 1. Inline Critical CSS
if (!html.includes('<style id="critical-css">')) {
    html = html.replace('</head>', `    <style id="critical-css">${criticalCss}</style>\n</head>`);
}

// 2. Load the main stylesheet asynchronously
html = html.replace(
    '<link rel="stylesheet" href="style.css?v=2">',
    `<link rel="preload" href="style.css?v=2" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css?v=2"></noscript>`
);

// 3. Optimize font loading
// The original is: <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
// Let's preload it and only use 300,400,500,600,700,800
html = html.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"\n        rel="stylesheet">',
    `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" as="style">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"></noscript>`
);
// Also clean up any duplicate preconnects that were already there
html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/g, '');
html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/g, '');

fs.writeFileSync(htmlPath, html);
console.log("Updated HTML with critical CSS and Font Loadings");
