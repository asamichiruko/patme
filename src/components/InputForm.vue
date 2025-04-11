<script setup>
import { nextTick, ref, onActivated } from "vue"
import { useNotification } from "@/composables/useNotification.js"

const props = defineProps({
  recordModel: Object,
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
  const result = props.recordModel.addAchievement({ content })
  if (result) {
    text.value = ""
    trigger("できたことを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

onActivated(() => {
  nextTick(() => textareaRef.value?.focus())
})
</script>

<template>
  <form @submit.prevent="submit">
    <label for="text">達成内容</label>
    <textarea
      ref="textareaRef"
      v-model="text"
      @keydown.ctrl.enter="submit"
      name="text"
      placeholder="できたことを教えてください"
    ></textarea>
    <button class="primary-button" type="submit">記録する</button>
  </form>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
textarea {
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 100px;
  font-size: 16px;
  margin-bottom: 1em;
}
</style>
