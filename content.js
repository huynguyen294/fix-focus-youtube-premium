let on = true;
chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "toggleSwitch") {
    on = message.on;
  }
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const targetElement = document.getElementById("primary");
      if (targetElement) {
        console.log("mounted", { on });

        const handleAddHider = () => {
          const secondaryTab = document.querySelector("#fixed-columns-secondary #secondary");
          const primaryBelow = document.querySelector("#primary #below");
          const oldHider = document.getElementById("primary-below-hider");

          let mode = "dark";
          const bg = getComputedStyle(document.documentElement).getPropertyValue("--yt-spec-base-background").trim();
          if (bg.includes("#fff")) mode = "light";

          if (window.scrollY === 0 && on && secondaryTab && primaryBelow) {
            if (oldHider) return;
            const hider = document.createElement("div");
            hider.id = "primary-below-hider";

            const bgColor = mode === "dark" ? "#000" : "rgba(0,0,0,0.6)";
            hider.style.cssText = `position: absolute; top: 10px; left: -5px; width: calc(100% + 10px); height: 250px; background-image: linear-gradient(${bgColor}, transparent); opacity: 0.8; filter: blur(5px); border-radius: 12px; z-index: 1000`;
            primaryBelow.appendChild(hider);
            return;
          }

          if (oldHider) primaryBelow.removeChild(oldHider);
        };

        handleAddHider();
        window.addEventListener("scroll", handleAddHider);

        observer.disconnect();
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
