import { defineStore } from "pinia"
import type { Entry } from "@/schemas/Entry"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"

export const useEntryStore = defineStore("entry", {
  state: () => ({
    entriesWithRelations: [] as EntryWithRelations[],
  }),
  actions: {
    async fetchEntriesWithRelations() {
      this.entriesWithRelations = await this.$storage.getAllEntriesWithRelations()
    },
    async createEntry(entryBody: Omit<Entry, "id" | "createdAt">) {
      const id = await this.$storage.createEntry(entryBody)
      await this.fetchEntriesWithRelations()
      return id
    },
    async updateReviewedState(id: string, isReviewed: boolean) {
      await this.$storage.updateEntryReviewedState(id, isReviewed)
      await this.fetchEntriesWithRelations()
    },
  },
})
