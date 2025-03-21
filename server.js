const { createServer: createHttpsServer } = require('https');
const { createServer: createHttpServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('/etc/ssl/h-startup.kr_20250320D6C53.key.pem'),
  cert: fs.readFileSync('/etc/ssl/h-startup.kr_20250320D6C53.crt.pem'),
  ca: fs.readFileSync('/etc/ssl/h-startup.kr_20250320D6C53.all.crt.pem')
};

// Security headers
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

app.prepare().then(() => {
  // HTTPS Server
  createHttpsServer(httpsOptions, (req, res) => {
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(443, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Ready on https://h-startup.kr');
  });

  // HTTP redirect server
  createHttpServer((req, res) => {
    const hostname = req.headers.host?.split(':')[0] || 'h-startup.kr';
    res.writeHead(301, {
      Location: `https://${hostname}${req.url}`
    });
    res.end();
  }).listen(80, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> HTTP redirect server ready');
  });
}); 