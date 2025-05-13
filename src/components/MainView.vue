<script setup>
import { computed } from "vue"

const props = defineProps({
  tabs: Array,
  activeTab: String,
})

const activeTabComponent = computed(() => {
  const tab = props.tabs.find((t) => t.key === props.activeTab)
  if (tab) {
    return tab
  } else {
    return props.tabs[0]
  }
})
</script>

<template>
  <div class="tab-content">
    <div class="container">
      <keep-alive>
        <component :is="activeTabComponent.component" v-bind="activeTabComponent.props" />
      </keep-alive>
    </div>
  </div>
</template>
