function saveToFile(blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  let name = generateRandomName() + ".wav"
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  a.remove();

  // add code to send test.wav to main.py.
  send_audio(name);
}

function generateRandomName() {
  let min = 1;
  let max = 10000;
  let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  let str = randomInt.toString();
  return str;
}

function captureTabAudio() {
  chrome.tabCapture.capture({audio: true, video: false}, (stream) => {
    // these lines enable the audio to continue playing while capturing
    context = new AudioContext();
    var newStream = context.createMediaStreamSource(stream);
    newStream.connect(context.destination);

    recorder = new MediaRecorder(stream);
    const chunks = [];
    
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = () => {
      saveToFile(new Blob(chunks));
    };

    recorder.start();  // Start the recording immediately
    console.log("Recording started...");
  });
}

//////////////////// Only field Colleen "should" need to edit

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("share-audio-button").addEventListener("click", function () {
      captureTabAudio();
  })

  document.getElementById('stopButton').addEventListener('click', () => {
    recorder.stop();  // Stop the recording
    console.log("Recording stopped...");
  });
});

/////////////////

async function send_audio(name) {
  console.log("Reached2");
  // TODO
  
  let filename = "C:/Users/colle/Downloads/" + name;

  try {
    const response = await fetch("http://127.0.0.1:8000/audio_advice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"filename": filename})
    });
    const result_text = document.getElementById("result");
    const data = await response.json();
      if (data.status === "success") {
        console.log(data.msg);  // Show success message
        result_text.innerText = data.msg;
      } else {
          console.error("Login failed:", data.msg);  // Handle error message
      }
    } catch (error) {
      console.error("Error:", error);
    }
};