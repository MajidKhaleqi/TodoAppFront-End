// const notFound  = () => import("./components/404.vue");

export default [
  //   {
  //     path: "*",
  //     component: notFound,
  //     meta: {
  //       title: "صفحه یافت نشد ",
  //     },
  //   },
  {
    path: "/todos",
    component: require("./components/todos.vue").default,
  },
  {
    path: "/authorization",
    component: require("./components/authorization.vue").default,
  },
];
