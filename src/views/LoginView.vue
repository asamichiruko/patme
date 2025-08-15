<script setup lang="ts">
import { auth } from "@/firebase"
import { signInAnonymously } from "firebase/auth"
import { useRouter } from "vue-router"

const router = useRouter()

const login = async () => {
  try {
    await signInAnonymously(auth)
    router.push("/main")
  } catch (err) {
    console.error("Login error:", err)
  }
}
</script>

<template>
  <h2>ログイン画面</h2>
  <p><button @click="login">匿名ログイン</button></p>
</template>
