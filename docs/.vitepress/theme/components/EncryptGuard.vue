<template>
  <div>
    <!-- 加密验证界面 -->
    <div v-if="needEncrypt" class="encrypt-container">
      <div class="encrypt-content">
        <div class="encrypt-header">
          <div class="lock-icon">🔒</div>
          <h2>文档已加密</h2>
          <p>请输入密码访问此内容</p>
        </div>

        <form @submit.prevent="verifyPassword" class="encrypt-form">
          <input
            v-model="password"
            type="password"
            placeholder="请输入访问密码"
            class="password-input"
            ref="passwordInput"
          />
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <button type="submit" class="verify-button">确认访问</button>
        </form>
      </div>
    </div>

    <!-- 正常内容 -->
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useData } from "vitepress";

const { site, page } = useData();
const password = ref("");
const errorMessage = ref("");
const needEncrypt = ref(false);
const passwordInput = ref();

// 计算当前路径
const currentPath = computed(() => {
  const path = page.value.relativePath.replace(/\.md$/, ".html");
  return "/" + path;
});

// 获取加密配置
const encryptConfig = computed(() => {
  return site.value.themeConfig?.encrypt;
});

// 查找当前页面的加密规则
const currentRule = computed(() => {
  if (!encryptConfig.value?.rules) return null;

  const path = currentPath.value;
  
  for (const rule of encryptConfig.value.rules) {
    // 精确匹配
    if (rule.path === path) {
      return rule;
    }
    
    // 通配符匹配
    if (rule.path.includes("*")) {
      const pattern = rule.path.replace("*", "");
      if (path.startsWith(pattern)) {
        return rule;
      }
    }
  }
  
  return null;
});

// 检查是否已验证
const isVerified = () => {
  if (!currentRule.value) return true;

  const storageKey = `vitepress-encrypt-${currentPath.value}`;
  return localStorage.getItem(storageKey) === "verified";
};

// 验证密码
const verifyPassword = () => {
  if (!password.value.trim()) {
    errorMessage.value = "请输入密码";
    return;
  }

  if (currentRule.value && password.value === currentRule.value.password) {
    const storageKey = `vitepress-encrypt-${currentPath.value}`;
    localStorage.setItem(storageKey, "verified");
    needEncrypt.value = false;
    errorMessage.value = "";
    password.value = "";
  } else {
    errorMessage.value = "密码错误，请重试";
    password.value = "";
  }
};

// 检查加密状态
const checkEncryptStatus = () => {
  if (currentRule.value && !isVerified()) {
    needEncrypt.value = true;
    nextTick(() => {
      passwordInput.value?.focus();
    });
  } else {
    needEncrypt.value = false;
  }
};

// 监听路由变化
watch(
  () => page.value.relativePath,
  () => {
    checkEncryptStatus();
  },
  { immediate: true }
);

onMounted(() => {
  checkEncryptStatus();
});
</script>

<style scoped>
.encrypt-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--vp-c-bg);
}

.encrypt-content {
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.encrypt-header h2 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}

.encrypt-header p {
  margin: 0 0 2rem 0;
  color: var(--vp-c-text-2);
}

.password-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.password-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.verify-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.verify-button:hover {
  background: var(--vp-c-brand-2);
}

.error-message {
  color: var(--vp-c-danger-1);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
</style>
