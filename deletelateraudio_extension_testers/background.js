chrome.action.onClicked.addListener((tab) => {
  chrome.tabCapture.capture({
      audio: true,
      video: false
  }, (stream) => {
      if (stream) {
          console.log("Audio stream captured:", stream);
          // You can now send this stream to an audio processing/transcription service
      } else {
          console.error("Failed to capture audio stream");
      }
  });
});