import { Request, Response, NextFunction } from 'express';

export function enforceHttpSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // 1. Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' http: https: ws: wss:;"
  );

  // 2. HTTP Strict Transport Security (HSTS) - 1 Year with Subdomains
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 3. X-Frame-Options (Prevent Clickjacking)
  res.setHeader('X-Frame-Options', 'DENY');

  // 4. X-Content-Type-Options (MIME Sniffing Protection)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 5. Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. X-XSS-Protection (Legacy Browser Defense)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 7. Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=()');

  next();
}
