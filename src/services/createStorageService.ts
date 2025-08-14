import type { Entry } from "@/schemas/Entry"
import type { Comment } from "@/schemas/Comment"
import type { Tag } from "@/schemas/Tag"
import type { DataStoreAdapter } from "@/adapters/DataStoreAdapter"
import { LocalStorageAdapter } from "@/adapters/LocalStorageAdapter"
import { EntryRepository } from "@/repositories/EntryRepository"
import { CommentRepository } from "@/repositories/CommentRepository"
import { TagRepository } from "@/repositories/TagRepository"
import { StorageService } from "./StorageService"

type StorageBackend = "local" | "firestore"

export interface StorageConfig {
  backend: StorageBackend
}

export function createStorageService(config: StorageConfig): StorageService {
  const adapterFactory = <T extends { id: string }>(key: string): DataStoreAdapter<T> => {
    if (config.backend === "local") {
      return new LocalStorageAdapter<T>(key)
    } else {
      throw new Error(`Invalid config.backend: ${config.backend}`)
    }
  }

  const entryRepo = new EntryRepository(adapterFactory<Entry>("entries"))
  const commentRepo = new CommentRepository(adapterFactory<Comment>("comments"))
  const tagRepo = new TagRepository(adapterFactory<Tag>("tags"))

  return new StorageService(entryRepo, commentRepo, tagRepo)
}
