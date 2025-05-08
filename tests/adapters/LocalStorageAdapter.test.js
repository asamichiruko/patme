import { LocalStorageAdapter } from "@/adapters/LocalStorageAdapter.js"

describe("LocalStorageAdapter.js", () => {
  let adapter

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter()
  })

  test("正常な key に対してオブジェクト value を JSON 文字列として save できる", () => {
    const value = [{ id: "id1" }]
    const jsonString = JSON.stringify(value)
    adapter.save("testkey", value)

    expect(localStorage.getItem("testkey")).toEqual(jsonString)
  })

  test("正常な key に対して空のオブジェクト value を save できる", () => {
    const jsonString = JSON.stringify({})
    adapter.save("testkey", {})

    expect(localStorage.getItem("testkey")).toEqual(jsonString)
  })

  test("save に不正な key が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save("", {})).toThrow()
    expect(() => adapter.save(" ", {})).toThrow()
    expect(() => adapter.save(null, {})).toThrow()
    expect(() => adapter.save(undefined, {})).toThrow()
  })

  test("save に value として不正な値が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save("testkey", "invalid value")).toThrow()
    expect(() => adapter.save("testkey", null)).toThrow()
    expect(() => adapter.save("testkey", undefined)).toThrow()
  })

  test("値が存在する key から value を load できる", () => {
    const value = [{ id: "id1" }]
    localStorage.setItem("testkey", JSON.stringify(value))
    const result = adapter.load("testkey")
    expect(value).toEqual(result)
  })

  test("値が存在しない key を load するとエラーを送出する", () => {
    expect(() => adapter.load("invalid key", {})).toThrow()
  })

  test("load に不正な key が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.load("", {})).toThrow()
    expect(() => adapter.load(" ", {})).toThrow()
    expect(() => adapter.load(null, {})).toThrow()
    expect(() => adapter.load(undefined, {})).toThrow()
  })

  test("has に不正な key が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.load("", {})).toThrow()
    expect(() => adapter.load(" ", {})).toThrow()
    expect(() => adapter.load(null, {})).toThrow()
    expect(() => adapter.load(undefined, {})).toThrow()
  })

  test("has に値が存在する正常なキーを渡すと true を返す", () => {
    localStorage.setItem("testkey", JSON.stringify({}))
    const result = adapter.has("testkey")
    expect(result).toBe(true)
  })

  test("has に値が存在しない正常なキーを渡すと false を返す", () => {
    const result = adapter.has("testkey")
    expect(result).toBe(false)
  })
})
