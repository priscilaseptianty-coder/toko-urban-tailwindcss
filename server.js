// ==========================================================================
// Kila Wonderland - Static Web Server (Local Dev & Vercel Serverless Ready)
// ==========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

// Pre-load CSS into memory so it is ALWAYS available immediately
let cachedCSS = '';
const cssCandidates = [
  path.join(__dirname, 'dist', 'output.css'),
  path.join(__dirname, 'output.css'),
  path.join(process.cwd(), 'dist', 'output.css'),
  path.join(process.cwd(), 'output.css'),
  path.join(__dirname, 'style.css'),
];
for (const cand of cssCandidates) {
  try {
    if (fs.existsSync(cand)) {
      cachedCSS = fs.readFileSync(cand, 'utf8');
      if (cachedCSS && cachedCSS.length > 500) break;
    }
  } catch (e) {}
}

// Pre-load JS into memory
let cachedJS = '';
const jsCandidates = [
  path.join(__dirname, 'script.js'),
  path.join(process.cwd(), 'script.js'),
];
for (const cand of jsCandidates) {
  try {
    if (fs.existsSync(cand)) {
      cachedJS = fs.readFileSync(cand, 'utf8');
      if (cachedJS && cachedJS.length > 50) break;
    }
  } catch (e) {}
}

function resolveExistingFile(reqPath) {
  const candidates = [
    path.join(__dirname, reqPath),
    path.join(process.cwd(), reqPath),
    path.join(__dirname, 'dist', path.basename(reqPath)),
    path.join(process.cwd(), 'dist', path.basename(reqPath)),
    path.join(__dirname, 'images', path.basename(reqPath)),
    path.join(process.cwd(), 'images', path.basename(reqPath)),
  ];

  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        return c;
      }
    } catch (e) {}
  }
  return null;
}

const server = http.createServer((req, res) => {
  // Normalize URL and remove query strings
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Fast path for CSS (dist/output.css, output.css, style.css)
  if (reqPath.endsWith('.css')) {
    const existingCss = resolveExistingFile(reqPath);
    let cssBody = '';
    if (existingCss) {
      try {
        cssBody = fs.readFileSync(existingCss, 'utf8');
      } catch (e) {}
    }
    if (!cssBody) {
      cssBody = cachedCSS;
    }
    if (cssBody) {
      res.writeHead(200, {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      });
      res.end(cssBody);
      return;
    }
  }

  // Fast path for script.js
  if (reqPath.endsWith('script.js')) {
    const existingJs = resolveExistingFile(reqPath);
    let jsBody = '';
    if (existingJs) {
      try {
        jsBody = fs.readFileSync(existingJs, 'utf8');
      } catch (e) {}
    }
    if (!jsBody) {
      jsBody = cachedJS;
    }
    if (jsBody) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      });
      res.end(jsBody);
      return;
    }
  }

  // Resolve file on filesystem
  const resolvedPath = resolveExistingFile(reqPath);
  if (resolvedPath) {
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
    });

    const readStream = fs.createReadStream(resolvedPath);
    readStream.pipe(res);
    return;
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="id">
    <head><meta charset="utf-8"><title>404 - Halaman Tidak Ditemukan</title></head>
    <body style="font-family:sans-serif; text-align:center; padding:50px;">
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p><a href="/">Kembali ke Beranda</a></p>
    </body>
    </html>
  `);
});

// Support both standalone Node.js and Vercel Serverless Function
if (require.main === module) {
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Kila Wonderland Server running at: http://localhost:${PORT}`);
  });
}

module.exports = server;
