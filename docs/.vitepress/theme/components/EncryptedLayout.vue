<template>
  <div>
    <DocumentEncrypt
      v-if="showDialog"
      :visible="showDialog"
      :rule="currentRule"
      :current-path="currentPath"
      @verified="handleVerified"
      @update:visible="showDialog = $event"
    />

    <MyLayout v-if="!needEncrypt" />

    <!-- <div v-else class="encrypt-placeholder">
      <div class="content">
        <div class="icon">🔒</div>
        <h2>文档已加密</h2>
        <p>请输入密码访问</p>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useData } from "vitepress";
import MyLayout from "./MyLayout.vue";
import DocumentEncrypt from "./DocumentEncrypt.vue";

const { site, page } = useData();
const showDialog = ref(false);
const needEncrypt = ref(false);

const currentPath = computed(() => {
  return "/" + page.value.relativePath.replace(/\.md$/, ".html");
});

const currentRule = computed(() => {
  const config = (site.value.themeConfig as any)?.encrypt;
  if (!config) return null;

  for (const rule of config.rules) {
    if (currentPath.value.includes(rule.path.replace("*", ""))) {
      return rule;
    }
  }
  return null;
});

const handleVerified = () => {
  needEncrypt.value = false;
  showDialog.value = false;
};

onMounted(() => {
  console.log(currentRule.value);

  if (currentRule.value) {
    needEncrypt.value = true;
    showDialog.value = true;
  }
});
</script>

<style scoped>
.encrypt-placeholder {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
  padding: 2rem;
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}
</style>
