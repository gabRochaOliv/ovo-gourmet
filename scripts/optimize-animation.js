const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The original pulse animation uses box-shadow which is a heavy operation.
// We replace it with a transform scale and opacity.
// It looks like: @keyframes pulse-anim{0%{box-shadow:0 0 0 0 rgba(139,203,155,.8);transform:scale(1)}70%{box-shadow:0 0 0 15px rgba(139,203,155,0);transform:scale(1.02)}100%{box-shadow:0 0 0 0 rgba(139,203,155,0);transform:scale(1)}}
const newPulse = `@keyframes pulse-anim{0%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:0.9}100%{transform:scale(1);opacity:1}}`;

css = css.replace(/@keyframes pulse-anim{.*?1\)\}\}/, newPulse);

fs.writeFileSync(cssPath, css);
console.log('Pulse animation optimized.');
