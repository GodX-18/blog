---
layout: page
---

<script setup>
import BlogCategories from '../.vitepress/theme/components/BlogCategories.vue'
import RecentPosts from '../.vitepress/theme/components/RecentPosts.vue'
import TagCloud from '../.vitepress/theme/components/TagCloud.vue'
</script>

<div class="blog-hero">
  <div class="blog-hero-bg">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <div class="grid-lines">
      <div class="grid-line"></div>
      <div class="grid-line"></div>
      <div class="grid-line"></div>
      <div class="grid-line"></div>
      <div class="grid-line"></div>
    </div>
  </div>
  <div class="blog-hero-content">
    <h1 class="blog-hero-title">博客中心</h1>
    <p class="blog-hero-subtitle">在这里，我分享编程技术、管理经验、读书感悟和个人思考</p>
  </div>
</div>

<BlogCategories />

<div class="divider my-12 h-px bg-gray-200 dark:bg-gray-700 max-w-5xl mx-auto"></div>

<RecentPosts />

<div class="divider my-12 h-px bg-gray-200 dark:bg-gray-700 max-w-5xl mx-auto"></div>

<TagCloud />

<style>
.blog-hero {
  position: relative;
  padding: 5rem 1rem;
  overflow: hidden;
  background-color: rgba(248, 250, 252, 0.8);
  border-radius: 1rem;
  margin: 2rem auto 4rem;
  max-width: 1200px;
}

.dark .blog-hero {
  background-color: rgba(15, 23, 42, 0.8);
}

.blog-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  mix-blend-mode: screen;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: rgba(59, 130, 246, 0.5);
  top: -100px;
  right: -100px;
  animation: blob-float 20s ease-in-out infinite alternate;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: rgba(139, 92, 246, 0.5);
  bottom: -50px;
  left: -50px;
  animation: blob-float 15s ease-in-out 1s infinite alternate-reverse;
}

.blob-3 {
  width: 200px;
  height: 200px;
  background: rgba(236, 72, 153, 0.5);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: blob-pulse 10s ease-in-out infinite;
}

@keyframes blob-float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(50px, -30px) scale(1.1);
  }
  100% {
    transform: translate(-30px, 50px) scale(0.9);
  }
}

@keyframes blob-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.3;
  }
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
  justify-content: space-between;
  opacity: 0.05;
}

.dark .grid-lines {
  opacity: 0.1;
}

.grid-line {
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #3b82f6, transparent);
}

.blog-hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.blog-hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.025em;
  line-height: 1.1;
  animation: title-reveal 1.2s ease-out forwards;
}

@keyframes title-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.blog-hero-subtitle {
  font-size: 1.25rem;
  color: rgba(107, 114, 128, 1);
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  animation: subtitle-reveal 1.2s ease-out 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.dark .blog-hero-subtitle {
  color: rgba(156, 163, 175, 1);
}

@keyframes subtitle-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.blog-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  position: relative;
  width: 130px;
  height: 130px;
  perspective: 1000px;
  animation: card-fade-in 1.2s ease-out forwards;
  opacity: 0;
}

.stat-card:nth-child(1) {
  animation-delay: 0.3s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.5s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.7s;
}

@keyframes card-fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
}

.dark .stat-card-inner {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.stat-card:hover .stat-card-inner {
  transform: translateY(-10px) rotateX(5deg);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(107, 114, 128, 1);
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.dark .stat-label {
  color: rgba(156, 163, 175, 1);
}

.stat-icon {
  position: absolute;
  width: 100px;
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.05;
  z-index: 0;
  bottom: -10px;
  right: -10px;
  transition: all 0.5s ease;
}

.dark .stat-icon {
  opacity: 0.1;
}

.category-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='7' height='7' x='3' y='3' rx='1'/%3E%3Crect width='7' height='7' x='14' y='3' rx='1'/%3E%3Crect width='7' height='7' x='14' y='14' rx='1'/%3E%3Crect width='7' height='7' x='3' y='14' rx='1'/%3E%3C/svg%3E");
}

.article-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2'/%3E%3Cpath d='M18 14h-8'/%3E%3Cpath d='M15 18h-5'/%3E%3Cpath d='M10 6h8v4h-8V6Z'/%3E%3C/svg%3E");
}

.tag-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z'/%3E%3Cpath d='M7 7h.01'/%3E%3C/svg%3E");
}

.stat-card:hover .stat-icon {
  transform: scale(1.2) rotate(10deg);
  opacity: 0.1;
}

.dark .stat-card:hover .stat-icon {
  opacity: 0.15;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-hero {
    padding: 3rem 1rem;
    margin: 1rem auto 3rem;
  }
  
  .blog-hero-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .blog-hero-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .blog-stats {
    gap: 1rem;
  }
  
  .stat-card {
    width: 110px;
    height: 110px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .blob-1 {
    width: 300px;
    height: 300px;
  }
  
  .blob-2 {
    width: 200px;
    height: 200px;
  }
  
  .blob-3 {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 640px) {
  .blog-hero-title {
    font-size: 2rem;
  }
  
  .blog-hero-subtitle {
    font-size: 0.875rem;
  }
  
  .stat-card {
    width: 90px;
    height: 90px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
  
  .stat-icon {
    width: 70px;
    height: 70px;
  }
}
</style>
