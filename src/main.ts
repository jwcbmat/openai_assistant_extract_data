import app from './app';
import http from 'http';
import type { AddressInfo } from 'net';

async function bootstrap() {
  const expressApp = await app();
  const server = http.createServer(expressApp);

  server.listen(Number(process.env.PORT) || 3000, process.env.HOST || `localhost`, () => {
    const { address, port } = server.address() as AddressInfo;
    console.log(`Server is running at http://${address}:${port}!`);
  });
}

bootstrap();
