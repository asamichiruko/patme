import { GenericLocalStorageAdapter } from "../GenericLocalStorageAdapter"

type DummyItem = { id: string; value: string }

describe("GenericLocalStorageAdapter", () => {
  const storageKey = "dummy"
  let adapter: GenericLocalStorageAdapter<DummyItem>

  beforeEach(() => {
    localStorage.clear()
    adapter = new GenericLocalStorageAdapter<DummyItem>(storageKey)
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

  test("item を削除できる", async () => {
    await adapter.set({ id: "id1", value: "value 1" })
    let result = await adapter.get("id1")
    expect(result).not.toBeNull()

    await adapter.delete("id1")
    result = await adapter.get("id1")
    expect(result).toBeNull()
  })
})
