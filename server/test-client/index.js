import { base64ToKeyIv, decrypt, encrypt, generateKeyIv } from './aes.js';
import { $button, $div, $input, $span, $textarea, disable, enable, resizeSpanInput, setClipboard, swapInnerSpanInput } from './lib.js';

const tls = true;
const serverHost = tls
  ? 'divine-snow-2261.fly.dev' // remote server
  : '127.0.0.1:8778'; // local

const bConnect = $button('#connect');
const bDisconnect = $button('#disconnect');
const bGenerateKeyIv = $button('#generate-keyiv');
const bNewRoom = $button('#new-room');
const bSend = $button('#send');
const divOutput = $div('#output');
const inMessage = $input('#message');
const bCopyB64KeyIv = $button('#copy-b64-keyiv');
const divB64KeyIv = $div('#b64-keyiv');
const spanB64KeyIvText = $span('#b64-keyiv>span.text');
const taB64KeyIvInput = $textarea('#input-b64-keyiv');
const bCopyRoomId = $button('#copy-room-id');
const taRoomIdInput = $textarea('#input-room-id');
const divRoomId = $div('#room-id');
const spanRoomIdText = $span('#room-id>span.text');

for (const button of document.querySelectorAll('button')) {
  disable(button);
}
enable(bNewRoom);
enable(bGenerateKeyIv);

/** @type {WebSocket|null} */
let ws = null;
/** @type {CryptoKey|null} */
let key = null;
/** @type {Uint8Array|null} */
let iv = null;
let b64keyiv = '';

bNewRoom.addEventListener('click', async function () {
  const res = tls //
    ? await fetch('https://' + serverHost + '/create')
    : await fetch('http://' + serverHost + '/create');

  if (res.status === 200) {
    spanRoomIdText.textContent = await res.text();
    enable(bConnect);
    enable(bCopyRoomId);
  }
});

bGenerateKeyIv.addEventListener('click', async function () {
  [key, iv, b64keyiv] = await generateKeyIv();
  divB64KeyIv.textContent = b64keyiv;
  enable(bCopyB64KeyIv);
});

bConnect.addEventListener('click', async function () {
  if (ws === null) {
    try {
      ws = tls //
        ? new WebSocket('wss://' + serverHost + '/' + spanRoomIdText.textContent)
        : new WebSocket('ws://' + serverHost + '/' + spanRoomIdText.textContent);

      ws.onopen = function () {
        out('::CONNECTED::');
        disable(bConnect);
        enable(bDisconnect);
        enable(bSend);
      };
      ws.onclose = function () {
        ws = null;
        out('::DISCONNECTED::');
        enable(bConnect);
        disable(bDisconnect);
        disable(bSend);
      };
      ws.onmessage = async function (evt) {
        if (key && iv) {
          out(await decrypt(evt.data, key, iv));
        } else {
          out(evt.data);
        }
      };
      ws.onerror = function (evt) {
        console.log('::ERROR::', evt);
      };
    } catch (err) {
      console.log('::SERVER-ERROR::', err);
    }
  }
});

bDisconnect.addEventListener('click', function () {
  if (ws !== null) {
    ws.close();
  }
});

bSend.addEventListener('click', function () {
  send();
});

inMessage.addEventListener('keydown', function (evt) {
  switch (evt.key) {
    case 'Enter':
      send();
      break;
    case 'ArrowUp':
      showMessageHistoryUp();
      break;
    case 'ArrowDown':
      showMessageHistoryDown();
      break;
  }
});

divRoomId.addEventListener('click', async function () {
  swapInnerSpanInput(divRoomId, spanRoomIdText, taRoomIdInput);
});
taRoomIdInput.addEventListener('focusout', function () {
  swapInnerSpanInput(divRoomId, spanRoomIdText, taRoomIdInput);
});
taRoomIdInput.addEventListener('input', function () {
  spanRoomIdText.textContent = taRoomIdInput.value;
  resizeSpanInput(divRoomId, taRoomIdInput);
  if (ws) ws.close();
  disable(bDisconnect);
  if (spanRoomIdText.textContent) {
    enable(bConnect);
    enable(bCopyRoomId);
  } else {
    disable(bConnect);
    disable(bCopyRoomId);
  }
});
bCopyRoomId.addEventListener('click', function () {
  if (spanRoomIdText.textContent) {
    setClipboard(spanRoomIdText.textContent);
  }
});

divB64KeyIv.addEventListener('click', async function () {
  swapInnerSpanInput(divB64KeyIv, spanB64KeyIvText, taB64KeyIvInput);
});
taB64KeyIvInput.addEventListener('focusout', function () {
  swapInnerSpanInput(divB64KeyIv, spanB64KeyIvText, taB64KeyIvInput);
});
taB64KeyIvInput.addEventListener('input', async function () {
  divB64KeyIv.textContent = taB64KeyIvInput.value;
  resizeSpanInput(divB64KeyIv, taB64KeyIvInput);
  if (divB64KeyIv.textContent) {
    [key, iv] = await base64ToKeyIv(divB64KeyIv.textContent);
    enable(bCopyB64KeyIv);
  } else {
    disable(bCopyB64KeyIv);
  }
});
bCopyB64KeyIv.addEventListener('click', function () {
  if (divB64KeyIv.textContent) {
    setClipboard(divB64KeyIv.textContent);
  }
});

window.addEventListener('resize', function () {
  resizeSpanInput(divB64KeyIv, taB64KeyIvInput);
  resizeSpanInput(divRoomId, taRoomIdInput);
});

// Helper Functions

const messageHistory = [];
let historyIndex = 0;
let unsetMessage = '';
async function send() {
  if (ws !== null) {
    messageHistory.push(inMessage.value);
    historyIndex = messageHistory.length;
    if (key && iv) {
      ws.send(await encrypt(inMessage.value, key, iv));
    } else {
      ws.send(inMessage.value);
    }
    out('(me)', inMessage.value);
    inMessage.value = '';
    unsetMessage = '';
  }
}
function showMessageHistoryUp() {
  if (historyIndex === messageHistory.length) {
    unsetMessage = inMessage.value;
  }
  if (historyIndex > 0) {
    --historyIndex;
    inMessage.value = messageHistory[historyIndex];
  }
}
function showMessageHistoryDown() {
  if (historyIndex < messageHistory.length - 1) {
    ++historyIndex;
    inMessage.value = messageHistory[historyIndex];
  } else {
    historyIndex = messageHistory.length;
    inMessage.value = unsetMessage;
  }
}

/**
 * @param {*} message
 */
function out(...message) {
  const d = document.createElement('div');
  d.textContent = message.join(' ');
  divOutput.prepend(d);
}
