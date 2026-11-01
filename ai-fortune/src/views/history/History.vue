<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useHistory } from '../../composables/useHistory'
import { useFavorites } from '../../composables/useFavorites'
import { useFocusTrap } from '../../composables/useFocusTrap'
import PageHeader from '../../components/ui/PageHeader.vue'
import { typeNames as sharedTypeNames, typeIcons as sharedTypeIcons } from '../../constants/features'

const router = useRouter()
const toast = inject('toast')
const { history, removeRecord, clearHistory } = useHistory()
const { favorites } = useFavorites()
const filterType = ref('all')
const showConfirmClear = ref(false)
const showExportModal = ref(false)
const clearDialogRef = ref(null)
const exportDialogRef = ref(null)

useFocusTrap(clearDialogRef, showConfirmClear)
useFocusTrap(exportDialogRef, showExportModal)

const typeNames = { ...sharedTypeNames, all: '一键推算' }
const typeIcons = { ...sharedTypeIcons, all: '🔮' }

const filteredHistory = computed(() => {
  if (filterType.value === 'all') return history.value
  return history.value.filter(r => r.type === filterType.value)
})

const types = computed(() => {
  const set = new Set(history.value.map(r => r.type))
  return Array.from(set)
})

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`

  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function navigateToResult(record) {
  // 根据类型跳转到对应页面，携带历史数据
  router.push({
    path: `/${record.type}`,
    query: { historyId: record.id }
  })
}

function handleClear() {
  clearHistory()
  showConfirmClear.value = false
}

function exportData() {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    history: history.value,
    favorites: favorites.value
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tianjige-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showExportModal.value = false
}

function importData(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)

      // 校验数据结构
      if (!data || typeof data !== 'object') {
        throw new Error('无效的数据格式')
      }
      if (data.history && !Array.isArray(data.history)) {
        throw new Error('历史记录格式不正确')
      }
      if (data.favorites && !Array.isArray(data.favorites)) {
        throw new Error('收藏数据格式不正确')
      }
      // 校验每条历史记录的基本结构
      if (data.history) {
        for (const record of data.history) {
          if (!record.id || !record.type || !record.timestamp) {
            throw new Error('历史记录缺少必要字段')
          }
        }
      }

      if (data.history) {
        localStorage.setItem('tianjige_history', JSON.stringify(data.history))
      }
      if (data.favorites) {
        localStorage.setItem('tianjige_favorites', JSON.stringify(data.favorites))
      }
      toast?.success('导入成功')
      window.location.reload()
    } catch (err) {
      toast?.error(`导入失败：${err.message}`)
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 标题 -->
    <PageHeader
      icon="📜"
      title="历史记录"
      subtitle="查看过往的推算记录"
      accentColor="gold"
    />

    <!-- 筛选和操作 -->
    <div class="card-ancient p-4 mb-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- 筛选 -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="filterType = 'all'"
            :class="[
              filterType === 'all' ? 'bg-gold text-dark' : 'bg-dark-card text-text-muted hover:text-text',
              'px-3 py-1.5 rounded-lg text-sm transition-all'
            ]"
          >
            全部 ({{ history.length }})
          </button>
          <button
            v-for="type in types"
            :key="type"
            @click="filterType = type"
            :class="[
              filterType === type ? 'bg-gold text-dark' : 'bg-dark-card text-text-muted hover:text-text',
              'px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1'
            ]"
          >
            <span>{{ typeIcons[type] }}</span>
            <span>{{ typeNames[type] }}</span>
          </button>
        </div>

        <!-- 操作按钮 -->
        <div v-if="history.length > 0" class="flex items-center gap-3">
          <button
            @click="showExportModal = true"
            class="text-text-muted hover:text-gold text-sm transition-colors flex items-center gap-1"
          >
            <span>📤</span>
            <span>导出</span>
          </button>
          <label class="text-text-muted hover:text-gold text-sm transition-colors flex items-center gap-1 cursor-pointer">
            <span>📥</span>
            <span>导入</span>
            <input type="file" accept=".json" @change="importData" class="hidden" />
          </label>
          <button
            @click="showConfirmClear = true"
            class="text-crimson-light hover:text-crimson text-sm transition-colors"
          >
            清空记录
          </button>
        </div>
      </div>
    </div>

    <!-- 确认清空对话框 -->
    <Transition name="fade">
      <div v-if="showConfirmClear" ref="clearDialogRef" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="card-ancient p-6 max-w-sm w-full">
          <h3 class="text-lg text-gold font-display mb-3">确认清空</h3>
          <p class="text-text-muted text-sm mb-6">确定要清空所有历史记录吗？此操作不可撤销。</p>
          <div class="flex gap-3">
            <button @click="handleClear" class="btn-gold flex-1">确认清空</button>
            <button @click="showConfirmClear = false" class="btn-outline flex-1">取消</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 导出对话框 -->
    <Transition name="fade">
      <div v-if="showExportModal" ref="exportDialogRef" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="card-ancient p-6 max-w-sm w-full">
          <h3 class="text-lg text-gold font-display mb-3">导出数据</h3>
          <p class="text-text-muted text-sm mb-4">将导出以下数据：</p>
          <div class="bg-dark p-3 rounded-lg mb-4 text-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-text-muted">历史记录</span>
              <span class="text-gold">{{ history.length }} 条</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-text-muted">收藏功能</span>
              <span class="text-gold">{{ favorites.length }} 个</span>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="exportData" class="btn-gold flex-1">确认导出</button>
            <button @click="showExportModal = false" class="btn-outline flex-1">取消</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 历史列表 -->
    <div v-if="filteredHistory.length > 0" class="space-y-3">
      <div
        v-for="record in filteredHistory"
        :key="record.id"
        class="card-ancient p-4 hover:border-gold/40 transition-all cursor-pointer group"
        @click="navigateToResult(record)"
        @keydown.enter="navigateToResult(record)"
        role="link"
        tabindex="0"
        :aria-label="`${typeNames[record.type]} - ${record.summary || '查看详细结果'}`"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <!-- 图标 -->
            <div class="w-10 h-10 bg-dark rounded-lg flex items-center justify-center text-xl flex-shrink-0">
              {{ typeIcons[record.type] }}
            </div>

            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-gold text-sm font-display">{{ typeNames[record.type] }}</span>
                <span class="text-text-muted text-xs">{{ formatTime(record.timestamp) }}</span>
              </div>
              <div class="text-text text-sm truncate">
                {{ record.summary || '查看详细结果' }}
              </div>
            </div>
          </div>

          <!-- 删除按钮 -->
          <button
            @click.stop="removeRecord(record.id)"
            class="text-text-muted hover:text-crimson-light transition-colors p-1 opacity-0 group-hover:opacity-100"
            aria-label="删除记录"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16">
      <div class="text-4xl mb-4">📜</div>
      <h3 class="text-lg text-text-muted mb-2">暂无历史记录</h3>
      <p class="text-text-muted text-sm mb-6">去体验一下各种命理推算吧</p>
      <button @click="router.push('/')" class="btn-gold">
        开始推算
      </button>
    </div>
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
</style>
