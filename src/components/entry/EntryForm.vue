<script setup>
import { ref } from "vue"
import { useNotification } from "@/composables/useNotification.js"
import { useEntryStore } from "@/stores/useEntryStore.js"

const entryStore = useEntryStore()
const { trigger } = useNotification()
const text = ref("")
const textareaRef = ref(null)

const submit = () => {
  const content = text.value.trim()
  if (!content) {
    trigger("達成内容を入力してください", "error")
    return
  }
  const result = entryStore.addAchievement({ content, date: new Date() })
  if (result) {
    text.value = ""
    trigger("達成内容を記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <label
      ><span class="message">達成内容</span>
      <textarea
        ref="textareaRef"
        v-model="text"
        @keydown.ctrl.enter="submit"
        placeholder="できたことを教えてください"
      ></textarea>
    </label>
    <div class="actions">
      <button class="primary-button" type="submit">記録する</button>
    </div>
  </form>
</template>

<style scoped>
.message {
  display: block;
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
}
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  height: 100px;
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 1.6;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
