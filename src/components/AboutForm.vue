<template>
    <div>
        <div class="p-3"><button @click="this.$router.go(-1)" class="btn btn-secondary">&lt; Назад</button></div>
        <div class="container mt-5">
            <h1 class="mb-4">О нас</h1>
            <slot name="info"></slot>
        </div>
    </div>
</template>
  
<script>

</script>
  

  