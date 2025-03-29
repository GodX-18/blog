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
    this.radius = Math.random() * 15 + 5; // 缩小初始半径
    // 最大半径（扩散用）
    this.maxRadius = Math.random() * 60 + 30; // 调整最大半径
    // 扩散速率 - 不同粒子有不同扩散速度
    this.expandSpeed = Math.random() * 0.3 + 0.1;
    // 旋转速度 - 增加旋转以模拟湍流
    this.rotateSpeed = (Math.random() * 2 - 1) * 0.02;
    // 粒子大小
    this.size = Math.random() * 15 + 3;
    // 彩虹颜色 - 调整色相范围使其更像烟雾
    this.hue = Math.random() * 60 + 200; // 更多的蓝紫色调
    this.hueSpeed = Math.random() * 0.5 + 0.1;
    // 随机偏移 - 增加随机性
    this.offsetX = (Math.random() - 0.5) * 40;
    this.offsetY = (Math.random() - 0.5) * 40;
    // 上升速度 - 烟雾应该有不同的上升速度
    this.riseSpeed = Math.random() * 1.2 + 0.3;
    // 生命周期
    this.life = Math.random() * 0.7 + 0.3;
    this.maxLife = this.life;
    // 初始位置（靠近鼠标）
    this.x = mouse.x + (Math.random() - 0.5) * 20;
    this.y = mouse.y + (Math.random() - 0.5) * 20;
    // 透明度 - 降低以符合烟雾特性
    this.alpha = Math.random() * 0.5 + 0.1;
    // 轨迹记录
    this.trail = [];
    this.trailLength = Math.floor(Math.random() * 3) + 2; // 减少轨迹长度
    // 脉动效果 - 减弱以减少气球感
    this.pulse = Math.random() * 0.05 + 0.02;
    this.pulseAngle = 0;
    
    // 添加不规则变形效果
    this.deformFactor = Math.random() * 0.3 + 0.1;
    this.deformAngle = Math.random() * Math.PI * 2;
    this.deformSpeed = (Math.random() * 2 - 1) * 0.02;
    
    // 新增：粒子的目标点
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDistance = Math.random() * 100 + 50;
    this.targetX = this.x + Math.cos(randomAngle) * randomDistance;
    this.targetY = this.y + Math.sin(randomAngle) * randomDistance - 50; // 向上偏移，模拟上升
    
    // 新增：粒子移动速度
    this.speed = Math.random() * 0.8 + 0.3; // 降低速度使运动更像烟雾
    
    // 新增：接近鼠标时的淡出距离
    this.fadeDistance = Math.random() * 40 + 60;
    
    // 添加湍流效果
    this.turbulenceAmplitude = Math.random() * 0.8 + 0.2;
    this.turbulenceFrequency = Math.random() * 0.1 + 0.05;
    this.turbulencePhase = Math.random() * Math.PI * 2;
  }

  update() {
    // 扩散效果 - 使扩散速度随时间变化
    this.radius = Math.min(this.radius + this.expandSpeed * (0.8 + 0.4 * (1 - this.life/this.maxLife)), this.maxRadius);
    
    // 添加脉动效果 - 减弱
    this.pulseAngle += 0.1;
    const pulseEffect = Math.sin(this.pulseAngle) * this.pulse;
    
    // 添加变形和湍流
    this.deformAngle += this.deformSpeed;
    const deformEffect = Math.sin(this.deformAngle) * this.deformFactor;
    
    // 湍流效果计算
    this.turbulencePhase += this.turbulenceFrequency;
    const turbulenceX = Math.sin(this.turbulencePhase) * this.turbulenceAmplitude;
    const turbulenceY = Math.cos(this.turbulencePhase * 1.3) * this.turbulenceAmplitude;
    
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
      this.fadeDistance = Math.max(this.fadeDistance, 150);
      
      // 如果距离鼠标太近，重新设置目标点
      if (distanceToMouse < 100 && Math.random() < 0.1) {
        const escapeAngle = Math.atan2(dy, dx);
        const escapeDistance = 200 + Math.random() * 150;
        this.targetX = mouse.x + Math.cos(escapeAngle) * escapeDistance;
        this.targetY = mouse.y + Math.sin(escapeAngle) * escapeDistance - 50; // 向上偏移
      }
    }
    
    // 只有当距离不太小时才移动粒子
    if (targetDistance > 1) {
      // 移动向目标点，但加入湍流效果
      this.x += (targetDx / targetDistance) * this.speed + turbulenceX;
      this.y += (targetDy / targetDistance) * this.speed + turbulenceY;
    }
    
    // 上升和飘动效果 - 增强上升感
    this.y -= this.riseSpeed * (1.2 - this.life/this.maxLife); // 随生命周期加速上升
    this.x += Math.sin(this.angle) * 0.5 + deformEffect * 0.3;
    this.angle += this.rotateSpeed;
    
    // 基于与鼠标的距离计算透明度
    let fadeAlpha = this.alpha;
    if (distanceToMouse < this.fadeDistance) {
      // 越接近鼠标越透明，使用二次方公式增强淡出效果
      const fadeRatio = distanceToMouse / this.fadeDistance;
      fadeAlpha = this.alpha * fadeRatio * fadeRatio;
    }
    
    // 根据生命周期调整透明度 - 烟雾应该逐渐消散
    fadeAlpha *= Math.pow(this.life / this.maxLife, 1.5);
    
    // 记录轨迹 - 使轨迹更自然
    this.trail.unshift({ 
      x: this.x, 
      y: this.y, 
      radius: this.radius * (1 + deformEffect), // 添加变形因子
      hue: this.hue,
      alpha: fadeAlpha,
      deform: deformEffect // 保存变形值用于绘制
    });
    
    if (this.trail.length > this.trailLength) {
      this.trail.pop();
    }
    
    // 颜色变化 - 减缓变化速度
    this.hue += this.hueSpeed * 0.7;
    if (this.hue > 360) this.hue -= 360;
    
    // 生命周期 - 调整衰减速度
    const lifeDelta = 0.008 + (1 - (this.life / this.maxLife)) * 0.012;
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
      // 越接近鼠标越透明
      const fadeRatio = distanceToMouse / this.fadeDistance;
      alpha = alpha * fadeRatio * fadeRatio;
    }
    
    // 如果效果不可见且透明度太低，则不绘制
    if (!isEffectVisible && alpha < 0.05) {
      return;
    }
    
    // 绘制轨迹 - 使轨迹更加模糊和不规则
    for (let i = 1; i < this.trail.length; i++) {
      const point = this.trail[i];
      // 降低轨迹的透明度
      const prevAlpha = isEffectVisible ? 
                        point.alpha * (1 - i / this.trail.length) * 0.8 : 
                        point.alpha * (1 - i / this.trail.length) * 0.5;
      
      // 如果透明度太低，跳过绘制
      if (prevAlpha < 0.02) continue;
      
      // 使用椭圆而不是圆形 - 增加不规则感
      const radiusX = point.radius * (1 + point.deform * 0.5);
      const radiusY = point.radius * (1 - point.deform * 0.3);
      
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, Math.max(radiusX, radiusY)
      );
      
      // 更柔和的颜色渐变 - 更像烟雾
      gradient.addColorStop(0, `hsla(${point.hue}, 70%, 80%, ${prevAlpha * 0.5})`);
      gradient.addColorStop(0.4, `hsla(${(point.hue + 15) % 360}, 60%, 70%, ${prevAlpha * 0.3})`);
      gradient.addColorStop(0.7, `hsla(${(point.hue + 30) % 360}, 50%, 60%, ${prevAlpha * 0.1})`);
      gradient.addColorStop(1, `hsla(${(point.hue + 45) % 360}, 40%, 50%, 0)`);
      
      ctx.fillStyle = gradient;
      
      // 使用不规则形状
      ctx.beginPath();
      ctx.ellipse(
        point.x, point.y, 
        radiusX * 0.9, radiusY * 0.9, 
        this.angle + point.deform, 0, Math.PI * 2
      );
      ctx.fill();
    }
    
    // 创建径向渐变 - 更柔和的烟雾效果
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    
    // 更像烟雾的颜色渐变
    gradient.addColorStop(0, `hsla(${this.hue}, 70%, 85%, ${alpha * 0.8})`);
    gradient.addColorStop(0.3, `hsla(${(this.hue + 15) % 360}, 60%, 75%, ${alpha * 0.5})`);
    gradient.addColorStop(0.6, `hsla(${(this.hue + 30) % 360}, 50%, 65%, ${alpha * 0.3})`);
    gradient.addColorStop(0.8, `hsla(${(this.hue + 45) % 360}, 40%, 55%, ${alpha * 0.1})`);
    gradient.addColorStop(1, `hsla(${(this.hue + 60) % 360}, 30%, 45%, 0)`);
    
    // 绘制烟雾粒子 - 使用椭圆而不是圆形
    ctx.fillStyle = gradient;
    
    // 计算变形效果
    const deformEffect = Math.sin(this.deformAngle) * this.deformFactor;
    const radiusX = this.radius * (1 + deformEffect * 0.5);
    const radiusY = this.radius * (1 - deformEffect * 0.3);
    
    ctx.beginPath();
    ctx.ellipse(
      this.x, this.y, 
      radiusX, radiusY, 
      this.angle + deformEffect, 0, Math.PI * 2
    );
    ctx.fill();
    
    // 添加更柔和的内部高光
    const innerGlow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 0.2
    );
    innerGlow.addColorStop(0, `hsla(${this.hue - 20}, 60%, 95%, ${alpha * 0.6})`);
    innerGlow.addColorStop(1, `hsla(${this.hue}, 50%, 85%, 0)`);
    
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.ellipse(
      this.x, this.y, 
      radiusX * 0.25, radiusY * 0.25, 
      this.angle, 0, Math.PI * 2
    );
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
    
    // 根据鼠标移动速度调整粒子生成概率，但增加基础生成率
    const spawnRate = Math.min(0.6, 0.3 + distance * 0.015);
    
    if (Math.random() < spawnRate) {
      // 在鼠标位置生成粒子，并随机添加偏移
      particles.push(new Particle());
    }
  }
  
  // 当效果不可见时，逐渐减少粒子数量
  if (!isEffectVisible && particles.length > 0) {
    // 加快粒子消失的速度
    if (Math.random() < 0.15) {
      particles.shift();
    }
  }
  
  // 增加最大粒子数量，但不要太多以避免性能问题
  const maxParticles = 60;
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
