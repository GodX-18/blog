<script setup lang="ts">
import confetti from "canvas-confetti";
import { inBrowser } from "vitepress";


if (inBrowser) {
  var duration = 15 * 1000;
var animationEnd = Date.now() + duration;
var skew = 1;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

(function frame() {
  var timeLeft = animationEnd - Date.now();
  var ticks = Math.max(200, 500 * (timeLeft / duration));
  skew = Math.max(0.8, skew - 0.001);

  confetti({
    particleCount: 1,
    startVelocity: 0,
    ticks: ticks,
    origin: {
      x: Math.random(),
      // since particles fall down, skew start toward the top
      y: (Math.random() * skew) - 0.2
    },
    colors: ['#ffffff', '#88C0D0', '#81A1C1', '#5E81AC', '#B48EAD'],
    shapes: ['circle', 'star'],
    gravity: randomInRange(0.2, 0.4),
    scalar: randomInRange(0.6, 1.2),
    drift: randomInRange(-0.2, 0.2)
  });

  if (timeLeft > 0) {
    requestAnimationFrame(frame);
  }
}());
}
</script>
