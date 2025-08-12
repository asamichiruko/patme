import type { PiniaPluginContext } from "pinia"
import type { StorageService } from "@/services/StorageService"

declare module "pinia" {
  export interface PiniaCustomProperties {
    $storage: StorageService
  }
}

export function storagePlugin(storageService: StorageService) {
  return (context: PiniaPluginContext) => {
    context.store.$storage = storageService
  }
}
