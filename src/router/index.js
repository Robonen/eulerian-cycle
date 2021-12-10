import { createRouter, createWebHistory } from "vue-router";

import View from "@/views/View.vue";

const routes = [
  {
    path: "/",
    name: "view",
    component: View,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
