import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            children: [
                {
                   path: '/posts/:id',
                   name: 'Dital',
                   props: (route) => {
                     return {
                        id: route.params.id
                     }
                   },
                   component: () => import('@/components/ModalWindow8.vue')
                }
            ],
            component: () => import('@/components/HomeView.vue'),
        },
        {
            path: '/registration',
            name: 'registration',
            component: () => import('@/components/RegistrationForm.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/components/AboutFormSlot.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('@/components/NotFound.vue')
        },

    ],
    history: createWebHistory()
})

export default router;