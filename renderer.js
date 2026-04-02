const speakerEl = document.getElementById('speaker');
const statusEl = document.getElementById('status');
const messageEl = document.getElementById('message');

const messages = [
  {
    speaker: 'GABBRO',
    text: "Hey, no rush. You've still got time to breathe."
  },
  {
    speaker: 'CHERT',
    text: "I don't mean to worry you, but the stars feel strange today."
  },
  {
    speaker: 'FELDSPAR',
    text: "If something looks dangerous, that's usually where the good stuff is."
  },
  {
    speaker: 'RIEBECK',
    text: "I know it's scary, but learning things usually is."
  }
];

let currentIndex = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeMessage(text) {
  messageEl.textContent = '';
  for (let i = 0; i < text.length; i++) {
    messageEl.textContent += text[i];
    await sleep(28 + Math.random() * 20);
  }
}

async function runCycle() {
  while (true) {
    const msg = messages[currentIndex];

    speakerEl.textContent = msg.speaker;
    statusEl.textContent = 'incoming transmission...';
    messageEl.textContent = '';

    await sleep(900);

    statusEl.textContent = 'connected';
    await typeMessage(msg.text);

    await sleep(5000);

    statusEl.textContent = 'signal fading...';
    await sleep(1200);

    currentIndex = (currentIndex + 1) % messages.length;
  }
}

runCycle();
