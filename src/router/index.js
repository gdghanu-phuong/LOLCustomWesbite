import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import HomeView from '@/views/HomeView.vue'
import TutorialView from '@/views/TutorialView.vue'
import ChampionsView from '@/views/ChampionsView.vue'
import ChampionDetail from '@/components/ChampionsDetail.vue'
import ShopView from '@/components/ShopPage.vue'
import PaymentView from '@/components/PaymentForm.vue'
import Loading from "@/components/Loading.vue"
import OrderConfirm from '@/components/OrderConfirm.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: TutorialView
  },
  {
    path: '/champions',
    name: 'champion',
    component: ChampionsView
  },
  {
    path: '/champion/:name',
    name: 'ChampionDetail',
    component: ChampionDetail,
    props: true
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopView
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentView
  },
  {
    path: "/loading",
    name: "loading",
    component: Loading,
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: OrderConfirm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  window.scrollTo(0,0);
  next();
})


export default router
