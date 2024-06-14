const btn = document.getElementById("turnOnBtn");

let on = true;
const handleOn = () => {
  on = true;
  btn.innerText = "Turn off";
  chrome.tabs.query({ active: true }, function (tabs) {
    console.log({ tabs });
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSwitch", on }, function (response) {
      if (chrome.runtime.lastError) {
        console.error("Could not send message:", chrome.runtime.lastError);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
  console.log("on changed", on);
};

const handleOff = () => {
  on = false;
  btn.innerText = "Turn on";
  chrome.tabs.query({ active: true }, function (tabs) {
    console.log({ tabs });
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSwitch", on }, function (response) {
      if (chrome.runtime.lastError) {
        console.error("Could not send message:", chrome.runtime.lastError);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
  console.log("on changed", on);
};

btn.addEventListener("click", () => {
  if (on) return handleOff();
  handleOn();
});
