import { ref, watch } from 'vue'

const HISTORY_KEY = 'tianjige_history'
const MAX_HISTORY = 50

const history = ref(loadHistory())

function loadHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.warn('保存历史记录失败:', e)
  }
}

export function useHistory() {
  function addRecord(record) {
    const newRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      ...record
    }

    history.value.unshift(newRecord)

    // 限制历史记录数量
    if (history.value.length > MAX_HISTORY) {
      history.value = history.value.slice(0, MAX_HISTORY)
    }

    saveHistory()
    return newRecord
  }

  function removeRecord(id) {
    history.value = history.value.filter(r => r.id !== id)
    saveHistory()
  }

  function clearHistory() {
    history.value = []
    saveHistory()
  }

  function getRecordsByType(type) {
    return history.value.filter(r => r.type === type)
  }

  return {
    history,
    addRecord,
    removeRecord,
    clearHistory,
    getRecordsByType
  }
}
