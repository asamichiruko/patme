import { LocalStorageAdapter } from "../LocalStorageAdapter"

describe("LocalStorageAdapter", () => {
  const storageKey = "dummy"
  let adapter: LocalStorageAdapter

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter(storageKey)
  })

  test("全 item を取得できる", async () => {
    await adapter.add({ value: "value 1" })
    await adapter.add({ value: "value 2" })
    const gotItems = await adapter.getAll()
    expect(gotItems).toHaveLength(2)
    expect(gotItems.map((i) => i.value).sort()).toEqual(["value 1", "value 2"])
  })

  test("item が存在しないとき全 item を取得しようとすると空配列が返る", async () => {
    const gotItems = await adapter.getAll()
    expect(gotItems).toEqual([])
  })

  test("存在しない item を取得しようとすると null が返る", async () => {
    const gotItem = await adapter.get("dummy")
    expect(gotItem).toBeNull()
  })

  test("新規 item を追加できる", async () => {
    const item = { value: "value 1" }
    const id = await adapter.add(item)
    const gotItem = await adapter.get(id)
    expect(gotItem).not.toBeNull()
    expect(gotItem?.value).toEqual(item.value)
  })

  test("id が重複する item は追加できない", async () => {
    const spy = vi.spyOn(adapter, "generateId").mockReturnValue("id1")
    await adapter.add({ value: "old value" })
    await expect(async () => {
      await adapter.add({ value: "new value" })
    }).rejects.toThrow()
    spy.mockRestore()
  })

  test("存在する item を更新できる", async () => {
    const id = await adapter.add({ value: "old value" })
    await adapter.update(id, { value: "new value" })
    const updated = await adapter.get(id)
    expect(updated).not.toBeNull()
    expect(updated?.value).toEqual("new value")
  })

  test("存在しない item は更新できない", async () => {
    await expect(async () => {
      await adapter.update("dummyId", { value: "new value" })
    }).rejects.toThrow()
  })

  test("item を削除できる", async () => {
    const id = await adapter.add({ value: "value 1" })
    let gotItem = await adapter.get(id)
    expect(gotItem).not.toBeNull()

    await adapter.delete(id)
    gotItem = await adapter.get(id)
    expect(gotItem).toBeNull()
  })

  test("item を追加すると createdAt 属性が ISOString 形式で付加される", async () => {
    vi.useFakeTimers()
    const datetime = new Date("2025-04-01 09:00:00")
    vi.setSystemTime(datetime)
    const id = await adapter.add({ value: "value 1" })
    const gotItem = await adapter.get(id)
    expect(gotItem?.createdAt).toBe(datetime.toISOString())
    vi.useRealTimers()
  })
})
