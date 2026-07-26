import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const BASE_PORT = parseInt(process.env.PORT || '4005', 10);

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`=============================================================`);
    console.log(`  BAHER SILVER ERP ENTERPRISE API SERVER STARTED             `);
    console.log(`  Port: ${port}                                              `);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}      `);
    console.log(`=============================================================`);
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
