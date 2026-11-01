import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载
const Home = () => import('../views/home/Home.vue')
const Bazi = () => import('../views/bazi/Bazi.vue')
const Zhouyi = () => import('../views/zhouyi/Zhouyi.vue')
const Meihua = () => import('../views/meihua/Meihua.vue')
const Chengu = () => import('../views/chengu/Chengu.vue')
const Cezi = () => import('../views/cezi/Cezi.vue')
const Lingqian = () => import('../views/lingqian/Lingqian.vue')
const Xingming = () => import('../views/xingming/Xingming.vue')
const Xingzuo = () => import('../views/xingzuo/Xingzuo.vue')
const Tarot = () => import('../views/tarot/Tarot.vue')
const Astrology = () => import('../views/astrology/Astrology.vue')
const Numerology = () => import('../views/numerology/Numerology.vue')
const Runes = () => import('../views/runes/Runes.vue')
const Flower = () => import('../views/flower/Flower.vue')
const History = () => import('../views/history/History.vue')
const Comprehensive = () => import('../views/comprehensive/Comprehensive.vue')
const Dream = () => import('../views/dream/Dream.vue')
const Daily = () => import('../views/daily/Daily.vue')
const ZiWei = () => import('../views/ziwei/ZiWei.vue')
const Palmistry = () => import('../views/palmistry/Palmistry.vue')
const FaceReading = () => import('../views/faceReading/FaceReading.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: '天机阁 · AI 命理' } },
  // 中国命理
  { path: '/bazi', name: 'Bazi', component: Bazi, meta: { title: '八字排盘 · 天机阁' } },
  { path: '/zhouyi', name: 'Zhouyi', component: Zhouyi, meta: { title: '周易占卜 · 天机阁' } },
  { path: '/meihua', name: 'Meihua', component: Meihua, meta: { title: '梅花易数 · 天机阁' } },
  { path: '/chengu', name: 'Chengu', component: Chengu, meta: { title: '称骨算命 · 天机阁' } },
  { path: '/cezi', name: 'Cezi', component: Cezi, meta: { title: '测字 · 天机阁' } },
  { path: '/lingqian', name: 'Lingqian', component: Lingqian, meta: { title: '灵签 · 天机阁' } },
  { path: '/xingming', name: 'Xingming', component: Xingming, meta: { title: '姓名测算 · 天机阁' } },
  // 西方体系
  { path: '/xingzuo', name: 'Xingzuo', component: Xingzuo, meta: { title: '星座运势 · 天机阁' } },
  { path: '/tarot', name: 'Tarot', component: Tarot, meta: { title: '塔罗牌 · 天机阁' } },
  { path: '/astrology', name: 'Astrology', component: Astrology, meta: { title: '星盘 · 天机阁' } },
  { path: '/numerology', name: 'Numerology', component: Numerology, meta: { title: '数字命理 · 天机阁' } },
  { path: '/runes', name: 'Runes', component: Runes, meta: { title: '卢恩符文 · 天机阁' } },
  { path: '/flower', name: 'Flower', component: Flower, meta: { title: '生日花语 · 天机阁' } },
  // 历史记录
  { path: '/history', name: 'History', component: History, meta: { title: '历史记录 · 天机阁' } },
  // 综合运势
  { path: '/comprehensive', name: 'Comprehensive', component: Comprehensive, meta: { title: '综合运势 · 天机阁' } },
  // 梦境解析
  { path: '/dream', name: 'Dream', component: Dream, meta: { title: '梦境解析 · 天机阁' } },
  // 每日运势
  { path: '/daily', name: 'Daily', component: Daily, meta: { title: '每日运势 · 天机阁' } },
  // 紫微斗数
  { path: '/ziwei', name: 'ZiWei', component: ZiWei, meta: { title: '紫微斗数 · 天机阁' } },
  // 手相
  { path: '/palmistry', name: 'Palmistry', component: Palmistry, meta: { title: '手相分析 · 天机阁' } },
  // 面相
  { path: '/face-reading', name: 'FaceReading', component: FaceReading, meta: { title: '面相分析 · 天机阁' } },
  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: '页面未找到 · 天机阁' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

// 路由预加载
router.afterEach((to) => {
  // 预加载相邻路由
  const adjacentRoutes = {
    '/': ['/bazi', '/tarot', '/comprehensive'],
    '/bazi': ['/zhouyi', '/ziwei'],
    '/zhouyi': ['/bazi', '/meihua'],
    '/tarot': ['/xingzuo', '/astrology'],
    '/ziwei': ['/bazi', '/palmistry'],
  }

  if (adjacentRoutes[to.path]) {
    adjacentRoutes[to.path].forEach(path => {
      const route = routes.find(r => r.path === path)
      if (route?.component) {
        route.component()
      }
    })
  }
})

export default router
