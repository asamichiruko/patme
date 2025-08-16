<script setup lang="ts">
import { useConfirmDialog } from "@/composables/useConfirmDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { auth } from "@/firebase"
import router from "@/router"
import { FirebaseError } from "firebase/app"
import { deleteUser } from "firebase/auth"

const { openConfirm } = useConfirmDialog()
const { trigger } = useNotificationBar()

async function handleDeleteUser() {
  const result = await openConfirm(
    `ユーザアカウント削除の確認`,
    `ふりかえり帖アプリからユーザ情報を削除しようとしています。この操作を行うと、これまでの記録に以後アクセスできなくなります。本当に削除してもよろしいですか？`,
  )

  if (!result) return

  const user = auth.currentUser
  if (!user) {
    trigger(`ユーザ情報を取得できませんでした`)
    return
  }

  try {
    await deleteUser(user)
    router.push("/login").then(() => {
      trigger(`ユーザアカウントを削除しました`, "success")
    })
  } catch (err) {
    if (err instanceof FirebaseError && err.code === "auth/requires-recent-login") {
      console.error("Error deleting user: ", err)
      alert("セキュリティ上の理由で再ログインが必要です。再ログイン後に削除をお試しください")
      router.push("/login")
    } else {
      console.error("Error deleting user: ", err)
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleDeleteUser">
    <button type="submit" class="warning-button">ユーザを削除する</button>
  </form>
</template>
