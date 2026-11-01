/**
 * 数据持久化工具
 */

const DB_NAME = 'tianjige_db'
const DB_VERSION = 1

let db = null

/**
 * 初始化 IndexedDB
 */
function initDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result

      // 创建对象仓库
      if (!database.objectStoreNames.contains('history')) {
        database.createObjectStore('history', { keyPath: 'id' })
      }

      if (!database.objectStoreNames.contains('favorites')) {
        database.createObjectStore('favorites', { keyPath: 'path' })
      }

      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'key' })
      }
    }
  })
}

/**
 * IndexedDB 操作封装
 */
export const indexedDBStorage = {
  async get(storeName, key) {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  async getAll(storeName) {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  async set(storeName, data) {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  async delete(storeName, key) {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  async clear(storeName) {
    const database = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

/**
 * localStorage 封装
 */
export const localStorageWrapper = {
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  clear() {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}

/**
 * 混合存储策略
 */
export const hybridStorage = {
  async get(key, defaultValue = null) {
    // 优先从 IndexedDB 读取
    try {
      const result = await indexedDBStorage.get('settings', key)
      if (result) return result.value
    } catch {}

    // 降级到 localStorage
    return localStorageWrapper.get(key, defaultValue)
  },

  async set(key, value) {
    // 同时写入 IndexedDB 和 localStorage
    try {
      await indexedDBStorage.set('settings', { key, value })
    } catch {}

    localStorageWrapper.set(key, value)
  },

  async remove(key) {
    try {
      await indexedDBStorage.delete('settings', key)
    } catch {}

    localStorageWrapper.remove(key)
  }
}

/**
 * 数据过期管理
 */
export const expiringStorage = {
  set(key, value, ttl = 3600000) {
    const item = {
      value,
      expiry: Date.now() + ttl
    }
    localStorageWrapper.set(key, item)
  },

  get(key, defaultValue = null) {
    const item = localStorageWrapper.get(key)

    if (!item) return defaultValue

    if (Date.now() > item.expiry) {
      localStorageWrapper.remove(key)
      return defaultValue
    }

    return item.value
  }
}

/**
 * 存储空间管理
 */
export function getStorageUsage() {
  let total = 0
  const items = {}

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const value = localStorage.getItem(key)
    const size = key.length + value.length
    items[key] = size
    total += size
  }

  return {
    total,
    items,
    formatted: formatBytes(total * 2) // UTF-16 编码
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
