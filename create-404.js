const fs = require('fs');
const path = require('path');

const indexContent = fs.readFileSync(path.join(__dirname, 'dist', 'jan-task-tracker', 'browser', 'index.html'), 'utf8');
const fourOhFourContent = indexContent.replace('<base href="/JanTaskTracker-AngularMaterial-Frontend/">', '<base href="/">');

fs.writeFileSync(path.join(__dirname, 'dist', 'jan-task-tracker', 'browser', '404.html'), fourOhFourContent);
fs.writeFileSync(path.join(__dirname, 'dist', 'jan-task-tracker', 'browser', '.nojekyll'), '');

console.log('Created 404.html and .nojekyll for GitHub Pages');
