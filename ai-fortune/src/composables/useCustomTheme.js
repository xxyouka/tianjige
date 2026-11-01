import { ref, watch } from 'vue'
import { localStorageWrapper } from '../utils/storage'

const THEME_KEY = 'tianjige_custom_theme'

const defaultTheme = {
  primary: '#d4af37',
  primaryLight: '#f0d060',
  primaryDark: '#b8960f',
  accent: '#dc2626',
  accentLight: '#ef4444',
  accentDark: '#991b1b',
  background: '#0f0f23',
  backgroundLight: '#1a1a2e',
  card: '#16213e',
  cardLight: '#1a2744',
  text: '#e8e8e8',
  textMuted: '#8892b0',
  border: 'rgba(255, 255, 255, 0.1)'
}

const presetThemes = {
  default: {
    name: '金色经典',
    ...defaultTheme
  },
  blue: {
    name: '深海蓝',
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#1d4ed8',
    accent: '#8b5cf6',
    accentLight: '#a78bfa',
    accentDark: '#6d28d9',
    background: '#0f172a',
    backgroundLight: '#1e293b',
    card: '#1e293b',
    cardLight: '#334155',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: 'rgba(59, 130, 246, 0.2)'
  },
  green: {
    name: '翡翠绿',
    primary: '#10b981',
    primaryLight: '#34d399',
    primaryDark: '#059669',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentDark: '#d97706',
    background: '#0a1a0f',
    backgroundLight: '#1a2e1f',
    card: '#1a2e1f',
    cardLight: '#2d4a32',
    text: '#ecfdf5',
    textMuted: '#86efac',
    border: 'rgba(16, 185, 129, 0.2)'
  },
  purple: {
    name: '星空紫',
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#6d28d9',
    accent: '#ec4899',
    accentLight: '#f472b6',
    accentDark: '#be185d',
    background: '#0f0a1a',
    backgroundLight: '#1a1230',
    card: '#1a1230',
    cardLight: '#2d1f4e',
    text: '#f5f3ff',
    textMuted: '#c4b5fd',
    border: 'rgba(139, 92, 246, 0.2)'
  },
  red: {
    name: '朱砂红',
    primary: '#ef4444',
    primaryLight: '#f87171',
    primaryDark: '#dc2626',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentDark: '#d97706',
    background: '#1a0a0a',
    backgroundLight: '#2d1515',
    card: '#2d1515',
    cardLight: '#4a2020',
    text: '#fef2f2',
    textMuted: '#fca5a5',
    border: 'rgba(239, 68, 68, 0.2)'
  }
}

const currentTheme = ref({ ...defaultTheme })

export function useCustomTheme() {
  // 加载保存的主题
  function loadTheme() {
    const saved = localStorageWrapper.get(THEME_KEY)
    if (saved) {
      currentTheme.value = { ...defaultTheme, ...saved }
    }
    applyTheme()
  }

  // 应用主题
  function applyTheme() {
    const root = document.documentElement
    const theme = currentTheme.value

    root.style.setProperty('--color-gold', theme.primary)
    root.style.setProperty('--color-gold-light', theme.primaryLight)
    root.style.setProperty('--color-gold-dark', theme.primaryDark)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--color-accent-light', theme.accentLight)
    root.style.setProperty('--color-accent-dark', theme.accentDark)
    root.style.setProperty('--color-ink', theme.background)
    root.style.setProperty('--color-dark', theme.backgroundLight)
    root.style.setProperty('--color-dark-card', theme.card)
    root.style.setProperty('--color-dark-lighter', theme.cardLight)
    root.style.setProperty('--color-text', theme.text)
    root.style.setProperty('--color-text-muted', theme.textMuted)
    root.style.setProperty('--color-border', theme.border)
  }

  // 设置主题颜色
  function setThemeColor(key, value) {
    if (key in currentTheme.value) {
      currentTheme.value[key] = value
      applyTheme()
      saveTheme()
    }
  }

  // 应用预设主题
  function applyPreset(presetName) {
    const preset = presetThemes[presetName]
    if (preset) {
      currentTheme.value = { ...preset }
      applyTheme()
      saveTheme()
    }
  }

  // 保存主题
  function saveTheme() {
    localStorageWrapper.set(THEME_KEY, currentTheme.value)
  }

  // 重置主题
  function resetTheme() {
    currentTheme.value = { ...defaultTheme }
    applyTheme()
    localStorageWrapper.remove(THEME_KEY)
  }

  // 获取当前主题
  function getTheme() {
    return { ...currentTheme.value }
  }

  // 获取预设主题列表
  function getPresetThemes() {
    return Object.entries(presetThemes).map(([key, value]) => ({
      key,
      name: value.name,
      preview: {
        primary: value.primary,
        background: value.background,
        card: value.card
      }
    }))
  }

  return {
    currentTheme,
    loadTheme,
    setThemeColor,
    applyPreset,
    resetTheme,
    getTheme,
    getPresetThemes,
    presetThemes
  }
}
