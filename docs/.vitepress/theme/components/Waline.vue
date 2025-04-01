<template>
  <Waline v-bind="option" style="margin-top: 20px;" />
</template>
<script setup>
import "@waline/client/waline.css";
import { Waline } from "@waline/client/component";
import { toRef, computed } from "vue";
import { useData, useRoute } from "vitepress";

const isDark = toRef(useData(), "isDark");
const route = useRoute();

const option = computed(() => ({
  serverURL: "https://test-eta-ten-99.vercel.app/",
  path: route.path,
  dark: isDark.value,
  comment: true,
  copyright: false,
  pageview: true,
  reaction: false
}));
</script>
