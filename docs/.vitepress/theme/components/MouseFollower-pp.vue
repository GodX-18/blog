<template>
  <canvas ref="canvas" style="position: fixed; left: 0; top: 0; pointer-events: none; z-index: 999999"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const canvas = ref(null);
let ctx = null;
let particles = [];
let mouse = { x: globalThis?.innerWidth / 2, y: globalThis?.innerHeight / 2 };
let targetMouse = { x: globalThis?.innerWidth / 2, y: globalThis?.innerHeight / 2 };
let lastMouse = { x: globalThis?.innerWidth / 2, y: globalThis?.innerHeight / 2 };
let animationFrameId = null;
// 存储页面中的交互元素
let interactiveElements = [];

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    // 随机角度
    this.angle = Math.random() * Math.PI * 2;
    // 更小的随机半径 (15-25)
    this.radius = Math.random() * 40 + 25;
    // 随机旋转速度
    this.speed = (Math.random() * 2 + 2) * 0.01;
    // 更小的粒子大小 (1-2)
    this.size = Math.random() * 3 + 1;
    // 随机颜色
    this.hue = Math.random() * 360;
    // 随机方向
    this.clockwise = Math.random() > 0.5;
    // 更小的随机偏移
    this.offsetX = (Math.random() - 0.5) * 10;
    this.offsetY = (Math.random() - 0.5) * 10;
    // 生命周期
    this.life = Math.random() * 0.5 + 0.5;
    this.maxLife = this.life;
    // 拖尾效果
    this.trail = [];
    this.trailLength = Math.floor(Math.random() * 3) + 2; // 2-4个拖尾点
    // 磁力影响
    this.magneticInfluence = { x: 0, y: 0 };
  }

  update() {
    // 更新角度
    this.angle += this.speed * (this.clockwise ? 1 : -1);

    // 计算目标位置
    const targetX = mouse.x + Math.cos(this.angle) * this.radius + this.offsetX;
    const targetY = mouse.y + Math.sin(this.angle) * this.radius + this.offsetY;

    // 添加当前位置到拖尾数组
    if (!this.x) {
      this.x = targetX;
      this.y = targetY;
    }

    // 计算磁力场影响
    this.calculateMagneticForce();

    // 计算实际移动（添加弹性移动）
    const dx = targetX - this.x + this.magneticInfluence.x;
    const dy = targetY - this.y + this.magneticInfluence.y;
    this.x += dx * 0.15;
    this.y += dy * 0.15;

    // 更新拖尾
    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.trailLength) {
      this.trail.pop();
    }

    // 更新生命周期
    this.life -= 0.002;
    if (this.life <= 0) {
      this.reset();
    }
  }

  // 计算磁力场影响
  calculateMagneticForce() {
    this.magneticInfluence = { x: 0, y: 0 };

    for (const element of interactiveElements) {
      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      // 计算粒子与元素中心的距离
      const dx = this.x - elementCenterX;
      const dy = this.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 定义磁力场影响范围
      const influenceRange = 150;

      if (distance < influenceRange) {
        // 计算影响强度（距离越近影响越大）
        const force = 1 - distance / influenceRange;
        const attractionFactor = element.dataset.attract === "true" ? -1 : 1;
        const strength = force * force * 5 * attractionFactor; // 调整磁力大小

        // 计算方向向量并应用力
        const directionX = dx / distance;
        const directionY = dy / distance;

        this.magneticInfluence.x += directionX * strength;
        this.magneticInfluence.y += directionY * strength;

        // 粒子靠近元素时改变颜色
        if (distance < influenceRange * 0.5) {
          // 混合粒子原始颜色和元素影响的颜色
          const elementHue = parseInt(element.dataset.hue || 200); // 默认蓝色
          const blendFactor = force * 2;
          this.hue = this.hue * (1 - blendFactor) + elementHue * blendFactor;
        }
      }
    }
  }

  draw() {
    if (!ctx) return;
    const alpha = this.life / this.maxLife;

    // 绘制拖尾
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);

      for (let i = 1; i < this.trail.length; i++) {
        const point = this.trail[i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${alpha * 0.5})`;
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // 绘制主粒子
    ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 收集页面中的交互式元素
function collectInteractiveElements() {
  // 清空现有元素
  interactiveElements = [];

  // 收集所有按钮
  const buttons = document.querySelectorAll("button, .VPButton");
  buttons.forEach((button) => {
    button.dataset.attract = "true"; // 按钮会吸引粒子
    button.dataset.hue = "220"; // 蓝色调
    interactiveElements.push(button);
  });

  // 收集所有链接
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (link.classList.contains("active")) {
      link.dataset.attract = "true"; // 活跃链接吸引粒子
      link.dataset.hue = "120"; // 绿色调
    } else {
      link.dataset.attract = "false"; // 普通链接排斥粒子
      link.dataset.hue = "0"; // 红色调
    }
    interactiveElements.push(link);
  });

  // 收集其他可交互元素（如表单元素）
  const formElements = document.querySelectorAll("input, select, textarea");
  formElements.forEach((element) => {
    element.dataset.attract = "true"; // 表单元素吸引粒子
    element.dataset.hue = "280"; // 紫色调
    interactiveElements.push(element);
  });
}

// 平滑跟随鼠标
function updateMousePosition() {
  const dx = targetMouse.x - mouse.x;
  const dy = targetMouse.y - mouse.y;

  // 计算鼠标移动速度
  const mouseSpeed = Math.sqrt(Math.pow(targetMouse.x - lastMouse.x, 2) + Math.pow(targetMouse.y - lastMouse.y, 2));

  // 根据鼠标速度调整跟随速度
  const followSpeed = Math.min(0.15, 0.15 / (1 + mouseSpeed * 0.005));

  mouse.x += dx * followSpeed;
  mouse.y += dy * followSpeed;

  lastMouse.x = mouse.x;
  lastMouse.y = mouse.y;
}

function handleMouseMove(e) {
  const rect = canvas.value.getBoundingClientRect();
  targetMouse.x = e.clientX - rect.left;
  targetMouse.y = e.clientY - rect.top;
}

function animate() {
  if (!ctx || !canvas.value) return;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  updateMousePosition();

  // 随机添加新粒子
  if (particles.length < 25 && Math.random() < 0.1) {
    particles.push(new Particle());
  }

  // 更新和绘制所有粒子
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  animationFrameId = requestAnimationFrame(animate);
}

function handleResize() {
  if (!canvas.value) return;
  canvas.value.width = globalThis.innerWidth;
  canvas.value.height = globalThis.innerHeight;
}

function initParticles() {
  particles = [];
  // 初始创建12-15个粒子
  const initialCount = Math.floor(Math.random() * 4) + 12;
  for (let i = 0; i < initialCount; i++) {
    particles.push(new Particle());
  }
}

// 定期更新交互元素列表
function startElementCollection() {
  collectInteractiveElements();
  // 每2秒更新一次元素列表，因为页面内容可能会变化
  setInterval(collectInteractiveElements, 2000);
}

onMounted(() => {
  if (typeof globalThis !== "undefined") {
    ctx = canvas.value.getContext("2d");
    handleResize();
    initParticles();
    startElementCollection();

    globalThis.addEventListener("resize", handleResize);
    globalThis.addEventListener("mousemove", handleMouseMove);

    animate();
  }
});

onUnmounted(() => {
  if (typeof globalThis !== "undefined") {
    globalThis.removeEventListener("resize", handleResize);
    globalThis.removeEventListener("mousemove", handleMouseMove);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
});
</script>

<style scoped>
canvas {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999999;
}
</style>
