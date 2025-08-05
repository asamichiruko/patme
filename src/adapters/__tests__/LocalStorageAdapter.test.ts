import { LocalStorageAdapter } from "../LocalStorageAdapter"

type DummyItem = { id: string; value: string }

describe("LocalStorageAdapter", () => {
  const storageKey = "dummy"
  let adapter: LocalStorageAdapter<DummyItem>

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter<DummyItem>(storageKey)
  })

  test("item を get/set できる", async () => {
    const item = { id: "id1", value: "value 1" }
    await adapter.set(item)
    const result = await adapter.get("id1")

    expect(result).toEqual(item)
  })

  test("全 item を取得できる", async () => {
    await adapter.set({ id: "id1", value: "value 1" })
    await adapter.set({ id: "id2", value: "value 2" })
    const result = await adapter.getAll()
    expect(result).toHaveLength(2)
    expect(result.map((i) => i.id).sort()).toEqual(["id1", "id2"])
  })

  test("新規 item を add できる", async () => {
    const item = { value: "value 1" }
    const result = await adapter.add(item)
    const added = await adapter.get(result.id)

    expect(added).toEqual(result)
  })

  test("id が重複する item を add できない", async () => {
    await adapter.set({ id: "id1", value: "old value" })
    vi.spyOn(adapter, "generateId").mockReturnValueOnce("id1")
    await expect(async () => {
      await adapter.add({ value: "new value" })
    }).rejects.toThrow()
  })

  test("既存 item を update できる", async () => {
    await adapter.set({ id: "id1", value: "old value" })
    const updatable = { id: "id1", value: "new value" }
    await adapter.update(updatable)
    const updated = await adapter.get("id1")
    expect(updated).toEqual(updatable)
  })

  test("存在しない id の item を update できない", async () => {
    const updatable = { id: "id1", value: "new value" }

    await expect(async () => {
      await adapter.update(updatable)
    }).rejects.toThrow()
  })

  test("item を削除できる", async () => {
    await adapter.set({ id: "id1", value: "value 1" })
    let result = await adapter.get("id1")
    expect(result).not.toBeNull()

    await adapter.delete("id1")
    result = await adapter.get("id1")
    expect(result).toBeNull()
  })
})
