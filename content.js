// // Listen for a message to play the sound
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'playBombSound') {
//         const audio = new Audio(chrome.runtime.getURL("converted_audio.wav"));
//         audio.play();
//   }
// });

// Attempt to play the sound immediately to check for accessibility
const audio = new Audio(chrome.runtime.getURL("converted_audio.wav"));
audio.play().then(() => {
  console.log("Alert sound played successfully from content.js.");
}).catch((error) => {
  console.error("Error playing alert sound from content.js:", error);
});
