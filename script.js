(function () {
  const chars = ["c", "i", "m", "b", "i"];
  const charBoxes = document.querySelectorAll(".charBox");

  document.querySelector("#spin").addEventListener("click", spin);
  document.querySelector("#reset").addEventListener("click", init);

  function init(firstInit = true, groups = 1, duration = 1) {
    let i = 0;
    for (const charBox of charBoxes) {
      if (firstInit) {
        charBox.dataset.spinned = "0";
      } else if (charBox.dataset.spinned === "1") {
        return;
      }

      const boxes = charBox.querySelector(".char");
      const boxesClone = boxes.cloneNode(false);
      const pool = ["❓"];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          const char = chars[i];
          const filled = new Array(5).fill(char);
          arr.push(...filled);
        }
        pool.push(...arr);

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            charBox.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = charBox.clientWidth + "px";
        box.style.height = charBox.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        charBox.clientHeight * (pool.length - 1)
      }px)`;
      charBox.replaceChild(boxesClone, boxes);
      i++;
    }
  }
  async function spin() {
    init(false, 1, 2);

    for (const door of charBoxes) {
      const boxes = door.querySelector(".char");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
  }
  init();
})();
