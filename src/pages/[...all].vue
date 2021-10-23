<script setup lang="ts">
const router = useRouter()

const handleClick = () => {
  router.push({ name: 'index' })
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen">
    <n-result
      status="404"
      title="Куда исчезла страница?!!!"
      description="Мы очень пытались найти страницу которую вы искали, но у нас не получилось :c"
    >
      <template #footer>
        <n-button type="info" tag="a" @click="handleClick">
          Назад к работе!
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<route lang="yaml">
name: notFound
meta:
  header: Страница не найдена
</route>
