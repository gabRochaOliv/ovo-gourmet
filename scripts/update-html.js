const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace script with defer
html = html.replace(/<script src="script\.js"><\/script>/, '<script src="script.js" defer></script>');

// Preload the hero image in <head>
if (!html.includes('<link rel="preload" as="image" href="img/toposite.webp">')) {
    html = html.replace('</head>', '    <link rel="preload" as="image" href="img/toposite.webp" fetchpriority="high">\n</head>');
}

// Find all <img> tags
const imgRegex = /<img([^>]+)>/g;

async function run() {
    const matches = [...html.matchAll(imgRegex)];

    for (const match of matches) {
        const fullTag = match[0];
        let attrs = match[1];

        // We skip the pixel tracker image
        if (attrs.includes('facebook.com/tr')) continue;

        // Extract src
        const srcMatch = attrs.match(/src="([^"]+)"/);
        if (!srcMatch) continue;
        let src = srcMatch[1];

        // Convert src to .webp
        let newSrc = src.replace(/\.(png|jpg|jpeg|avif)$/i, '.webp');

        // Read dimensions using sharp
        let width = '';
        let height = '';
        try {
            const imgFile = path.join(__dirname, '..', newSrc);
            if (fs.existsSync(imgFile)) {
                const metadata = await sharp(imgFile).metadata();
                width = metadata.width;
                height = metadata.height;
            }
        } catch (e) { console.error(e); }

        // Build new tag
        let newTag = `<img src="${newSrc}"`;

        // Copy existing alt and class
        const altMatch = attrs.match(/alt="([^"]*)"/);
        if (altMatch) newTag += ` alt="${altMatch[1]}"`;

        const classMatch = attrs.match(/class="([^"]*)"/);
        if (classMatch) newTag += ` class="${classMatch[1]}"`;

        // Copy style if exists
        const styleMatch = attrs.match(/style="([^"]*)"/);
        if (styleMatch) newTag += ` style="${styleMatch[1]}"`;

        // Add width and height
        if (width && height && !attrs.includes('width=')) {
            newTag += ` width="${width}" height="${height}"`;
        } else if (attrs.includes('width=')) {
            const wMatch = attrs.match(/width="([^"]*)"/);
            const hMatch = attrs.match(/height="([^"]*)"/);
            if (wMatch) newTag += ` width="${wMatch[1]}"`;
            if (hMatch) newTag += ` height="${hMatch[1]}"`;
        }

        // Add loading="lazy" unless it's the LCP image
        if (newSrc.includes('toposite.webp') || attrs.includes('loading="eager"')) {
            newTag += ` fetchpriority="high" loading="eager"`;
        } else if (!attrs.includes('loading=')) {
            newTag += ` loading="lazy"`;
        }

        newTag += '>';

        html = html.replace(fullTag, newTag);
    }

    fs.writeFileSync(htmlPath, html);
    console.log('index.html updated successfully');
}

run();
