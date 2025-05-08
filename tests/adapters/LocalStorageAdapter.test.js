import { LocalStorageAdapter } from "@/adapters/LocalStorageAdapter.js"

describe("LocalStorageAdapter.js", () => {
  let adapter

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter()
  })

  test("空でない文字列 key に対してオブジェクト value を JSON 文字列として保存する", () => {
    const value = [{ id: "id1" }]
    const jsonString = JSON.stringify(value)
    adapter.save("testkey", value)

    expect(localStorage.getItem("testkey")).toEqual(jsonString)
  })

  test("save に key として空文字列が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save("", {})).toThrow()
  })

  test("save に key として空白が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save(" ", {})).toThrow()
  })

  test("save に key として null が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save(null, {})).toThrow()
  })

  test("save に key として undefined が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save(undefined, {})).toThrow()
  })

  test("value としてプリミティブ値が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save("testkey", "invalid value")).toThrow()
  })

  test("value として null が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save("testkey", null)).toThrow()
  })

  test("value として undefined が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.save("testkey", undefined)).toThrow()
  })

  test("空のオブジェクト value を保存できる", () => {
    const jsonString = JSON.stringify({})
    adapter.save("testkey", {})

    expect(localStorage.getItem("testkey")).toEqual(jsonString)
  })

  test("存在する key から value を受け取れる", () => {
    const value = [{ id: "id1" }]
    localStorage.setItem("testkey", JSON.stringify(value))
    const result = adapter.load("testkey")
    expect(value).toEqual(result)
  })

  test("load に key として空文字列が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.load("", {})).toThrow()
  })

  test("load に key として空白が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.load(" ", {})).toThrow()
  })

  test("load に key として null が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.load(null, {})).toThrow()
  })

  test("load に key として undefined が与えられた場合はエラーを送出する", () => {
    expect(() => adapter.load(undefined, {})).toThrow()
  })
})
