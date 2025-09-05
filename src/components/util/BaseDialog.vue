<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: "submit"): void
  (e: "close"): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.visible,
  (val) => {
    if (val) {
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

const handleSubmit = () => {
  emit("submit")
}

const handleCancel = () => {
  emit("close")
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel.prevent="handleCancel">
      <form method="dialog" @submit.prevent="handleSubmit">
        <div class="title">
          <slot name="title">
            <h2></h2>
          </slot>
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </form>
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

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
</style>
