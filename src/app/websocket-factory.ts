import uWS from 'uWebSockets.js';

const pathSet = new Set<string>();

export function addWebSocket(app: uWS.TemplatedApp, path: string) {
  if (!pathSet.has(path)) {
    pathSet.add(path);
    app.ws(path, {
      compression: uWS.SHARED_COMPRESSOR,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 10,
      open: (ws) => {
        console.log('A WebSocket connected on', path, '.');
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
