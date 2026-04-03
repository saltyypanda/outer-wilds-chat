const fs = require("fs");
const path = require("path");
const os = require("os");

// Base path: ~/.config/outer-wilds-chat/conversations
const baseConversationPath = path.join(
  os.homedir(),
  ".config",
  "outer-wilds-chat",
  "conversations"
);

function loadMessages(selectedPlanet, date) {
  if (!date) {
    date = new Date().toISOString().split("T")[0];
  }

  const planetFolder = path.join(baseConversationPath, selectedPlanet);
  const messagesPath = path.join(planetFolder, `${date}.json`);

  try {
    fs.mkdirSync(planetFolder, { recursive: true });

    if (!fs.existsSync(messagesPath)) {
      fs.writeFileSync(messagesPath, "[]");
      return [];
    }

    const raw = fs.readFileSync(messagesPath, "utf-8");

    if (!raw) return [];

    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load messages:", error);
    return [];
  }
}

function saveMessages(selectedPlanet, date, messages) {
  if (!date) {
    date = new Date().toISOString().split("T")[0];
  }

  const planetFolder = path.join(baseConversationPath, selectedPlanet);
  const messagesPath = path.join(planetFolder, `${date}.json`);

  try {
    fs.mkdirSync(planetFolder, { recursive: true });

    fs.writeFileSync(
      messagesPath,
      JSON.stringify(messages, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
}

function getMessageAt(messages, index) {
  if (!messages.length) return null;
  return messages[index];
}

function getMessageCount(messages) {
  return messages.length;
}

module.exports = {
  loadMessages,
  saveMessages,
  getMessageAt,
  getMessageCount,
};