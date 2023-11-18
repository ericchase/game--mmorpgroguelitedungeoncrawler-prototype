import uWS from 'uWebSockets.js';
import { v4 as uuidv4 } from 'uuid';

import { addWebSocket } from './app/websocket-factory';

import 'dotenv/config';
// const host = process.env.HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '8080');

const app = uWS.App({});

const rooms = new Set<string>();

app.get('/create', async (res, req) => {
  // create room id
  let id = uuidv4();
  while (rooms.has(id)) {
    id = uuidv4();
  }
  rooms.add(id);

  // create websocket for room
  addWebSocket(app, id);

  res.writeHeader('Access-Control-Allow-Origin', '*');
  res.end(id);
});

app.any('/*', (res, _req) => {
  res.close();
});

app.listen(port, (token) => {
  if (token) {
    console.log('URL:', `http://127.0.0.1:${port}/`);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});
