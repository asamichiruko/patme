<script setup>
defineProps({
    currentTab: String,
    tabs: Array
})

defineEmits([
    "update:currentTab"
])
</script>

<template>
    <div class="tab-container">
        <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab', { active: currentTab === tab.key }]"
            @click="$emit('update:currentTab', tab.key)">
            {{ tab.label }}
        </div>
    </div>
</template>
