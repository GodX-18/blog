<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📄'
  },
  link: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <a :href="link" class="blog-card-link">
    <div class="blog-card">
      <div class="blog-card-border"></div>
      <div class="blog-card-content">
        <div class="blog-card-icon-wrapper">
          <span class="blog-card-icon">{{ icon }}</span>
        </div>
        <h3 class="blog-card-title">{{ title }}</h3>
        <p class="blog-card-description">{{ description }}</p>
        <div class="blog-card-footer">
          <span class="blog-card-count">{{ count }}篇文章</span>
          <div class="blog-card-arrow-wrapper">
            <span class="blog-card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
.blog-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  perspective: 1000px;
}

.blog-card {
  position: relative;
  height: 100%;
  min-height: 220px;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dark .blog-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.blog-card:hover {
  transform: translateY(-10px) rotateX(5deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dark .blog-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.blog-card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

.blog-card:hover .blog-card-border {
  transform: scaleX(1);
}

.blog-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
}

.blog-card-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background-color: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.dark .blog-card-icon-wrapper {
  background-color: rgba(59, 130, 246, 0.2);
}

.blog-card:hover .blog-card-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.blog-card-icon {
  font-size: 1.5rem;
}

.blog-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  transition: background 0.3s ease;
}

.blog-card:hover .blog-card-title {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
}

.blog-card-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(107, 114, 128, 1);
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.dark .blog-card-description {
  color: rgba(156, 163, 175, 1);
}

.blog-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(107, 114, 128, 1);
}

.dark .blog-card-footer {
  color: rgba(156, 163, 175, 1);
}

.blog-card-count {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.blog-card-count::before {
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #3b82f6;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.blog-card-arrow-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.dark .blog-card-arrow-wrapper {
  background-color: rgba(59, 130, 246, 0.2);
}

.blog-card:hover .blog-card-arrow-wrapper {
  background-color: #3b82f6;
  transform: translateX(5px);
}

.blog-card-arrow {
  display: flex;
  color: #3b82f6;
  transition: color 0.3s ease;
}

.blog-card:hover .blog-card-arrow {
  color: white;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .blog-card {
    min-height: 180px;
  }
  
  .blog-card-content {
    padding: 1rem;
  }
  
  .blog-card-icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0.75rem;
  }
  
  .blog-card-title {
    font-size: 1.1rem;
  }
  
  .blog-card-description {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
}
</style> 