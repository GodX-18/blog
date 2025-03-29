<script setup lang="ts">
import confetti from "canvas-confetti";
import { inBrowser } from "vitepress";


if (inBrowser) {
  const end = Date.now() + 10 * 1000;

  // go Buckeyes!
  const colors = [
    "#ff0000", // Red
    "#ffa500", // Orange
    "#ffff00", // Yellow
    "#008000", // Green
    "#0000ff", // Blue
    "#4b0082", // Indigo
    "#ee82ee"  // Violet
  ];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    //   colors: colors
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    //   colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
</script>
