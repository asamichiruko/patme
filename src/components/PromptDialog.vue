<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  show: Boolean,
  message: String,
  submittext: String,
  canceltext: String,
  placeholder: String,
})
const emit = defineEmits(["update:show", "submit", "cancel"])

const dialogRef = ref(null)
const text = ref("")

watch(
  () => props.show,
  async (val) => {
    if (val) {
      text.value = ""
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

const submit = () => {
  emit("submit", text.value)
  emit("update:show", false)
}

const cancel = () => {
  emit("cancel")
  emit("update:show", false)
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <template v-if="show">
        <form @submit.prevent="submit">
          <label>
            <span class="message">{{ message }}</span>
            <textarea
              v-model="text"
              @keydown.ctrl.enter="submit"
              :placeholder="placeholder"
              class="text"
              required
            ></textarea>
          </label>
          <div class="actions">
            <button class="primary-button" type="submit">{{ submittext }}</button>
            <button class="cancel-button" type="button" @click="cancel">{{ canceltext }}</button>
          </div>
        </form>
      </template>
    </dialog>
  </Teleport>
</template>

<style scoped>
dialog {
  border: none;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.text {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
  display: block;
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
  height: 60px;
  line-height: 1.6;
}
.actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}
</style>
