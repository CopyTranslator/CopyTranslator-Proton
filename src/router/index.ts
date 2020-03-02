import Vue from "vue";
import VueRouter from "vue-router";
import Contrast from "../views/Contrast.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Contrast",
    component: Contrast
  },
  {
    path: "/contrast",
    name: "contrast2",
    component: Contrast
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
