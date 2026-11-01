import { ref, watch } from 'vue'

const THEME_KEY = 'tianjige_theme'

const theme = ref(localStorage.getItem(THEME_KEY) || 'dark')

function applyTheme(newTheme) {
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem(THEME_KEY, newTheme)
}

// 初始化主题
applyTheme(theme.value)

watch(theme, (newTheme) => {
  applyTheme(newTheme)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(newTheme) {
    theme.value = newTheme
  }

  function isDark() {
    return theme.value === 'dark'
  }

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark
  }
}
