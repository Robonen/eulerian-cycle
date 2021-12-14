import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

const app = createApp(App).use(router);

app.directive("click-outside", {
  beforeMount(el, binding) {
    const ourClickEventHandler = (event) => {
      if (!el.contains(event.target) && el !== event.target) {
        binding.value(event, el);
      }
    };
    el.__vueClickEventHandler__ = ourClickEventHandler;
    document.addEventListener("click", ourClickEventHandler);
  },
  unmounted(el) {
    document.removeEventListener("click", el.__vueClickEventHandler__);
  },
});

app.mount("#app");
