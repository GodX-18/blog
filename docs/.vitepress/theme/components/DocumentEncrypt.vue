<template>
  <el-dialog
    v-model="dialogVisible"
    title="🔒 文档已加密"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <div class="encrypt-dialog">
      <div class="encrypt-message">
        <p>此文档需要密码才能访问</p>
        <p class="encrypt-path">{{ currentPath }}</p>
      </div>

      <el-form @submit.prevent="handleSubmit">
        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            placeholder="请输入访问密码"
            show-password
            size="large"
            @keyup.enter="handleSubmit"
            ref="passwordInput"
          />
        </el-form-item>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="handleSubmit"
            :loading="loading"
          >
            确认访问
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";

interface Props {
  visible: boolean;
  rule: any;
  currentPath: string;
}

interface Emits {
  (event: "verified"): void;
  (event: "update:visible", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const value1 = ref(new Date());
const dialogVisible = ref(false);
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const passwordInput = ref();

const handleSubmit = async () => {
  if (!password.value.trim()) {
    errorMessage.value = "请输入密码";
    return;
  }

  loading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (props.rule && props.rule.password === password.value) {
    dialogVisible.value = false;
    emit("update:visible", false);
    emit("verified");
  } else {
    errorMessage.value = "密码错误，请重试";
  }

  loading.value = false;
};

watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
    if (newVal) {
      password.value = "";
      errorMessage.value = "";
      nextTick(() => {
        passwordInput.value?.focus();
      });
    }
  }
);

onMounted(() => {
  dialogVisible.value = props.visible;
});
</script>

<style scoped>
.encrypt-dialog {
  text-align: center;
}

.encrypt-message p {
  margin: 0 0 8px 0;
  color: #606266;
}

.encrypt-path {
  font-size: 14px;
  color: #909399;
  background: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 16px;
}
</style>
