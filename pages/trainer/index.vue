<script setup>

const { data: trainers } = await useTrainers();

</script>

 

<template>

  <div>

    <h1>つづきからはじめる</h1>

    <GamifyList>

      <GamifyItem v-for="trainer in trainers" :key="trainer">

        <NuxtLink :to="`/trainer/${trainer.Key.split('.')[0]}`">{{ trainer.Key.split('.')[0] }}</NuxtLink>

      </GamifyItem>

    </GamifyList>

  </div>

</template>