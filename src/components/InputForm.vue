<script setup>
import { ref } from "vue"
import { useNotification } from "@/composables/useNotification.js"

const props = defineProps({
  recordModel: Object,
})

const { trigger } = useNotification()
const inputText = ref("")

const saveAchievement = () => {
  const content = inputText.value.trim()
  if (!content) {
    trigger("できたことを入力してください", "error")
    return
  }
  const result = props.recordModel.addAchievement({ content })
  if (result) {
    inputText.value = ""
    trigger("できたことを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}
</script>

<template>
  <div class="form-group">
    <label for="inputText">達成内容</label>
    <textarea
      id="inputText"
      v-model="inputText"
      placeholder="できたことを教えてください"
    ></textarea>
  </div>
  <button class="primary-button" @click="saveAchievement">記録する</button>
</template>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
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
}
</style>
