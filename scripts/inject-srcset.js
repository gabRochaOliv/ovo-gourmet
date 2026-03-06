const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// The original preload: <link rel="preload" as="image" href="img/toposite.webp" fetchpriority="high">
// Change to responsive preload
html = html.replace(
    '<link rel="preload" as="image" href="img/toposite.webp" fetchpriority="high">',
    `<link rel="preload" as="image" href="img/toposite-1200.webp" imagesrcset="img/toposite-400.webp 400w, img/toposite-800.webp 800w, img/toposite-1200.webp 1200w" imagesizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px" fetchpriority="high">`
);

// The original image: <img src="img/toposite.webp" alt="Aviso Especial" width="1200" height="342" fetchpriority="high" loading="eager">
// Change to responsive img
html = html.replace(
    '<img src="img/toposite.webp" alt="Aviso Especial" width="1200" height="342" fetchpriority="high" loading="eager">',
    `<img src="img/toposite-1200.webp" srcset="img/toposite-400.webp 400w, img/toposite-800.webp 800w, img/toposite-1200.webp 1200w" sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px" alt="Aviso Especial" width="1200" height="342" fetchpriority="high" loading="eager">`
);

fs.writeFileSync(htmlPath, html);
console.log('injected responsive hero into html');
