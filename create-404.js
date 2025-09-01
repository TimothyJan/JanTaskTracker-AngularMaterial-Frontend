const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'jan-task-tracker', 'browser');

// Check if the directory exists
if (fs.existsSync(distPath)) {
  const indexContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
  const fourOhFourContent = indexContent.replace('<base href="/JanTaskTracker-AngularMaterial-Frontend/">', '<base href="/">');

  fs.writeFileSync(path.join(distPath, '404.html'), fourOhFourContent);
  fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

  console.log('Created 404.html and .nojekyll for GitHub Pages in', distPath);
} else {
  console.error('Build directory not found:', distPath);
  console.error('Please run npm run build:gh-pages first');
  process.exit(1);
}
