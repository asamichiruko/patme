<script setup lang="ts">
import PageHeader from "@/components/util/PageHeader.vue"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { auth } from "@/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { ref } from "vue"

const { trigger } = useNotificationBar()

const email = ref("")
const dialogRef = ref<HTMLDialogElement | null>(null)

async function sendMail() {
  if (!email.value) {
    trigger("メールアドレスを入力してください", "error")
    return
  }
  try {
    await sendPasswordResetEmail(auth, email.value)
  } catch (err) {
    console.error("Failed send password reset email", err)
    trigger("パスワード再設定用のメール送信に失敗しました。メールアドレスをご確認ください", "error")
  }
}

function confirm() {
  dialogRef.value?.close()
}
</script>

<template>
  <PageHeader :show-account-nav="false" :logo-href="'./login'" />
  <div class="container">
    <h2>パスワードの再発行</h2>
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
      <button type="button" class="primary-button" @click="sendMail">パスワードを再発行する</button>
    </form>
    <p><a href="./login">ログイン画面へ戻る</a></p>
  </div>

  <dialog ref="dialogRef" @cancel="confirm">
    <p class="message">
      メールアドレス宛にパスワード再設定用のメールを送信しました。ご確認ください。
    </p>
    <div class="actions">
      <button class="primary-button" type="button" @click="confirm">決定</button>
    </div>
  </dialog>
</template>

<style scoped>
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

dialog {
  border: none;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
