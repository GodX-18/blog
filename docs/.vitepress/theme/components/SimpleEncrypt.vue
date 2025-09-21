<template>
  <div v-if="showEncrypt" class="encrypt-overlay">
    <div class="encrypt-modal">
      <h3>🔒 文档已加密</h3>
      <p>请输入密码访问此内容</p>
      <input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        @keyup.enter="checkPassword"
        class="password-input"
      />
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      <button @click="checkPassword" class="submit-btn">确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useData } from "vitepress";

const { site, page } = useData();
const password = ref("");
const errorMsg = ref("");
const showEncrypt = ref(false);

const currentPath = computed(() => {
  return "/" + page.value.relativePath.replace(/\.md$/, ".html");
});

const encryptConfig = computed(() => {
  return site.value.themeConfig?.encrypt;
});

const currentRule = computed(() => {
  if (!encryptConfig.value) return null;

  for (const rule of encryptConfig.value.rules) {
    if (
      currentPath.value === rule.path ||
      currentPath.value.startsWith(rule.path.replace("*", ""))
    ) {
      return rule;
    }
  }
  return null;
});

const checkPassword = () => {
  if (!password.value.trim()) {
    errorMsg.value = "请输入密码";
    return;
  }

  if (currentRule.value && password.value === currentRule.value.password) {
    // 密码正确，存储到 localStorage
    localStorage.setItem(`encrypt-${currentPath.value}`, "verified");
    showEncrypt.value = false;
    errorMsg.value = "";
  } else {
    errorMsg.value = "密码错误，请重试";
    password.value = "";
  }
};

const isAlreadyVerified = () => {
  return localStorage.getItem(`encrypt-${currentPath.value}`) === "verified";
};

onMounted(() => {
  if (currentRule.value && !isAlreadyVerified()) {
    showEncrypt.value = true;
  }
});

defineExpose({
  showEncrypt,
});
</script>

<style scoped>
.encrypt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.encrypt-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.encrypt-modal h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.encrypt-modal p {
  margin: 0 0 1.5rem 0;
  color: #666;
}

.password-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 16px;
}

.password-input:focus {
  outline: none;
  border-color: #409eff;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #337ecc;
}

.error-msg {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 1rem;
}
</style>
