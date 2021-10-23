<script setup lang="ts"></script>

<template>
  <main class="w-full h-full">
    <section class="flex justify-center">
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </section>
  </main>
</template>
