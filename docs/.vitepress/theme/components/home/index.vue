<template>
  <!-- <TextType
    :text="['Text typing effect', 'for your websites', 'Happy coding!']"
    :typingSpeed="75"
    :pauseDuration="1500"
    :showCursor="true"
    cursorCharacter="|"
  /> -->
  <div class="w-full min-h-screen">
    <Lightning
      :hue="230"
      :x-offset="0"
      :speed="1"
      :intensity="1"
      :size="1"
      class="w-full h-full"
    />
  </div>
  <div class="card"></div>
</template>

<script lang="ts" setup>
import TextType from "@component/TextType.vue";
import Lightning from "@component/Lightning.vue";
</script>

<style lang="scss" scoped></style>
