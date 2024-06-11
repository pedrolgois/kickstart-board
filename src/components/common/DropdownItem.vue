<template>
  <div
    class="block py-1 px-2 pt-2 text-sm text-gray-700 hover:bg-gray1 active:bg-gray2 cursor-pointer  title && 'bold'"
  >
    <span
      :class="warning && 'text-red-600'"
    >{{ itemText }}</span>
    <slot>{{ }}</slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  itemText: {
    default: '',
    type: String,
  },
  warning: {
    default: false,
    type: Boolean,
  },
  children: {
    default: null,
    type: Object,
  },
});
</script>
