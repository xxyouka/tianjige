import { ref, computed, watch } from 'vue'
import { getDaysInMonth } from '../constants'

/**
 * 出生日期选择 composable
 * @param {Object} options
 * @param {boolean} [options.includeYear=true] - 是否包含年份
 * @param {boolean} [options.includeHour=true] - 是否包含时辰
 */
export function useBirthDate(options = {}) {
  const { includeYear = true, includeHour = true } = options

  const year = ref('')
  const month = ref('')
  const day = ref('')
  const hour = ref('')

  const currentYear = new Date().getFullYear()
  const years = includeYear ? Array.from({ length: 100 }, (_, i) => currentYear - i) : []
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const hours = includeHour ? Array.from({ length: 24 }, (_, i) => i) : []

  const days = computed(() => {
    const y = includeYear ? year.value : 2023
    const count = getDaysInMonth(y, month.value)
    return Array.from({ length: count }, (_, i) => i + 1)
  })

  watch([year, month], () => {
    if (day.value && day.value > days.value.length) {
      day.value = ''
    }
  })

  return { year, month, day, hour, years, months, days, hours }
}
