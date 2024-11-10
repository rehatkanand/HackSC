let timerInterval;
let remainingTime = 0;
let isPaused = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "changeBackgroundColor":
      executeOnPage(changeBackgroundColor, [request.color]);
      break;
    case "changeFontSize":
      executeOnPage(changeFontSize, [request.size]);
      break;
    case "changeFontColor":
      executeOnPage(changeFontColor, [request.color]);
      break;
    case "changeFontFamily":
      executeOnPage(changeFontFamily, [request.font]);
      break;
    case "toggleLayout":
      executeOnPage(toggleLayout);
      break;
    case "blockAds":
      executeOnPage(blockAds);
      break;
    case "startTimer":
      startTimer(request.minutes * 60);
      break;
    case "pauseTimer":
      pauseTimer();
      break;
  }
});

function executeOnPage(func, args = []) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func,
      args,
    });
  });
}

// Styling functions
function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;
}

function changeFontSize(size) {
  document.querySelectorAll("*").forEach(el => el.style.fontSize = `${size}px`);
}

function changeFontColor(color) {
  document.querySelectorAll("*").forEach(el => el.style.color = color);
}

function changeFontFamily(font) {
  document.querySelectorAll("*").forEach(el => el.style.fontFamily = font);
}

function toggleLayout() {
  document.querySelectorAll("header, footer, aside").forEach(el => {
    el.style.display = el.style.display === "none" ? "" : "none";
  });
}

function blockAds() {
  document.querySelectorAll(".ad, [id*='ad'], [class*='ad']").forEach(el => {
    el.style.display = "none";
  });
}

// Timer functions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "startTimer":
      startTimer(request.minutes * 60);
      break;
    case "pauseResumeTimer":
      togglePauseResumeTimer();
      break;
  }
});

function startTimer(duration) {
  remainingTime = duration;
  clearInterval(timerInterval);
  isPaused = false;

  timerInterval = setInterval(() => {
    if (!isPaused) {
      remainingTime -= 1;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      // Update the timer display in the popup
      chrome.runtime.sendMessage({ action: "updateTimerDisplay", time: timeString });

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        playAlertSound();
        chrome.runtime.sendMessage({ action: "updateTimerDisplay", time: "Time's up!" });
      }
    }
  }, 1000);
}

function togglePauseResumeTimer() {
  isPaused = !isPaused;
  const buttonText = isPaused ? "Resume Timer" : "Pause Timer";
  chrome.runtime.sendMessage({ action: "updatePauseButton", text: buttonText });
}

function playAlertSound() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        // Directly play the audio file
        const audio = new Audio(chrome.runtime.getURL("converted_audio.wav"));
        
        // Play the audio with error handling
        audio.play().then(() => {
          console.log("Alert sound played successfully.");
        }).catch((error) => {
          console.error("Error playing alert sound:", error);
        });
      },
    });
  });
}
