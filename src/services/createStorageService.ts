import type { Entry } from "@/schemas/Entry"
import type { Comment } from "@/schemas/Comment"
import type { Tag } from "@/schemas/Tag"
import { LocalStorageAdapter } from "@/adapters/LocalStorageAdapter"
import { EntryRepository } from "@/repositories/EntryRepository"
import { CommentRepository } from "@/repositories/CommentRepository"
import { TagRepository } from "@/repositories/TagRepository"
import { StorageService } from "./StorageService"
import { FirestoreAdapter } from "@/adapters/FirestoreAdapter"
import { initializeEntryService } from "@/stores/useEntryStore"
import { initializeCommentService } from "@/stores/useCommentStore"
import { initializeTagService } from "@/stores/useTagStore"
import { initializeDataTransferService } from "@/stores/useDataTransferStore"

type StorageBackend = "local" | "firestore"

export interface StorageConfig {
  backend: StorageBackend
  uid?: string
}

export function createStorageService(config: StorageConfig): StorageService {
  let entryRepo
  let commentRepo
  let tagRepo
  let storageService

  if (config.backend === "local") {
    entryRepo = new EntryRepository(new LocalStorageAdapter<Entry>("entries"))
    commentRepo = new CommentRepository(new LocalStorageAdapter<Comment>("comments"))
    tagRepo = new TagRepository(new LocalStorageAdapter<Tag>("tags"))
    storageService = new StorageService(entryRepo, commentRepo, tagRepo)
  } else if (config.backend === "firestore") {
    if (!config.uid) throw new Error("Config should have uid")

    entryRepo = new EntryRepository(new FirestoreAdapter<Entry>("entries", config.uid))
    commentRepo = new CommentRepository(new FirestoreAdapter<Comment>("comments", config.uid))
    tagRepo = new TagRepository(new FirestoreAdapter<Tag>("tags", config.uid))
  } else {
    throw new Error("Unknown backend")
  }
  storageService = new StorageService(entryRepo, commentRepo, tagRepo)

  initializeEntryService(storageService)
  initializeCommentService(storageService)
  initializeTagService(storageService)
  initializeDataTransferService(storageService)

  return storageService
}
