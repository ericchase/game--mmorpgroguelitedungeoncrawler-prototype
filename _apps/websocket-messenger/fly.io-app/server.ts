import uWS from 'uWebSockets.js';
import { v4 as uuidv4 } from 'uuid';

import { addWebSocket } from './websocket-factory';

// import 'dotenv/config';
// const host = process.env.HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '3000');

const app = uWS.App({});

const rooms = new Set<string>();

app.get('/create', async (res, req) => {
  console.log(req.getUrl());

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

app.any('/*', (res, req) => {
  console.log(req.getUrl());
  res.close();
});

app.listen(port, (token) => {
  if (token) {
    console.log('URL:', `http://0.0.0.0:${port}/`);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});
