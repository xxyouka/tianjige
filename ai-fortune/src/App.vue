<script setup>
import { ref, computed, watch, onMounted, onUnmounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BackToTop from './components/ui/BackToTop.vue'
import AppFooter from './components/ui/AppFooter.vue'
import SearchModal from './components/ui/SearchModal.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
import KeyboardHelp from './components/ui/KeyboardHelp.vue'
import ErrorBoundary from './components/ui/ErrorBoundary.vue'
import UserGuide from './components/ui/UserGuide.vue'
import ThemeCustomizer from './components/ui/ThemeCustomizer.vue'
import QuickActions from './components/ui/QuickActions.vue'
import FeedbackButton from './components/ui/FeedbackButton.vue'
import { useFavorites } from './composables/useFavorites'
import { useTheme } from './composables/useTheme'
import { useSound } from './composables/useSound'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(true)
const isMobile = ref(window.innerWidth < 768)
const showSearch = ref(false)
const showKeyboardHelp = ref(false)
const showGuide = ref(false)
const showThemeCustomizer = ref(false)
const toastRef = ref(null)
const { favorites, isFavorite, toggleFavorite } = useFavorites()
const { theme, toggleTheme, isDark } = useTheme()
const { soundEnabled, toggleSound, playClick } = useSound()

// 提供toast功能给子组件
provide('toast', {
  success: (msg) => toastRef.value?.success(msg),
  error: (msg) => toastRef.value?.error(msg),
  warning: (msg) => toastRef.value?.warning(msg),
  info: (msg) => toastRef.value?.info(msg)
})

function onResize() {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) sidebarOpen.value = true
}

const menuSections = [
  {
    title: '中国命理',
    items: [
      { path: '/bazi', name: '八字排盘', icon: '☰' },
      { path: '/zhouyi', name: '周易占卜', icon: '☯' },
      { path: '/meihua', name: '梅花易数', icon: '🌸' },
      { path: '/chengu', name: '称骨算命', icon: '⚖' },
      { path: '/cezi', name: '测字', icon: '字' },
      { path: '/lingqian', name: '灵签', icon: '🎋' },
      { path: '/xingming', name: '姓名测算', icon: '📝' },
      { path: '/ziwei', name: '紫微斗数', icon: '⭐' },
      { path: '/palmistry', name: '手相分析', icon: '✋' },
      { path: '/face-reading', name: '面相分析', icon: '👤' },
    ]
  },
  {
    title: '西方体系',
    items: [
      { path: '/xingzuo', name: '星座运势', icon: '⭐' },
      { path: '/tarot', name: '塔罗牌', icon: '🃏' },
      { path: '/astrology', name: '星盘', icon: '✧' },
      { path: '/numerology', name: '数字命理', icon: '🔢' },
      { path: '/runes', name: '卢恩符文', icon: 'ᚱ' },
      { path: '/flower', name: '生日花语', icon: '🌺' },
    ]
  }
]

const allMenuItems = menuSections.flatMap(s => s.items)

const favoriteItems = computed(() => {
  return favorites.value
    .map(path => allMenuItems.find(item => item.path === path))
    .filter(Boolean)
})

function navigate(path) {
  playClick()
  router.push(path)
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

// 键盘快捷键
function handleKeydown(e) {
  // Ctrl+K 或 / 打开搜索
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !e.target.closest('input, textarea, select'))) {
    e.preventDefault()
    showSearch.value = true
    return
  }

  // ? 显示快捷键帮助
  if (e.key === '?' && !e.target.closest('input, textarea, select')) {
    showKeyboardHelp.value = !showKeyboardHelp.value
    return
  }

  // G 显示使用引导
  if (e.key === 'g' || e.key === 'G') {
    if (!e.target.closest('input, textarea, select')) {
      showGuide.value = !showGuide.value
      return
    }
  }

  // 忽略输入框内的按键
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    return
  }

  // Esc 关闭弹窗和侧边栏
  if (e.key === 'Escape') {
    if (showKeyboardHelp.value) {
      showKeyboardHelp.value = false
      return
    }
    if (showSearch.value) {
      showSearch.value = false
      return
    }
    if (isMobile.value && sidebarOpen.value) {
      sidebarOpen.value = false
      return
    }
  }

  // 数字键快速导航
  const allItems = menuSections.flatMap(s => s.items)
  const num = parseInt(e.key)
  if (num >= 1 && num <= 9 && num <= allItems.length) {
    navigate(allItems[num - 1].path)
    return
  }

  // H 回首页
  if (e.key === 'h' || e.key === 'H') {
    navigate('/')
    return
  }

  // L 查看历史
  if (e.key === 'l' || e.key === 'L') {
    navigate('/history')
    return
  }
}

watch(() => route.path, () => {
  if (isMobile.value) sidebarOpen.value = false
})

onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', handleKeydown)
  if (isMobile.value) sidebarOpen.value = false

  // 首次访问显示引导
  if (!localStorage.getItem('tianjige_guide_seen')) {
    setTimeout(() => {
      showGuide.value = true
    }, 1000)
  }

  // 监听 SW 更新
  window.addEventListener('sw-update', () => {
    toastRef.value?.info('发现新版本，正在更新...')
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="flex min-h-screen bg-ink">
    <!-- 手机端遮罩 -->
    <Transition name="fade">
      <div
        v-if="isMobile && sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/60 z-40 md:hidden"
        aria-hidden="true"
      ></div>
    </Transition>

    <!-- 侧边栏 -->
    <aside
      :class="[
        isMobile
          ? (sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64')
          : (sidebarOpen ? 'w-64' : 'w-16'),
        'bg-dark-lighter border-r border-border flex flex-col',
        isMobile ? 'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out' : 'relative transition-all duration-300 ease-in-out'
      ]"
      role="navigation"
      aria-label="主导航"
    >
      <!-- Logo -->
      <div class="p-4 border-b border-border flex items-center justify-between min-h-[56px]">
        <div v-if="sidebarOpen || isMobile" class="flex items-center gap-2">
          <span class="text-2xl animate-spin-slow" style="animation-duration: 15s;">☯</span>
          <span class="text-gold font-display text-lg text-shimmer">天机阁</span>
        </div>
        <div v-else class="w-full flex justify-center">
          <span class="text-2xl animate-spin-slow" style="animation-duration: 15s;">☯</span>
        </div>
        <button
          v-if="sidebarOpen || isMobile"
          @click="toggleSidebar"
          class="text-text-muted hover:text-gold transition-colors p-1 rounded-lg hover:bg-dark-card"
          :aria-label="isMobile ? '关闭菜单' : '收起侧边栏'"
        >
          <span v-if="isMobile" class="text-xl">✕</span>
          <span v-else>◀</span>
        </button>
      </div>

      <!-- 首页 -->
      <div
        @click="navigate('/')"
        @keydown.enter="navigate('/')"
        :title="!sidebarOpen && !isMobile ? '首页' : undefined"
        :aria-label="!sidebarOpen && !isMobile ? '首页' : undefined"
        :aria-current="route.path === '/' ? 'page' : undefined"
        tabindex="0"
        role="link"
        :class="[
          route.path === '/'
            ? 'bg-dark-card text-gold border-l-2 border-gold'
            : 'text-text-muted hover:text-text hover:bg-dark-card',
          'px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3'
        ]"
      >
        <span class="text-xl w-6 text-center">🏠</span>
        <span v-if="sidebarOpen">首页</span>
      </div>

      <!-- 历史记录 -->
      <div
        @click="navigate('/history')"
        @keydown.enter="navigate('/history')"
        :title="!sidebarOpen && !isMobile ? '历史记录' : undefined"
        :aria-label="!sidebarOpen && !isMobile ? '历史记录' : undefined"
        :aria-current="route.path === '/history' ? 'page' : undefined"
        tabindex="0"
        role="link"
        :class="[
          route.path === '/history'
            ? 'bg-dark-card text-gold border-l-2 border-gold'
            : 'text-text-muted hover:text-text hover:bg-dark-card',
          'px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3'
        ]"
      >
        <span class="text-xl w-6 text-center">📜</span>
        <span v-if="sidebarOpen">历史记录</span>
      </div>

      <!-- 收藏 -->
      <div v-if="sidebarOpen && favoriteItems.length > 0" class="mb-2">
        <div class="px-4 py-2 text-text-muted text-xs uppercase tracking-wider">
          收藏
        </div>
        <div
          v-for="item in favoriteItems"
          :key="item.path"
          @click="navigate(item.path)"
          @keydown.enter="navigate(item.path)"
          tabindex="0"
          role="link"
          :class="[
            route.path === item.path
              ? 'bg-dark-card text-gold border-l-2 border-gold'
              : 'text-text-muted hover:text-text hover:bg-dark-card hover:border-l-2 hover:border-gold/30',
            'px-4 py-2 cursor-pointer transition-all duration-200 flex items-center gap-3 border-l-2 border-transparent'
          ]"
        >
          <span class="text-base w-6 text-center">{{ item.icon }}</span>
          <span class="text-sm">{{ item.name }}</span>
          <button
            @click.stop="toggleFavorite(item.path)"
            class="ml-auto text-gold opacity-60 hover:opacity-100 transition-opacity"
            title="取消收藏"
          >
            ★
          </button>
        </div>
      </div>

      <!-- 菜单分区 -->
      <nav class="flex-1 overflow-y-auto">
        <div v-for="section in menuSections" :key="section.title" class="mb-2">
          <!-- 分区标题 -->
          <div v-if="sidebarOpen" class="px-4 py-2 text-text-muted text-xs uppercase tracking-wider">
            {{ section.title }}
          </div>
          <div v-else class="h-px bg-border mx-2 my-2"></div>

          <!-- 菜单项 -->
          <div
            v-for="(item, index) in section.items"
            :key="item.path"
            @click="navigate(item.path)"
            @keydown.enter="navigate(item.path)"
            :title="!sidebarOpen && !isMobile ? item.name : undefined"
            :aria-label="!sidebarOpen && !isMobile ? item.name : undefined"
            :aria-current="route.path === item.path ? 'page' : undefined"
            tabindex="0"
            role="link"
            :class="[
              route.path === item.path
                ? 'bg-dark-card text-gold border-l-2 border-gold shadow-lg shadow-gold/10'
                : 'text-text-muted hover:text-text hover:bg-dark-card hover:border-l-2 hover:border-gold/30',
              'px-4 py-2.5 cursor-pointer transition-all duration-200 flex items-center gap-3 border-l-2 border-transparent group'
            ]"
          >
            <span class="text-lg w-6 text-center transition-transform duration-200 group-hover:scale-110">{{ item.icon }}</span>
            <span v-if="sidebarOpen" class="text-sm transition-colors duration-200">{{ item.name }}</span>
            <span v-if="sidebarOpen && !isMobile" class="ml-auto flex items-center gap-1">
              <button
                @click.stop="toggleFavorite(item.path)"
                :class="[
                  isFavorite(item.path) ? 'text-gold opacity-100' : 'text-text-muted opacity-0 group-hover:opacity-40',
                  'transition-all hover:opacity-100'
                ]"
                :title="isFavorite(item.path) ? '取消收藏' : '收藏'"
              >
                {{ isFavorite(item.path) ? '★' : '☆' }}
              </button>
              <span class="text-[10px] opacity-0 group-hover:opacity-40 transition-opacity">
                {{ index + 1 }}
              </span>
            </span>
          </div>
        </div>
      </nav>

      <!-- 搜索按钮 -->
      <div
        v-if="sidebarOpen"
        @click="showSearch = true"
        class="mx-3 mb-2 px-3 py-2 rounded-lg border border-border hover:border-gold-dark bg-dark cursor-pointer transition-all flex items-center gap-2 text-text-muted hover:text-text"
      >
        <span class="text-sm">🔍</span>
        <span class="text-xs flex-1">搜索功能</span>
        <kbd class="px-1.5 py-0.5 text-[10px] bg-dark-lighter rounded border border-border">/</kbd>
      </div>

      <!-- 主题切换 -->
      <div
        v-if="sidebarOpen"
        @click="toggleTheme"
        class="mx-3 mb-2 px-3 py-2 rounded-lg border border-border hover:border-gold-dark bg-dark cursor-pointer transition-all flex items-center gap-2 text-text-muted hover:text-text"
      >
        <span class="text-sm">{{ isDark() ? '🌙' : '☀️' }}</span>
        <span class="text-xs flex-1">{{ isDark() ? '深色模式' : '浅色模式' }}</span>
      </div>

      <!-- 主题自定义 -->
      <div
        v-if="sidebarOpen"
        @click="showThemeCustomizer = true"
        class="mx-3 mb-2 px-3 py-2 rounded-lg border border-border hover:border-gold-dark bg-dark cursor-pointer transition-all flex items-center gap-2 text-text-muted hover:text-text"
      >
        <span class="text-sm">🎨</span>
        <span class="text-xs flex-1">主题自定义</span>
      </div>

      <!-- 音效切换 -->
      <div
        v-if="sidebarOpen"
        @click="toggleSound"
        class="mx-3 mb-2 px-3 py-2 rounded-lg border border-border hover:border-gold-dark bg-dark cursor-pointer transition-all flex items-center gap-2 text-text-muted hover:text-text"
      >
        <span class="text-sm">{{ soundEnabled ? '🔊' : '🔇' }}</span>
        <span class="text-xs flex-1">{{ soundEnabled ? '音效开启' : '音效关闭' }}</span>
      </div>

      <!-- 使用引导 -->
      <div
        v-if="sidebarOpen"
        @click="showGuide = true"
        class="mx-3 mb-2 px-3 py-2 rounded-lg border border-border hover:border-gold-dark bg-dark cursor-pointer transition-all flex items-center gap-2 text-text-muted hover:text-text"
      >
        <span class="text-sm">❓</span>
        <span class="text-xs flex-1">使用引导</span>
      </div>

      <!-- 底部 -->
      <div v-if="sidebarOpen" class="p-4 border-t border-border text-text-muted text-xs text-center">
        <div class="flex items-center justify-center gap-1 mb-2">
          <span class="text-gold">☯</span>
          <span>天机阁 · AI 命理</span>
        </div>
        <div class="text-[10px] opacity-60">
          按 <kbd class="px-1 py-0.5 bg-dark rounded text-gold">/</kbd> 搜索 · <kbd class="px-1 py-0.5 bg-dark rounded text-gold">1</kbd>-<kbd class="px-1 py-0.5 bg-dark rounded text-gold">9</kbd> 导航
        </div>
      </div>
      <div
        v-else-if="!isMobile"
        @click="toggleSidebar"
        class="p-3 border-t border-border text-text-muted text-center cursor-pointer hover:text-gold hover:bg-dark-card transition-all"
        title="展开侧边栏"
      >
        <span class="text-lg">▶</span>
      </div>
    </aside>

    <!-- 主内容 -->
    <main class="flex-1 overflow-auto min-w-0" role="main">
      <!-- 手机端顶栏 -->
      <header class="md:hidden sticky top-0 z-30 bg-dark-lighter border-b border-border px-4 py-3 flex items-center justify-between">
        <button @click="sidebarOpen = true" class="text-text-muted hover:text-gold transition-colors p-1" aria-label="打开菜单">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <span class="text-lg animate-spin-slow" aria-hidden="true">☯</span>
          <span class="text-gold font-display">天机阁</span>
        </div>
        <div class="w-8"></div>
      </header>

      <div class="max-w-4xl mx-auto p-4 md:p-8">
        <ErrorBoundary>
          <router-view v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </ErrorBoundary>

        <!-- 底部信息 -->
        <AppFooter role="contentinfo" />
      </div>
    </main>

    <!-- 回到顶部按钮 -->
    <BackToTop />

    <!-- 搜索弹窗 -->
    <SearchModal :show="showSearch" @close="showSearch = false" />

    <!-- 快捷键帮助 -->
    <KeyboardHelp :show="showKeyboardHelp" @close="showKeyboardHelp = false" />

    <!-- 使用引导 -->
    <UserGuide :show="showGuide" @close="showGuide = false" />

    <!-- 主题自定义 -->
    <ThemeCustomizer :show="showThemeCustomizer" @close="showThemeCustomizer = false" />

    <!-- 快捷操作面板 -->
    <QuickActions
      @search="showSearch = true"
      @theme="showThemeCustomizer = true"
      @help="showKeyboardHelp = true"
    />

    <!-- 反馈按钮 -->
    <FeedbackButton />

    <!-- 通知提示 -->
    <ToastContainer ref="toastRef" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.99);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.99);
}
</style>
