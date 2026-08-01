import app from './app';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { SecurityHardeningService } from './services/security_hardening.service';

dotenv.config();

const BASE_PORT = parseInt(process.env.PORT || '4000', 10);

async function runBootSecurityDiagnostic() {
  try {
    const health = await SecurityHardeningService.calculateSecurityHealthScore();
    console.log('\n🔒 [STARTUP SECURITY HEALTH CHECK DIAGNOSTIC]');
    console.log(`   Overall Score: ${health.totalScore}/100 (${health.passedTarget ? 'PASS >= 95%' : 'WARN < 95%'})`);
    console.log(`   Audit Chain Integrity: ${health.chainVerification.isValid ? 'VALID' : 'CORRUPTED'}`);
    health.categories.forEach(cat => {
      console.log(`   - ${cat.nameAr}: ${cat.score}/${cat.maxScore} [${cat.status}]`);
    });
    console.log('-------------------------------------------------------------\n');
  } catch (e) {
    console.warn('⚠️ Boot security diagnostic skipped:', e);
  }
}

function startServer(port: number) {
  const server = app.listen(port, async () => {
    const url = `http://localhost:${port}`;
    console.log(`=============================================================`);
    console.log(`  BAHER SILVER ERP ENTERPRISE SERVER STARTED                 `);
    console.log(`  Web App URL: ${url}                                        `);
    console.log(`  API Health:  ${url}/health                                 `);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}      `);
    console.log(`=============================================================`);

    await runBootSecurityDiagnostic();

    // Auto-open browser on Windows if in development
    if (process.platform === 'win32' && process.env.NODE_ENV !== 'test' && !process.env.NO_AUTO_OPEN) {
      setTimeout(() => {
        exec(`start ${url}`, () => {});
      }, 1000);
    }
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, attempting port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server boot error:', err);
    }
  });
}

startServer(BASE_PORT);
