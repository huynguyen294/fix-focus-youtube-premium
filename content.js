let on = true;

const handleAddLayer = () => {
  const secondaryTab = document.querySelector("#fixed-columns-secondary #secondary");
  const primaryBelow = document.querySelector("#primary #below");
  const oldLayer = document.getElementById("primary-below-layer");

  let mode = "dark";
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--yt-spec-base-background").trim();
  if (bg.includes("#fff")) mode = "light";

  if (window.scrollY === 0 && on && secondaryTab && primaryBelow) {
    if (mode === "light") primaryBelow.style.opacity = 0.3;
    if (oldLayer) return oldLayer;
    const layer = document.createElement("div");
    layer.id = "primary-below-layer";

    const bgColor = mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)";
    layer.style.cssText = `position: absolute; top: 12px; left: -2px; width: calc(100% + 4px); height: 300px; background-color: ${bgColor}; filter: blur(3px); border-radius: 12px; z-index: 1000`;
    primaryBelow.appendChild(layer);
    return layer;
  }

  if (mode === "light") primaryBelow.style.opacity = 1;
  if (oldLayer) primaryBelow.removeChild(oldLayer);
};

//catching on
chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "toggleSwitch") {
    on = message.on;
    handleAddLayer();
  }
});

//handle observe youtube elements loading when primary element loaded
let added = false;
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const targetElement = document.getElementById("primary");
      if (targetElement && !added) {
        handleAddLayer();
        window.addEventListener("scroll", handleAddLayer);
        observer.disconnect();
        added = true;
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
