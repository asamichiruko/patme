import { LocalStorageAdapter } from "../LocalStorageAdapter"

describe("LocalStorageAdapter", () => {
  const storageKey = "dummy"
  let adapter: LocalStorageAdapter<{ id: string; value: string }>

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter(storageKey)
  })

  test("全 item を取得できる", async () => {
    await adapter.create({ value: "value 1" })
    await adapter.create({ value: "value 2" })
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
    const id = await adapter.create(item)
    const gotItem = await adapter.get(id)
    expect(gotItem).not.toBeNull()
    expect(gotItem!.value).toEqual(item.value)
  })

  test("id が重複する item は追加できない", async () => {
    const spy = vi.spyOn(adapter, "generateId").mockReturnValue("id1")
    await adapter.create({ value: "old value" })
    await expect(async () => {
      await adapter.create({ value: "new value" })
    }).rejects.toThrow()
    spy.mockRestore()
  })

  test("存在する item を更新できる", async () => {
    const id = await adapter.create({ value: "old value" })
    await adapter.update({ id: id, value: "new value" })
    const updated = await adapter.get(id)
    expect(updated).not.toBeNull()
    expect(updated!.value).toEqual("new value")
  })

  test("存在しない item は更新できない", async () => {
    await expect(async () => {
      await adapter.update({ id: "dummyId", value: "new value" })
    }).rejects.toThrow()
  })

  test("item を削除できる", async () => {
    const id = await adapter.create({ value: "value 1" })
    let gotItem = await adapter.get(id)
    expect(gotItem).not.toBeNull()

    await adapter.delete(id)
    gotItem = await adapter.get(id)
    expect(gotItem).toBeNull()
  })

  test("複数の item を一度に更新できる", async () => {
    const id1 = await adapter.create({ value: "old value 1" })
    const id2 = await adapter.create({ value: "old value 2" })
    await adapter.updateAll([
      { id: id1, value: "new value 1" },
      { id: id2, value: "new value 2" },
    ])
    const newData1 = await adapter.get(id1)
    expect(newData1!.value).toBe("new value 1")
    const newData2 = await adapter.get(id2)
    expect(newData2!.value).toBe("new value 2")
  })

  test("updateAll で指定した ids に重複があってはならない", async () => {
    const id1 = await adapter.create({ value: "old value 1" })
    await adapter.create({ value: "old value 2" })

    await expect(async () => {
      await adapter.updateAll([
        { id: id1, value: "new value 1" },
        { id: id1, value: "new value 2" },
      ])
    }).rejects.toThrow()
  })

  test("updateAll で指定した ids と bodies の数は等しくなければならない", async () => {
    const id1 = await adapter.create({ value: "old value 1" })
    await adapter.create({ value: "old value 2" })

    await expect(async () => {
      await adapter.updateAll([{ id: id1, value: "new value 1" }])
    }).rejects.toThrow()
  })

  test("updateAll で指定した ids はすべて存在しなければならない", async () => {
    const id1 = await adapter.create({ value: "old value 1" })
    await adapter.create({ value: "old value 2" })

    await expect(async () => {
      await adapter.updateAll([
        { id: id1, value: "new value 1" },
        { id: "dummy-id", value: "new value 2" },
      ])
    }).rejects.toThrow()
  })
})
