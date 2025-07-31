<script setup>
import EntryFormTypeSelector from "@/components/entry/EntryFormTypeSelector.vue"
import { useNotificationBar } from "@/composables/useNotificationBar.js"
import { useEntryStore } from "@/stores/useEntryStore.js"
import { ref } from "vue"

const entryStore = useEntryStore()
const { trigger } = useNotificationBar()
const text = ref("")
const textareaRef = ref(null)
const entryType = ref("achievement")

const submit = () => {
  const content = text.value.trim()
  if (!content) {
    trigger("記録内容を入力してください", "error")
    return
  }
  const result = entryStore.addAchievement({
    content,
    date: new Date(),
    entryType: entryType.value,
  })
  if (result) {
    text.value = ""
    entryType.value = "achievement"
    trigger("記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="header-label">記録の評価（種類）</div>
    <EntryFormTypeSelector v-model="entryType" />
    <label>
      <div class="header-label">記録する内容</div>
      <textarea
        ref="textareaRef"
        v-model="text"
        @keydown.ctrl.enter="submit"
        placeholder="どんなことがありましたか？"
        :class="['entry-content', entryType]"
      ></textarea>
    </label>
    <div class="actions">
      <button class="primary-button" type="submit">記録する</button>
    </div>
  </form>
</template>

<style scoped>
.header-label {
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 18px;
}
.entry-content {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  height: 100px;
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 1.6;
}
.entry-content.achievement {
  box-shadow: inset 5px 0 var(--color-entry-type-achievement-border);
}
.entry-content.incomplete {
  box-shadow: inset 5px 0 var(--color-entry-type-incomplete-border);
}
.entry-content.accepted {
  box-shadow: inset 5px 0 var(--color-entry-type-accepted-border);
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
