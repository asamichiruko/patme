import StarList from "@/components/entry/StarList.vue"
import { cleanup, render, screen } from "@testing-library/vue"

describe("StarList.vue", () => {
  afterEach(() => {
    cleanup()
  })

  test("props.stars の内容が正常にレンダリングされる", () => {
    const testStars = [
      {
        id: "star1",
        achievementId: "achievementId1",
        content: "star 1",
        date: new Date("2025-04-01").toISOString(),
      },
      {
        id: "star2",
        achievementId: "achievementId2",
        content: "star 2",
        date: new Date("2025-04-02").toISOString(),
      },
    ]
    render(StarList, {
      props: {
        stars: testStars,
      },
    })

    const items = screen.queryAllByRole("listitem")
    expect(items).toHaveLength(2)
  })

  test("props.stars が空配列でも正常にレンダリングされる", async () => {
    render(StarList, {
      props: {
        stars: [],
      },
    })

    const list = screen.queryByRole("list")
    expect(list).not.toBeInTheDocument()

    const items = screen.queryAllByRole("listitem")
    expect(items).toHaveLength(0)
  })
})
