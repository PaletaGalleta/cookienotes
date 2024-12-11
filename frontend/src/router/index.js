import {createRouter, createWebHistory} from "vue-router";
import NotesView from "../views/NotesView.vue";

const routes = [{path: "/", name: "Notes", component: NotesView}];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
