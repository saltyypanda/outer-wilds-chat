const {
  getMessageAt,
  getMessageCount,
} = require("./loader.js");

const {
  state,
  setSelectedPlanet,
  clearSelectedPlanet,
  setCurrentIndex,
  setMessages,
  addMessage
} = require("./state.js");

const { generateReply } = require("./llmAgent.js");
const { planetToPrompt } = require("./prompts.js");

const headerEl = document.getElementById("header");
const speakerEl = document.getElementById("speaker");
const statusEl = document.getElementById("status");
const messageEl = document.getElementById("message");
const input = document.getElementById("user-input");
const buttons = document.querySelectorAll(".img-button");
const disconnectButton = document.getElementById("disconnect-button");

let statusInterval = null;
let isBusy = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setStatus(text) {
  statusEl.textContent = text;
}

function startAnimatedStatus(baseText) {
  stopAnimatedStatus();

  let dots = 0;
  statusEl.textContent = baseText;

  statusInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    statusEl.textContent = `${baseText}${".".repeat(dots)}`;
  }, 400);
}

function stopAnimatedStatus() {
  if (statusInterval) {
    clearInterval(statusInterval);
    statusInterval = null;
  }
}

function setBusyState(busy) {
  isBusy = busy;
  input.disabled = busy;

  if (busy) {
    input.placeholder = "Signal channel busy...";
    input.blur();
    document.body.classList.add("busy");
  } else {
    input.disabled = false;
    input.placeholder = state.selectedPlanet
      ? "Send transmission..."
      : "Select a signal to begin...";
    document.body.classList.remove("busy");
    input.focus();
  }
}

function resetChatUI() {
  headerEl.textContent = "NO SIGNAL";
  speakerEl.textContent = "";
  setStatus("no active signal");
  messageEl.textContent = "";
}

async function typeMessage(text) {
  messageEl.style.color = "var(--text)";
  messageEl.textContent = "";
  document.body.classList.add("receiving");

  for (let i = 0; i < text.length; i++) {
    messageEl.textContent += text[i];
    messageEl.scrollTop = messageEl.scrollHeight;
    await sleep(35 + Math.random() * 20);
  }

  document.body.classList.remove("receiving");
}

async function startChat() {
  if (!state.selectedPlanet || !state.selectedSpeaker) {
    resetChatUI();
    return;
  }

  headerEl.textContent = `${state.selectedPlanet.split("-").join(" ").toUpperCase()} SIGNAL`;
  speakerEl.textContent = state.selectedSpeaker;
  setStatus(`locating ${state.selectedSpeaker}'s signal...`);
  messageEl.textContent = "";

  await sleep(Math.random() * 100 + 1200);
  setStatus("connected");
  input.placeholder = "Send transmission...";
}

input.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();

  if (isBusy) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  if (!state.selectedPlanet || !state.selectedSpeaker) {
    startAnimatedStatus("searching for signal");
    await sleep(1000 + Math.random() * 2000);
    stopAnimatedStatus();

    setStatus("no signal target");
    messageEl.style.color = "var(--error)";
    messageEl.textContent = "Your transmission was lost in space.";
    input.value = "";
    return;
  }

  try {
    setBusyState(true);

    const prompt = planetToPrompt[state.selectedPlanet];

    setStatus("transmission sent successfully");
    await sleep(1500);

    startAnimatedStatus("awaiting reply");

    const { text } = await generateReply({
      systemPrompt: prompt,
      history: state.messages,
      userMessage,
    });

    stopAnimatedStatus();
    setStatus("incoming transmission...");
    await sleep(500);

    await typeMessage(text);

    addMessage("user", userMessage);
    addMessage("assistant", text);
    input.value = "";

    setStatus("connected");
  } catch (error) {
    stopAnimatedStatus();
    console.error(error);
    setStatus("signal lost");
    messageEl.style.color = "var(--error)";
    messageEl.textContent = "Your transmission was lost in space. Try again.";
  } finally {
    setBusyState(false);
  }
});

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (isBusy) return;

    buttons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");

    const planetId = button.dataset.planet;
    setSelectedPlanet(planetId);

    startChat();
  });
});

disconnectButton.addEventListener("click", () => {
  if (isBusy) return;

  stopAnimatedStatus();
  clearSelectedPlanet();

  buttons.forEach((b) => b.classList.remove("selected"));
  resetChatUI();
});

resetChatUI();