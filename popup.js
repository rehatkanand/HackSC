// Send styling commands to background.js
function sendMessage(action, data = {}) {
  chrome.runtime.sendMessage({ action, ...data });
}

// Event listeners for the control panel inputs
document.getElementById("bgColor").addEventListener("input", (e) => {
  sendMessage("changeBackgroundColor", { color: e.target.value });
});

document.getElementById("fontSize").addEventListener("input", (e) => {
  sendMessage("changeFontSize", { size: e.target.value });
});

document.getElementById("fontColor").addEventListener("input", (e) => {
  sendMessage("changeFontColor", { color: e.target.value });
});

document.getElementById("fontFamily").addEventListener("change", (e) => {
  sendMessage("changeFontFamily", { font: e.target.value });
});

document.getElementById("layoutButton").addEventListener("click", () => {
  sendMessage("toggleLayout");
});

document.getElementById("blockAdsButton").addEventListener("click", () => {
  sendMessage("blockAds");
});

document.getElementById("startTimer").addEventListener("click", () => {
  const minutes = parseInt(document.getElementById("timerInput").value) || 1;
  sendMessage("startTimer", { minutes });
});

document.getElementById("pauseResumeTimer").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "pauseResumeTimer" });
});

// Listen for the button text update
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updatePauseButton") {
    document.getElementById("pauseResumeTimer").textContent = message.text;
  }
});

// Listen for updates from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTimerDisplay") {
    document.getElementById("timerDisplay").textContent = `Time left: ${request.time}`;
  }
});