<script setup>
import { ref } from "vue"

const props = defineProps({
  recordModel: Object,
})

const message = ref("")
const inputText = ref("")
const saveAchievement = () => {
  const content = inputText.value.trim()
  if (!content) {
    message.value = "できたことを入力してください"
    return
  }
  const result = props.recordModel.addAchievement({ content })
  if (result) {
    inputText.value = ""
    message.value = "できたことを記録しました！"
  } else {
    message.value = "記録に失敗しました。時間をおいて再度お試しください"
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
  <p v-if="message">{{ message }}</p>
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
