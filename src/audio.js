const signalAudio = new Audio();
signalAudio.loop = true;

const TARGET_VOLUME = 0.1;
let fadeInterval = null;

function clearFade() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

function getAudioSrc(fileId, fileType = "mp3") {
    return `../assets/audio/${fileId}.${fileType}`;
}

function fadeInAudio(duration = 2200) {
  clearFade();

  const steps = 30;
  const stepTime = duration / steps;
  const volumeStep = TARGET_VOLUME / steps;

  signalAudio.volume = 0;

  fadeInterval = setInterval(() => {
    if (signalAudio.volume >= TARGET_VOLUME) {
      signalAudio.volume = TARGET_VOLUME;
      clearFade();
      return;
    }

    signalAudio.volume = Math.min(
      TARGET_VOLUME,
      signalAudio.volume + volumeStep
    );
  }, stepTime);
}

function playSignalAudio(planetId) {
  const fullPath = getAudioSrc(planetId);

  if (signalAudio.src.includes(fullPath)) return;

  clearFade();

  signalAudio.pause();
  signalAudio.src = fullPath;
  signalAudio.currentTime = 0;
  signalAudio.volume = 0;

  signalAudio.play()
    .then(() => fadeInAudio())
    .catch((error) => {
      alert("Failed to play audio signal: " + error.message);
      console.error("Audio playback failed:", error);
    });
}

function fadeOutAndStop(duration = 1000) {
  clearFade();

  const steps = 20;
  const stepTime = duration / steps;
  const volumeStep = TARGET_VOLUME / steps;

  fadeInterval = setInterval(() => {
    if (signalAudio.volume <= 0) {
      signalAudio.volume = 0;
      signalAudio.pause();
      signalAudio.currentTime = 0;
      clearFade();
      return;
    }

    signalAudio.volume = Math.max(
      0,
      signalAudio.volume - volumeStep
    );
  }, stepTime);
}

function playClickAudio() {
  const clickAudio = new Audio(getAudioSrc("click", "wav"));
    clickAudio.volume = 0.2;
  clickAudio.play().catch((error) => {
    console.error("Failed to play click audio:", error);
  });
}

function playMessageSentAudio() {
  const sentAudio = new Audio(getAudioSrc("message-sent"));
    sentAudio.volume = 0.3;
    sentAudio.currentTime = 0.8;
  sentAudio.play().catch((error) => {
    console.error("Failed to play message sent audio:", error);
  });
}

function playMessageReceivedAudio() {
  const receivedAudio = new Audio(getAudioSrc("message-received"));
  receivedAudio.volume = 0.3;
  receivedAudio.play().catch((error) => {
    console.error("Failed to play message received audio:", error);
  });
}

function playSweepAudio() {
  const sweepAudio = new Audio(getAudioSrc("sweep"));
    sweepAudio.volume = 0.3;
  sweepAudio.play().catch((error) => {
    console.error("Failed to play sweep audio:", error);
  });
}

module.exports = {
  playSignalAudio,
  fadeOutAndStop,
    playClickAudio,
    playMessageSentAudio,
    playMessageReceivedAudio,
    playSweepAudio
};