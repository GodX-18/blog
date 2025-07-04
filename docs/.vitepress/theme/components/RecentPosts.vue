<script setup>
import { onMounted } from 'vue'
import { data as posts } from '../posts.data.js'

// 获取最近的5篇文章
const recentPosts = posts
  .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
  .slice(0, 5)
  .map(post => ({
    title: post.frontmatter.title,
    date: post.frontmatter.date,
    category: post.frontmatter.category || '',
    categoryLink: `/blog/${post.frontmatter.category?.toLowerCase() || 'uncategorized'}/`,
    link: post.url
  }))

// 动画监控
onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('post-item-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.post-item').forEach(item => {
      observer.observe(item);
    });
  }
});
</script>

<template>
  <div class="recent-posts-wrapper">
    <div class="recent-posts">
      <div class="recent-posts-header">
        <span class="recent-posts-title">最近文章</span>
        <div class="title-underline"></div>
      </div>
      
      <div class="post-list">
        <div v-for="(post, index) in recentPosts" :key="post.title" class="post-item" :style="{ '--stagger-delay': `${index * 0.1}s` }">
          
          <div class="post-content">
            <a :href="post.categoryLink" class="post-category">{{ post.category }}</a>
            <a :href="post.link" class="post-title-link">
              <h3 class="post-title">{{ post.title }}</h3>
            </a>
            <div class="post-meta">
              <div class="post-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" class="post-meta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z"/><path d="M12 6v6l4 2"/></svg>
                <span>{{ post.date }}</span>
              </div>
              <a :href="post.link" class="read-more">
                阅读全文
                <svg xmlns="http://www.w3.org/2000/svg" class="read-more-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-posts-wrapper {
  position: relative;
  margin: 5rem auto;
  padding: 0 1.5rem;
}

.recent-posts {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
}

.recent-posts-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.recent-posts-title {
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

.post-list {
  position: relative;
}

.post-list:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 10px;
  left: 11rem;
  width: 3px;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899);
  z-index: -1;
  border-radius: 3px;
  opacity: 0.3;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
}

.post-item {
  display: flex;
  margin-bottom: 3rem;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger-delay);
}

.post-item-visible {
  opacity: 1;
  transform: translateY(0);
}

.dark .post-date {
  background-color: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.dark .post-date::before {
  background-color: rgba(30, 41, 59, 0.9);
  border-top: 1px solid rgba(59, 130, 246, 0.3);
  border-right: 1px solid rgba(59, 130, 246, 0.3);
}

.post-item:hover .post-date {
  transform: scale(1.05);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.15);
}

.post-item:hover .post-date::before {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  border-color: rgba(59, 130, 246, 0.5);
}

.post-date-day {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.post-date-month {
  font-size: 0.75rem;
  color: rgba(107, 114, 128, 1);
}

.dark .post-date-month {
  color: rgba(156, 163, 175, 1);
}

.post-content {
  flex: 1;
  background-color: white;
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.post-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.post-item:hover .post-content::before {
  opacity: 1;
}

.dark .post-content {
  background-color: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.post-item:hover .post-content {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.08);
}

.dark .post-item:hover .post-content {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(59, 130, 246, 0.2);
}

.post-category {
  display: inline-block;
  padding: 0.4rem 0.85rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #3b82f6;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-decoration: none;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.1);
  letter-spacing: 0.01em;
}

.post-category:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
  border-color: rgba(59, 130, 246, 0.4);
  color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.15);
}

.post-title-link {
  text-decoration: none;
  display: block;
  margin-bottom: 1.25rem;
}

.post-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: rgba(17, 24, 39, 1);
  transition: all 0.3s ease;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.dark .post-title {
  color: rgba(229, 231, 235, 1);
}

.post-title-link:hover .post-title {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  transform: translateX(5px);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(107, 114, 128, 1);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.dark .post-meta {
  color: rgba(156, 163, 175, 1);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.post-meta-item {
  display: flex;
  align-items: center;
}

.post-meta-icon {
  margin-right: 0.5rem;
  color: #3b82f6;
}

.read-more {
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 1.5rem;
  background-color: transparent;
}

.read-more-icon {
  margin-left: 0.25rem;
  transition: transform 0.3s ease;
}

.read-more:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.read-more:hover .read-more-icon {
  transform: translateX(5px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .recent-posts-title {
    font-size: 2rem;
  }
  
  .post-list:before {
    left: 32px;
  }
  
  .post-date-container {
    width: 120px;
    margin-right: 1.25rem;
  }
  
  .post-date {
    width: 110px;
    height: 55px;
  }
  
  .post-date-day {
    font-size: 1rem;
  }
  
  .post-date-month {
    font-size: 0.625rem;
  }
  
  .post-content {
    padding: 1.25rem;
  }
  
  .post-title {
    font-size: 1.125rem;
  }
  
  .recent-posts-wrapper {
    margin: 3rem auto;
  }
}

@media (max-width: 640px) {
  .recent-posts-title {
    font-size: 1.75rem;
  }
  
  .title-underline {
    width: 4rem;
    height: 4px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .post-meta-item {
    font-size: 0.75rem;
  }
  
  .post-title {
    font-size: 1.1rem;
  }
  
  .read-more {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
  
  .post-date-container {
    width: 90px;
  }
  
  .post-date {
    width: 85px;
    height: 50px;
  }
  
  .post-item {
    margin-bottom: 2.5rem;
  }
}
</style> 