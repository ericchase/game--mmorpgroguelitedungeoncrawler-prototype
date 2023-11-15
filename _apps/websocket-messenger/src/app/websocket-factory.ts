import uWS from 'uWebSockets.js';

const pathSet = new Set<string>();

export function addWebSocket(app: uWS.TemplatedApp, name: string) {
  if (!pathSet.has(name)) {
    pathSet.add(name);
    app.ws('/' + name, {
      compression: uWS.SHARED_COMPRESSOR,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 10,
      open: (ws) => {
        console.log('websocket connect /' + name);
        ws.subscribe('broadcast');
      },
      message: (ws, message, isBinary) => {
        console.log('websocket message /' + name);
        console.log(message);
        ws.publish('broadcast', message, isBinary);
      },
      drain: (ws) => {
        console.log('websocket backpressure /' + name);
        console.log('size ' + ws.getBufferedAmount());
      },
      close: (ws, code, message) => {
        console.log('websocket disconnect /' + name);
      },
    });
    return true;
  }
  return false;
}
