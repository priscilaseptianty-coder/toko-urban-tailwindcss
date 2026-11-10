// ==========================================================================
// Kila Wonderland - Static Web Server (Local Dev & Vercel Serverless Ready)
// ==========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Explicit string literals so Vercel NFT (Node File Trace) bundles all files
const staticRegistry = {
  '/index.html': {
    contentType: 'text/html; charset=utf-8',
    isHtml: true,
    load: () => fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'),
  },
  '/detail-produk.html': {
    contentType: 'text/html; charset=utf-8',
    isHtml: true,
    load: () => fs.readFileSync(path.join(__dirname, 'detail-produk.html'), 'utf8'),
  },
  '/detail-tas.html': {
    contentType: 'text/html; charset=utf-8',
    isHtml: true,
    load: () => fs.readFileSync(path.join(__dirname, 'detail-tas.html'), 'utf8'),
  },
  '/dist/output.css': {
    contentType: 'text/css; charset=utf-8',
    load: () => fs.readFileSync(path.join(__dirname, 'dist', 'output.css'), 'utf8'),
  },
  '/output.css': {
    contentType: 'text/css; charset=utf-8',
    load: () => fs.readFileSync(path.join(__dirname, 'output.css'), 'utf8'),
  },
  '/style.css': {
    contentType: 'text/css; charset=utf-8',
    load: () => fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'),
  },
  '/script.js': {
    contentType: 'application/javascript; charset=utf-8',
    load: () => fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8'),
  },
  '/images/sepatu-urban.jpg': {
    contentType: 'image/jpeg',
    load: () => fs.readFileSync(path.join(__dirname, 'images', 'sepatu-urban.jpg')),
  },
  '/images/sepatu-urban.svg': {
    contentType: 'image/svg+xml',
    load: () => fs.readFileSync(path.join(__dirname, 'images', 'sepatu-urban.svg')),
  },
  '/images/tas-ransel.jpg': {
    contentType: 'image/jpeg',
    load: () => fs.readFileSync(path.join(__dirname, 'images', 'tas-ransel.jpg')),
  },
  '/images/tas-ransel.svg': {
    contentType: 'image/svg+xml',
    load: () => fs.readFileSync(path.join(__dirname, 'images', 'tas-ransel.svg')),
  },
};

// Pre-load all assets into memory at startup
const memoryCache = {};
for (const [route, entry] of Object.entries(staticRegistry)) {
  try {
    memoryCache[route] = {
      content: entry.load(),
      contentType: entry.contentType,
      isHtml: !!entry.isHtml,
    };
  } catch (err) {
    // If not found at direct path, try fallback
  }
}

// Ensure output.css and dist/output.css share content if one was loaded
if (!memoryCache['/dist/output.css'] && memoryCache['/output.css']) {
  memoryCache['/dist/output.css'] = memoryCache['/output.css'];
}
if (!memoryCache['/output.css'] && memoryCache['/dist/output.css']) {
  memoryCache['/output.css'] = memoryCache['/dist/output.css'];
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Check direct match in memory cache
  let asset = memoryCache[reqPath];

  // Check clean URLs (e.g. /detail-produk -> /detail-produk.html)
  if (!asset && memoryCache[reqPath + '.html']) {
    asset = memoryCache[reqPath + '.html'];
  }

  // Check CSS variations (e.g. any .css request for output.css)
  if (!asset && reqPath.endsWith('output.css')) {
    asset = memoryCache['/dist/output.css'] || memoryCache['/output.css'];
  }

  // Check script.js variation
  if (!asset && reqPath.endsWith('script.js')) {
    asset = memoryCache['/script.js'];
  }

  // If found in cache, serve immediately
  if (asset) {
    res.writeHead(200, {
      'Content-Type': asset.contentType,
      'Cache-Control': asset.isHtml ? 'no-cache' : 'public, max-age=86400, immutable',
    });
    res.end(asset.content);
    return;
  }

  // Fallback: check filesystem directly
  const directPath = path.join(__dirname, reqPath);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    const ext = path.extname(directPath).toLowerCase();
    const contentType = staticRegistry[reqPath]?.contentType || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(directPath).pipe(res);
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

if (require.main === module) {
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Kila Wonderland Server running at: http://localhost:${PORT}`);
  });
}

module.exports = server;
