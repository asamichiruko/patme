<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { ref } from "vue"

const email = ref("")
</script>

<template>
  <header>
    <div class="index-title">
      <h1><img :src="patmeImg" alt="" width="20px" height="20px" />ふりかえり帖</h1>
    </div>
  </header>
  <div class="container">
    <h2>アカウントの新規登録</h2>
    <form>
      <label>
        <span class="input-label">メールアドレス</span>
        <input
          v-model="email"
          class="input-text"
          name="email"
          type="email"
          placeholder="メールアドレス"
        />
      </label>
      <button type="button" class="primary-button">パスワードを再発行する</button>
    </form>
    <p><a href="./login">ログイン画面へ戻る</a></p>
  </div>
</template>

<style scoped>
header {
  margin-bottom: 32px;
}

.index-title {
  color: var(--color-header);
  text-align: center;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.index-title h1 {
  font-size: 24px;
  margin: 0;
  padding: 0;
}

.index-title img {
  margin-right: 8px;
}

p {
  margin: 0;
  padding: 0;
}

form {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  margin-bottom: 32px;
}

.input-label {
  display: inline-block;
  width: 130px;
}
.input-text {
  padding: 4px;
  font-size: 15px;
  width: 250px;
}
</style>
