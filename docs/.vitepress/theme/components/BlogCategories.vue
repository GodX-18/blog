<script setup>
import { ref, onMounted, computed } from "vue";
import BlogCard from "./BlogCard.vue";

const categories = ref([
  {
    title: "开发技术",
    description: "分享编程技术、框架使用和最佳实践",
    icon: "💻",
    link: "/blog/development/",
    directory: "development"
  },
  {
    title: "管理思考",
    description: "项目管理、团队协作和领导力相关内容",
    icon: "🔍",
    link: "/blog/management/",
    directory: "management"
  },
  {
    title: "读书感悟",
    description: "书籍阅读笔记和个人感悟",
    icon: "📚",
    link: "/blog/readFellings/",
    directory: "readFellings"
  },
  {
    title: "思考随笔",
    description: "个人思考和观点分享",
    icon: "🤔",
    link: "/blog/thinking/",
    directory: "thinking"
  },
  {
    title: "学习笔记",
    description: "技术学习过程中的笔记整理",
    icon: "📝",
    link: "/blog/note/",
    directory: "note"
  }
]);

// 文章计数功能可以在这里实现
// 简单模拟，实际应用中可能需要根据实际文件数量动态生成
const articleCounts = ref({
  development: 8,
  management: 5,
  readFellings: 7,
  thinking: 6,
  note: 10
});

const categoriesWithCount = computed(() => {
  return categories.value.map((category) => ({
    ...category,
    count: articleCounts.value[category.directory] || 0
  }));
});

// 动画效果 - 交错进入
const getAnimationDelay = (index) => {
  return `${index * 0.1}s`;
};
</script>

<template>
  <div class="blog-categories-wrapper">
    <div class="blog-categories-background">
      <div class="grid-line horizontal"></div>
      <div class="grid-line horizontal"></div>
      <div class="grid-line horizontal"></div>
      <div class="grid-line vertical"></div>
      <div class="grid-line vertical"></div>
      <div class="grid-line vertical"></div>
    </div>
    
    <div class="blog-categories">
      <div class="blog-categories-header">
        <span class="blog-categories-title">博客分类</span>
        <div class="title-underline"></div>
      </div>

      <div class="blog-categories-grid">
        <div 
          v-for="(category, index) in categoriesWithCount" 
          :key="category.title"
          class="blog-card-container"
          :style="{ 'animation-delay': getAnimationDelay(index) }"
        >
          <BlogCard
            :title="category.title"
            :description="category.description"
            :icon="category.icon"
            :link="category.link"
            :count="category.count" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-categories-wrapper {
  position: relative;
  margin: 4rem auto;
  padding: 0 1rem;
  overflow: hidden;
}

.blog-categories-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.05;
}

.dark .blog-categories-background {
  opacity: 0.1;
}

.grid-line {
  position: absolute;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.grid-line.horizontal {
  height: 1px;
  left: 0;
  right: 0;
}

.grid-line.horizontal:nth-child(1) {
  top: 20%;
}

.grid-line.horizontal:nth-child(2) {
  top: 50%;
}

.grid-line.horizontal:nth-child(3) {
  top: 80%;
}

.grid-line.vertical {
  width: 1px;
  top: 0;
  bottom: 0;
}

.grid-line.vertical:nth-child(4) {
  left: 20%;
}

.grid-line.vertical:nth-child(5) {
  left: 50%;
}

.grid-line.vertical:nth-child(6) {
  left: 80%;
}

.blog-categories {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.blog-categories-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.blog-categories-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.025em;
  position: relative;
  z-index: 2;
}

.blog-categories-subtitle {
  color: rgba(107, 114, 128, 1);
  font-size: 1.125rem;
  max-width: 36rem;
  margin: 0 auto 1rem;
}

.dark .blog-categories-subtitle {
  color: rgba(156, 163, 175, 1);
}

.title-underline {
  width: 4rem;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  margin: 10px auto;
  border-radius: 2px;
}

.blog-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.blog-card-container {
  animation: card-fade-in 0.8s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes card-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-categories-title {
    font-size: 2rem;
  }
  
  .blog-categories-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .blog-categories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
  
  .blog-categories-wrapper {
    margin: 2rem auto;
  }
}

@media (max-width: 640px) {
  .blog-categories-title {
    font-size: 1.75rem;
  }
  
  .blog-categories-header {
    margin-bottom: 2rem;
  }
}
</style>
