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
        console.log('A WebSocket connected on /' + name + '.');
      },
      message: (ws, message, isBinary) => {
        // echo
        let ok = ws.send(message, isBinary, true);
      },
      drain: (ws) => {
        console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
      },
      close: (ws, code, message) => {
        console.log('WebSocket closed');
      },
    });
    return true;
  }
  return false;
}
