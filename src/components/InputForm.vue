<script setup>
import { ref } from "vue"
import { useNotification } from "@/composables/useNotification.js"

const props = defineProps({
  entryModel: Object,
})

const { trigger } = useNotification()
const text = ref("")
const textareaRef = ref(null)

const submit = () => {
  const content = text.value.trim()
  if (!content) {
    trigger("できたことを入力してください", "error")
    return
  }
  const result = props.entryModel.addAchievement({ content })
  if (result) {
    text.value = ""
    trigger("できたことを記録しました！", "success")
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
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
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
