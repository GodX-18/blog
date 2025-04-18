<template>
  <canvas
    ref="canvas"
    style="position: fixed; left: 0; top: 0; pointer-events: none; z-index: 999999"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const canvas = ref(null);
let ctx = null;
let particles = [];
let mouse = { x: globalThis ?.innerWidth / 2, y: globalThis ?.innerHeight / 2 };
let targetMouse = { x: globalThis ?.innerWidth / 2, y: globalThis ?.innerHeight / 2 };
let lastMouse = { x: globalThis ?.innerWidth / 2, y: globalThis ?.innerHeight / 2 };
let animationFrameId = null;
let isMouseInPage = false;
let lastMoveTime = 0;
let inactivityTimer = null;
let isEffectVisible = false;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    // 随机角度
    this.angle = Math.random() * Math.PI * 2;
    // 较小的初始半径
    this.radius = Math.random() * 15 + 5;
    // 最大半径（扩散用）
    this.maxRadius = Math.random() * 80 + 30;
    // 扩散速率
    this.expandSpeed = Math.random() * 0.4 + 0.2;
    // 旋转速度
    this.rotateSpeed = (Math.random() * 2 - 1) * 0.015;
    // 粒子大小
    this.size = Math.random() * 18 + 3;
    // 彩虹颜色
    this.hue = Math.random() * 360;
    this.hueSpeed = Math.random() * 1 + 0.2;
    // 随机偏移
    this.offsetX = (Math.random() - 0.5) * 30;
    this.offsetY = (Math.random() - 0.5) * 30;
    // 上升速度
    this.riseSpeed = Math.random() * 0.8 + 0.1;
    // 生命周期
    this.life = Math.random() * 0.8 + 0.3;
    this.maxLife = this.life;
    // 初始位置（靠近鼠标）
    this.x = mouse.x + (Math.random() - 0.5) * 15;
    this.y = mouse.y + (Math.random() - 0.5) * 15;
    // 透明度
    this.alpha = Math.random() * 0.7 + 0.2;
    // 轨迹记录
    this.trail = [];
    this.trailLength = Math.floor(Math.random() * 4) + 3;
    // 添加脉动效果
    this.pulse = Math.random() * 0.1 + 0.05;
    this.pulseAngle = 0;
    
    // 新增：粒子的目标点，与鼠标位置有一定距离
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * 100 + 50; // 50-150像素的随机距离
    this.targetX = this.x + Math.cos(randomAngle) * randomDistance;
    this.targetY = this.y + Math.sin(randomAngle) * randomDistance;
    
    // 新增：粒子移动速度
    this.speed = Math.random() * 1 + 0.5;
    
    // 新增：接近鼠标时的淡出距离
    this.fadeDistance = Math.random() * 40 + 60; // 60-100像素开始淡出
  }

  update() {
    // 扩散效果
    this.radius = Math.min(this.radius + this.expandSpeed, this.maxRadius);
    
    // 添加脉动效果
    this.pulseAngle += 0.1;
    const pulseEffect = Math.sin(this.pulseAngle) * this.pulse;
    const currentRadius = this.radius * (1 + pulseEffect);
    
    // 计算到鼠标的距离
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    
    // 计算到目标点的方向
    const targetDx = this.targetX - this.x;
    const targetDy = this.targetY - this.y;
    const targetDistance = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
    
    // 根据效果可见性状态调整行为
    if (!isEffectVisible) {
      // 如果效果不可见（鼠标停止移动），增加淡出距离和速度
      this.fadeDistance = Math.max(this.fadeDistance, 150); // 增大淡出距离
      this.speed = Math.max(this.speed, 1.5); // 确保有足够的速度离开
      
      // 如果距离鼠标太近，重新设置目标点
      if (distanceToMouse < 100 && Math.random() < 0.1) {
        const escapeAngle = Math.atan2(dy, dx);
        const escapeDistance = 200 + Math.random() * 150;
        this.targetX = mouse.x + Math.cos(escapeAngle) * escapeDistance;
        this.targetY = mouse.y + Math.sin(escapeAngle) * escapeDistance;
      }
    }
    
    // 只有当距离不太小时才移动粒子（避免抖动）
    if (targetDistance > 1) {
      // 移动向目标点
      this.x += (targetDx / targetDistance) * this.speed;
      this.y += (targetDy / targetDistance) * this.speed;
    }
    
    // 额外的飘动效果
    this.y -= this.riseSpeed * (1 + pulseEffect * 0.5);
    this.x += Math.sin(this.angle) * 0.5;
    this.angle += this.rotateSpeed;
    
    // 基于与鼠标的距离计算透明度
    let fadeAlpha = this.alpha;
    if (distanceToMouse < this.fadeDistance) {
      // 越接近鼠标越透明，使用二次方公式增强淡出效果
      const fadeRatio = distanceToMouse / this.fadeDistance;
      fadeAlpha = this.alpha * fadeRatio * fadeRatio;
    }
    
    // 记录轨迹
    this.trail.unshift({ 
      x: this.x, 
      y: this.y, 
      radius: currentRadius, 
      hue: this.hue,
      alpha: fadeAlpha * (this.life / this.maxLife)
    });
    
    if (this.trail.length > this.trailLength) {
      this.trail.pop();
    }
    
    // 颜色变化
    this.hue += this.hueSpeed;
    if (this.hue > 360) this.hue -= 360;
    
    // 生命周期 - 增加鼠标停止时的衰减速度
    const lifeDelta = 0.008 + (1 - (this.life / this.maxLife)) * 0.01;
    this.life -= isEffectVisible ? lifeDelta : lifeDelta * 1.5;
    
    if (this.life <= 0) {
      this.reset();
    }
  }

  draw() {
    if (!ctx) return;
    // 基于与鼠标距离的透明度计算
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    
    let alpha = (this.life / this.maxLife) * this.alpha;
    if (distanceToMouse < this.fadeDistance) {
      // 越接近鼠标越透明，使用二次方公式增强淡出效果
      const fadeRatio = distanceToMouse / this.fadeDistance;
      alpha = alpha * fadeRatio * fadeRatio;
    }
    
    // 如果效果不可见且透明度太低，则不绘制
    if (!isEffectVisible && alpha < 0.05) {
      return;
    }
    
    // 绘制轨迹 - 增强效果
    for (let i = 1; i < this.trail.length; i++) {
      const point = this.trail[i];
      // 进一步降低轨迹的透明度
      const prevAlpha = isEffectVisible ? 
                        point.alpha * (1 - i / this.trail.length) : 
                        point.alpha * (1 - i / this.trail.length) * 0.7;
      
      // 如果透明度太低，跳过绘制
      if (prevAlpha < 0.02) continue;
      
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, point.radius
      );
      
      // 更丰富的颜色渐变
      gradient.addColorStop(0, `hsla(${point.hue}, 100%, 75%, ${prevAlpha * 0.6})`);
      gradient.addColorStop(0.5, `hsla(${(point.hue + 30) % 360}, 100%, 65%, ${prevAlpha * 0.3})`);
      gradient.addColorStop(1, `hsla(${(point.hue + 60) % 360}, 100%, 50%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius * 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 创建径向渐变（烟雾效果增强）
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    
    // 更丰富的颜色渐变
    gradient.addColorStop(0, `hsla(${this.hue}, 100%, 75%, ${alpha * 1.2})`);
    gradient.addColorStop(0.4, `hsla(${(this.hue + 20) % 360}, 100%, 65%, ${alpha * 0.6})`);
    gradient.addColorStop(0.7, `hsla(${(this.hue + 40) % 360}, 100%, 55%, ${alpha * 0.3})`);
    gradient.addColorStop(1, `hsla(${(this.hue + 60) % 360}, 100%, 50%, 0)`);
    
    // 绘制烟雾粒子
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加内部高光点
    const innerGlow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 0.3
    );
    innerGlow.addColorStop(0, `hsla(${this.hue - 40}, 100%, 90%, ${alpha * 0.8})`);
    innerGlow.addColorStop(1, `hsla(${this.hue}, 100%, 80%, 0)`);
    
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 平滑跟随鼠标
function updateMousePosition() {
  const dx = targetMouse.x - mouse.x;
  const dy = targetMouse.y - mouse.y;

  // 计算鼠标移动速度
  const mouseSpeed = Math.sqrt(
    Math.pow(targetMouse.x - lastMouse.x, 2) + Math.pow(targetMouse.y - lastMouse.y, 2)
  );

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
  
  // 更新最后移动时间
  lastMoveTime = Date.now();
  
  // 如果效果不可见，重新显示
  if (!isEffectVisible) {
    isEffectVisible = true;
    // 重新初始化粒子
    if (particles.length === 0) {
      initParticles();
    }
  }
  
  // 重置不活动计时器
  resetInactivityTimer();
}

function handleMouseEnter() {
  isMouseInPage = true;
  isEffectVisible = true;
  
  // 重新初始化粒子
  if (particles.length === 0) {
    initParticles();
  }
  
  // 重置不活动计时器
  resetInactivityTimer();
}

function handleMouseLeave() {
  isMouseInPage = false;
  fadeOutEffect();
}

function resetInactivityTimer() {
  // 清除现有计时器
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  
  // 设置新计时器 - 1000毫秒（1秒）后检查鼠标是否静止
  inactivityTimer = setTimeout(checkMouseActivity, 1000);
}

function checkMouseActivity() {
  // 如果鼠标超过1秒没有移动，淡出效果
  if (Date.now() - lastMoveTime > 1000) {
    fadeOutEffect();
  } else {
    // 否则继续检查
    resetInactivityTimer();
  }
}

function fadeOutEffect() {
  // 标记效果为不可见
  isEffectVisible = false;
  
  // 为所有现有粒子设置新的目标点，远离鼠标
  particles.forEach(particle => {
    // 计算远离鼠标的方向
    const dx = particle.x - mouse.x;
    const dy = particle.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 200) {
      // 如果粒子距离鼠标较近，设置新的目标点，使其远离鼠标
      const angle = Math.atan2(dy, dx);
      const newDistance = 200 + Math.random() * 100; // 设置一个较远的距离
      
      particle.targetX = mouse.x + Math.cos(angle) * newDistance;
      particle.targetY = mouse.y + Math.sin(angle) * newDistance;
      particle.speed *= 1.5; // 加快离开的速度
    }
  });
}

function animate() {
  if (!ctx || !canvas.value) return;
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // 如果鼠标不在页面上或者长时间未移动，则不绘制新粒子
  if (isEffectVisible && isMouseInPage) {
    updateMousePosition();

    // 根据鼠标移动添加新粒子 - 增加粒子生成概率
    const distance = Math.sqrt(
      Math.pow(targetMouse.x - lastMouse.x, 2) + 
      Math.pow(targetMouse.y - lastMouse.y, 2)
    );
    
    // 根据鼠标移动速度调整粒子生成概率
    const spawnRate = Math.min(0.5, 0.2 + distance * 0.01);
    
    if (Math.random() < spawnRate) {
      // 在鼠标位置生成粒子
      particles.push(new Particle());
    }
  }
  
  // 当效果不可见时，逐渐减少粒子数量
  if (!isEffectVisible && particles.length > 0) {
    // 每帧移除一部分粒子，使效果逐渐消失
    if (Math.random() < 0.1) {
      particles.shift();
    }
  }
  
  // 增加最大粒子数量
  const maxParticles = 65; // 增加粒子数上限
  while (particles.length > maxParticles) {
    particles.shift();
  }

  // 更新和绘制所有粒子
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    
    // 移除寿命结束的粒子
    if (particle.life <= 0) {
      particles.splice(index, 1);
    }
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
  // 初始创建更多粒子
  const initialCount = Math.floor(Math.random() * 10) + 20;
  for (let i = 0; i < initialCount; i++) {
    particles.push(new Particle());
  }
}

onMounted(() => {
  if (typeof globalThis !== "undefined") {
    ctx = canvas.value.getContext("2d");
    handleResize();
    
    // 不立即初始化粒子，等待鼠标进入页面
    
    globalThis.addEventListener("resize", handleResize);
    globalThis.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    // 设置最后移动时间
    lastMoveTime = Date.now();
    
    animate();
  }
});

onUnmounted(() => {
  if (typeof globalThis !== "undefined") {
    globalThis.removeEventListener("resize", handleResize);
    globalThis.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseenter", handleMouseEnter);
    document.removeEventListener("mouseleave", handleMouseLeave);
    
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
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
