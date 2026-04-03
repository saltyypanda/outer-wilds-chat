const fs = require("fs");
const path = require("path");
const { Speakers } = require("./types.js");

const messagesPath = path.join(__dirname, "..", "conversations", "messages.json");

let messages = loadMessages();

const speakerEl = document.getElementById("speaker");
const statusEl = document.getElementById("status");
const messageEl = document.getElementById("message");
const input = document.getElementById("user-input");
const buttons = document.querySelectorAll(".img-button");

function loadMessages() {
  try {
    const raw = fs.readFileSync(messagesPath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load messages.json:", error);
    return [];
  }
}

function saveMessages() {
  try {
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error("Failed to save messages.json:", error);
  }
}

function addMessage(speaker) {
  const text = input.value.trim();
  if (!text) return;

  messages.push({
    speaker,
    text,
    timestamp: new Date().toISOString(),
  });

  saveMessages();
  input.value = "";
}

let currentIndex = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeMessage(text) {
  messageEl.textContent = "";
  for (let i = 0; i < text.length; i++) {
    messageEl.textContent += text[i];
    await sleep(35 + Math.random() * 20);
  }
}

async function runCycle() {
  while (true) {
    if (messages.length === 0) {
      speakerEl.textContent = "";
      statusEl.textContent = "no signal";
      messageEl.textContent = "No messages yet.";
      await sleep(2000);
      continue;
    }

    const msg = messages[currentIndex];

    speakerEl.textContent = Speakers[msg.speaker].name;
    statusEl.textContent = "incoming transmission...";
    messageEl.textContent = "";

    await sleep(900);
    statusEl.textContent = "connected";
    await sleep(1200);
    await typeMessage(msg.text);
    await sleep(3000);

    statusEl.textContent = "signal fading...";
    await sleep(1200);

    currentIndex = (currentIndex + 1) % messages.length;
  }
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addMessage("CHERT");
  }
});

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
  });
});

runCycle();