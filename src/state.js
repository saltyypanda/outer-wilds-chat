const { loadMessages, saveMessages } = require("./loader.js");

const planetToSpeaker = {
  "ember-twin": "CHERT",
  "brittle-hollow": "RIEBECK",
  "giants-deep": "GABBRO",
  "dark-bramble": "FELDSPAR",
};

const state = {
  selectedPlanet: null,
  selectedSpeaker: null,
  messages: [],
  currentIndex: 0,
  date: new Date().toISOString().split("T")[0],
};

function setSelectedPlanet(planetId) {
  state.selectedPlanet = planetId;
  state.selectedSpeaker = planetToSpeaker[planetId];
  state.currentIndex = 0;

  const date = new Date().toISOString().split("T")[0];
  if (state.date !== date) {
    state.date = date;
  }

  state.messages = loadMessages(planetId, date);
}

function clearSelectedPlanet() {
  state.selectedPlanet = null;
  state.selectedSpeaker = null;
  state.messages = [];
  state.currentIndex = 0;
}

function setCurrentIndex(index) {
  state.currentIndex = index;
}

function setMessages(messages) {
  state.messages = messages;
}

function addMessage(speaker, text) {
  const trimmed = text.trim();
  if (!trimmed || !state.selectedPlanet) return;

  const newMessage = {
    role: speaker,
    content: trimmed,
    timestamp: new Date().toISOString(),
  };

  state.messages.push(newMessage);
  saveMessages(state.selectedPlanet, state.date, state.messages);
}

module.exports = {
  state,
  planetToSpeaker,
  setSelectedPlanet,
  clearSelectedPlanet,
  setCurrentIndex,
  setMessages,
  addMessage,
};