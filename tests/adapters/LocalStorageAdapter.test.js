import { LocalStorageAdapter } from "@/adapter/LocalStorageAdapter.js"

describe("LocalStorageAdapter.js", () => {
  let adapter

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter()
  })

  test("任意の key に対して value を保存できる", () => {
    const values = [{ id: "id1" }]
    adapter.save("testkey", values)
    const result = adapter.load("testkey")
    expect(values).toEqual(result)
  })
})
