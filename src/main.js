import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import Login from "./Login.vue"; // TAMBAH INI

import Dashboard from "./Dashboard.vue";
import Boards from "./Boards.vue";
import Reports from "./Reports.vue";
import Timetracker from "./Timetracker.vue";
import Projects from "./Projects.vue";
import Team from "./Team.vue";

import "./index.css";

const routes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: Dashboard },
  { path: "/boards", component: Boards },
  { path: "/tracker", component: Timetracker },
  { path: "/reports", component: Reports },
  { path: "/projects", component: Projects },
  { path: "/team", component: Team },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");