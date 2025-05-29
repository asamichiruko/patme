import TagOrderList from "@/components/tag/TagOrderList.vue"
import { mount, enableAutoUnmount } from "@vue/test-utils"
import { ref } from "vue"

enableAutoUnmount(afterEach)

describe("TagOrderList.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("タグの配列を与えるとその順でタグが表示される", () => {
    const testTags = ref([
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
    ])
    const wrapper = mount(TagOrderList, {
      props: {
        tags: testTags.value,
        "onUpdate:tags": (newTags) => {
          testTags.value = newTags
        },
      },
    })

    const listitems = wrapper.findAll("li")
    expect(listitems).toHaveLength(2)
    expect(listitems[0].text()).toEqual("tag1")
    expect(listitems[1].text()).toEqual("tag2")
  })
})
