<script setup>
import { ref, computed, onMounted } from 'vue'

// 这里使用静态数据，实际应用中可能需要动态生成
const tags = ref([
  { name: 'Vue', count: 12, link: '/tags/vue' },
  { name: 'JavaScript', count: 18, link: '/tags/javascript' },
  { name: 'TypeScript', count: 8, link: '/tags/typescript' },
  { name: 'React', count: 6, link: '/tags/react' },
  { name: 'CSS', count: 10, link: '/tags/css' },
  { name: '设计模式', count: 5, link: '/tags/design-patterns' },
  { name: '敏捷开发', count: 7, link: '/tags/agile' },
  { name: '前端性能', count: 9, link: '/tags/frontend-performance' },
  { name: '微服务', count: 4, link: '/tags/microservices' },
  { name: '架构', count: 6, link: '/tags/architecture' },
  { name: '开源', count: 3, link: '/tags/open-source' },
  { name: '读书笔记', count: 11, link: '/tags/book-notes' },
  { name: '职业成长', count: 8, link: '/tags/career-growth' },
  { name: '技术管理', count: 5, link: '/tags/tech-management' },
  { name: 'Docker', count: 6, link: '/tags/docker' }
])

// 根据文章数量对标签排序
const sortedTags = computed(() => {
  return [...tags.value].sort((a, b) => b.count - a.count)
})

// 颜色和大小计算
const getTagProps = (count) => {
  const maxCount = Math.max(...tags.value.map(tag => tag.count))
  const minCount = Math.min(...tags.value.map(tag => tag.count))
  const range = maxCount - minCount
  const ratio = range > 0 ? (count - minCount) / range : 0.5
  
  // 大小计算
  const minSize = 0.85
  const maxSize = 1.5
  const fontSize = minSize + (maxSize - minSize) * ratio
  
  // 渐变颜色计算 - 蓝色到紫色
  const hueStart = 210 // 蓝色
  const hueEnd = 270   // 紫色
  const hue = Math.floor(hueStart + (hueEnd - hueStart) * ratio)
  const saturation = 80
  const lightness = 50 + (1 - ratio) * 20
  
  return {
    fontSize: `${fontSize}rem`,
    backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`,
    borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`,
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }
}

// 随机位置动画
const getAnimationProps = (index) => {
  const delay = (index % 5) * 0.1
  return {
    animationDelay: `${delay}s`,
    animationDuration: `${3 + Math.random() * 2}s`
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const tagsWrapper = document.querySelector('.tags-container')
    if (tagsWrapper) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          tagsWrapper.classList.add('tags-visible')
          observer.disconnect()
        }
      }, { threshold: 0.1 })
      
      observer.observe(tagsWrapper)
    }
  }
})
</script>

<template>
  <div class="tag-cloud-wrapper">
    <div class="tag-cloud-background">
      <div class="tag-cloud-glow"></div>
    </div>
    
    <div class="tag-cloud">
      <div class="tag-cloud-header">
        <span class="tag-cloud-title">热门标签</span>
        <div class="title-underline"></div>
      </div>
      
      <div class="tags-container">
        <a 
          v-for="(tag, index) in sortedTags" 
          :key="tag.name"
          :href="tag.link"
          class="tag-item"
          :style="{
            ...getTagProps(tag.count),
            ...getAnimationProps(index)
          }"
        >
          {{ tag.name }} 
          <span class="tag-count">{{ tag.count }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud-wrapper {
  position: relative;
  margin: 4rem auto;
  padding: 2rem 1rem;
  overflow: hidden;
  border-radius: 1rem;
}

.tag-cloud-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.02);
  z-index: -2;
  overflow: hidden;
}

.dark .tag-cloud-background {
  background: rgba(255, 255, 255, 0.02);
}

.tag-cloud-glow {
  position: absolute;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15), transparent 70%);
  filter: blur(30px);
  top: 0;
  right: 0;
  z-index: -1;
  animation: glow-movement 15s ease-in-out infinite alternate;
}

@keyframes glow-movement {
  0% {
    transform: translate(0, 0);
    opacity: 0.5;
  }
  50% {
    transform: translate(-30%, 30%);
    opacity: 0.7;
  }
  100% {
    transform: translate(-20%, -20%);
    opacity: 0.5;
  }
}

.tag-cloud {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tag-cloud-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.tag-cloud-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.025em;
  position: relative;
  z-index: 2;
}

.title-underline {
  width: 4rem;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  margin: 10px auto;
  border-radius: 2px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.tags-visible {
  opacity: 1;
  transform: translateY(0);
}

.tag-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  border: 1px solid;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  animation: float-in 0.6s ease-out backwards;
}

@keyframes float-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.tag-item:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  filter: brightness(1.1);
}

.dark .tag-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.5rem;
  font-size: 0.7em;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0 0.4rem;
  font-weight: 600;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tag-cloud-title {
    font-size: 2rem;
  }
  
  .tags-container {
    gap: 0.75rem;
    padding: 0.5rem;
  }
  
  .tag-item {
    padding: 0.4rem 0.8rem;
  }
  
  .tag-cloud-wrapper {
    margin: 2rem auto;
    padding: 1rem 0.5rem;
  }
}

@media (max-width: 640px) {
  .tag-cloud-title {
    font-size: 1.75rem;
  }
  
  .tag-cloud-header {
    margin-bottom: 2rem;
  }
  
  .tag-count {
    min-width: 1.25rem;
    height: 1.25rem;
    margin-left: 0.3rem;
  }
}
</style> 