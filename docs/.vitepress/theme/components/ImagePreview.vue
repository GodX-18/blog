<script setup lang="ts">
import { ElImageViewer } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";

const show = ref(false);
const previewImageInfo = reactive<{ url: string; list: string[]; idx: number }>({
  url: "",
  list: [],
  idx: 0,
});
function previewImage(e: Event) {
  const target = e.target as HTMLElement;
  const currentTarget = e.currentTarget as HTMLElement;
  const blackList = ["wl-gallery-item","wl-reaction-item"];
  console.log(target);
  
  if (blackList.includes(target.className)) {
    return;
  }
  if (target.tagName.toLowerCase() === "img") {
    const imgs = currentTarget.querySelectorAll<HTMLImageElement>(
      ".content-container .main img"
    );
    const idx = Array.from(imgs).findIndex((el) => el === target);
    const urls = Array.from(imgs).map((el) => el.src);

    const url = target.getAttribute("src");
    previewImageInfo.url = url!;
    previewImageInfo.list = urls;
    previewImageInfo.idx = idx;

    // 兼容点击main之外的图片
    if (idx === -1 && url) {
      previewImageInfo.list.push(url);
      previewImageInfo.idx = previewImageInfo.list.length - 1;
    }
    show.value = true;
  }
}
onMounted(() => {
  const docDomContainer = document.querySelector("#VPContent");

  if (docDomContainer) {
    const images = docDomContainer.querySelectorAll("img");
    images.forEach((img) => {
      img.style.cursor = "pointer";
    });
  }

  docDomContainer?.addEventListener("click", previewImage);
});

onUnmounted(() => {
  const docDomContainer = document.querySelector("#VPContent");
  docDomContainer?.removeEventListener("click", previewImage);
});
</script>

<template>
  <ElImageViewer
    v-if="show"
    :infinite="false"
    hide-on-click-modal
    teleported
    lazy
    :zoom-rate="1.05"
    :url-list="previewImageInfo.list"
    :initial-index="previewImageInfo.idx"
    @close="show = false"
  />
</template>
