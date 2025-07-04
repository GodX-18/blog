<script lang="ts" setup>
import { useData } from "vitepress";
import { computed, ref, onMounted, watch } from "vue";
import { countWord } from "../untils/functions";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { Calendar, Document, Timer, Menu } from "@element-plus/icons-vue";

const { page, frontmatter, isDark } = useData();

// 最后更新日期
const lastUpdated = computed(() =>
  dayjs(frontmatter.value.date || page.value.lastUpdated!)
    .locale("zh-cn")
    .format("YYYY年MM月DD日")
);

// 统计数据
const wordCount = ref(0);
const imageCount = ref(0);

// 计算阅读时间
const readTime = computed(() => {
  // 文字阅读时间（假设每分钟阅读275字）
  const wordTime = (wordCount.value / 275) * 60;

  // 图片浏览时间（前10张图片时间递增，之后每张3秒）
  const n = imageCount.value;
  const imageTime =
    n <= 10
      ? n * 13 + (n * (n - 1)) / 2 // 等差数列求和
      : 175 + (n - 10) * 3;

  // 总时间（分钟）
  return Math.ceil((wordTime + imageTime) / 60);
});

// 分析文章内容
function analyzeContent() {
  // 清理旧的元数据描述
  document.querySelectorAll(".meta-des").forEach((v) => v.remove());

  // 获取内容容器
  const docContainer = window.document.querySelector("#VPContent");
  if (!docContainer) return;

  // 统计图片
  const imgs = docContainer.querySelectorAll<HTMLImageElement>(".content-container .main img");
  imageCount.value = imgs?.length || 0;

  // 统计文字
  const content = docContainer.querySelector(".content-container .main")?.textContent || "";
  wordCount.value = countWord(content);
}

// 监听页面变化，重新分析内容
watch(
  () => page.value.relativePath,
  () => {
    // 当页面路径变化时重新分析
    setTimeout(analyzeContent, 100);
  },
  { immediate: false }
);

onMounted(() => {
  // 初始化时执行
  analyzeContent();
});
</script>

<template>
  <div class="flex flex-wrap gap-2.5 text-sm text-vp-c-text-2 mt-5">
    <!-- 写作日期 -->
    <el-tooltip content="文章的发布或最后更新日期" placement="top">
      <div class="flex items-center cursor-help">
        <Calendar style="width: 1em; height: 1em; margin-right: 8px" />
        {{ lastUpdated }}
      </div>
    </el-tooltip>

    <!-- 字数统计 -->
    <el-tooltip content="文章的总字数统计" placement="top">
      <div class="flex items-center cursor-help">
        <Document style="width: 1em; height: 1em; margin-right: 8px" />
        {{ wordCount }} 字
      </div>
    </el-tooltip>

    <!-- 阅读时长 -->
    <el-tooltip content="预计的阅读完成时间" placement="top">
      <div class="flex items-center cursor-help">
        <Timer style="width: 1em; height: 1em; margin-right: 8px" />
        {{ readTime }} 分钟
      </div>
    </el-tooltip>

    <!-- 类别 -->
    <el-tooltip v-if="frontmatter.category" content="文章所属分类" placement="top">
      <div class="flex items-center cursor-help">
        <Menu style="width: 1em; height: 1em; margin-right: 8px" />
        {{ frontmatter.category }}
      </div>
    </el-tooltip>
  </div>
</template>

<style>
.word {
  color: var(--vp-c-text-2);
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.icon {
  display: inline-block;
  transform: translate(0px, 2px);
}
</style>
