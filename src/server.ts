import uWS from 'uWebSockets.js';

import { addWebSocket } from './app/websocket-factory';

import 'dotenv/config';
// const host = process.env.HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '8080');

const app = uWS.App({});

app.get('/create/:name', (res, req) => {
  const name = req.getParameter(0);
  addWebSocket(app, name);
  res.writeHeader('Access-Control-Allow-Origin', '*');
  res.end('OK');
});

app.any('/*', (res, _req) => {
  res.close();
});

app.listen(port, (token) => {
  if (token) {
    console.log();
    console.log('URL:', `http://127.0.0.1:${port}/`);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});
