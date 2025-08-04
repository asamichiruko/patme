declare module "*.vue" {
  import { DefineComponent } from "vue"

  const component: DefineComponent<
    Record<string, unknown>, // props
    Record<string, unknown>, // raw bindings (setup return)
    unknown // data()
  >

  export default component
}
