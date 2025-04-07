<script setup>
import InputForm from "./components/InputForm.vue"
import RecordList from "./components/RecordList.vue"
import { RecordModel } from "./models/RecordModel.js"
import { Storage } from "./models/Storage.js"

const recordModel = new RecordModel(new Storage())
</script>

<template>
    <InputForm :recordModel="recordModel" />
    <RecordList :recordModel="recordModel" />
</template>

<style scoped>
</style>
