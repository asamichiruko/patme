<script setup>
import { ref } from "vue"
import { RecordModel } from "./models/RecordModel.js"
import { Storage } from "./models/Storage.js"
import InputForm from "./components/InputForm.vue"
import RecordList from "./components/RecordList.vue"
import SettingsForm from "./components/SettingsForm.vue"

const recordModel = new RecordModel(new Storage())
const currentView = ref("InputForm")
</script>

<template>
    <div class="tab-container">
        <div class="tab" :class="{ active: currentView === 'InputForm' }" @click="currentView = 'InputForm'">入力する</div>
        <div class="tab" :class="{ active: currentView === 'RecordList' }" @click="currentView = 'RecordList'">リスト</div>
        <div class="tab" :class="{ active: currentView === 'SettingsForm' }" @click="currentView = 'SettingsForm'">設定</div>
    </div>
    <div class="tab-content">
        <div class="container">
            <InputForm :record-model="recordModel" v-if="currentView === 'InputForm'" />
            <RecordList :record-model="recordModel" v-if="currentView === 'RecordList'" />
            <SettingsForm :record-model="recordModel" v-if="currentView === 'SettingsForm'" />
        </div>
    </div>
</template>

<style scoped>
</style>
