<script setup>
import { ref } from "vue"

const props = defineProps({
    recordModel: Object
})

const message = ref("")
const inputText = ref("")
function saveAchievement() {
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
        <textarea id="inputText" v-model="inputText" placeholder="できたことを教えてください"></textarea>
    </div>
    <button @click="saveAchievement">記録する</button>
    <p v-if="message">{{ message }}</p>
</template>

<style scoped>
</style>
