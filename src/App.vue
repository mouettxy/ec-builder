<script setup lang="ts">
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#3590f3',
    primaryColorHover: '#3082db',
    primaryColorPressed: '#2a73c2',
    infoColor: '#28c2ff',
    successColor: '#38b000',
    errorColor: '#A31621',
    warningColor: '#F4743B',
    hoverColor: '#3590f3',
  },
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <main class="w-full h-full">
      <section class="flex justify-center">
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </section>
    </main>
  </n-config-provider>
</template>
