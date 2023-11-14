import uWS from 'uWebSockets.js';

import 'dotenv/config';
import { addWebSocket } from './src/app/websocket-factory';
// const host = process.env.HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '8080');

const app = uWS
  .App({})
  .any('/*', (res, req) => {
    const path = req.getUrl();
    res.writeHeader('Access-Control-Allow-Origin', '*');
    if (addWebSocket(app, path)) {
      console.log('WebSocket on ' + path + ' created!');
      res.end('WebSocket on ' + path + ' created!');
    } else {
      console.log('WebSocket on ' + path + ' exists.');
      res.end('WebSocket on ' + path + ' exists.');
    }
  })
  .listen(port, (token) => {
    if (token) {
      console.log(token);
      console.log('Listening to port ' + port);
    } else {
      console.log('Failed to listen to port ' + port);
    }
  });
