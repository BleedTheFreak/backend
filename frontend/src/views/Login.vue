<template>
    <v-main>
        <button @click="login">Login</button>
    </v-main>
</template>
<script setup lang="ts">
const link =
    "http://localhost/api/auth/login";

const login = () => {
    window.location.href = link;
};
</script>