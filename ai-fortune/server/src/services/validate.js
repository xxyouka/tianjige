// 通用输入校验工具

/**
 * 清理用户自由文本输入：去首尾空白、限制长度、确保是字符串
 * @param {*} text - 原始输入
 * @param {number} maxLen - 最大长度（默认 500）
 * @returns {string}
 */
function sanitizeText(text, maxLen = 500) {
  if (typeof text !== 'string') return ''
  return text.trim().slice(0, maxLen)
}

/**
 * 校验日期合法性（含月份天数交叉校验）
 * @param {number} y - 年
 * @param {number} m - 月
 * @param {number} d - 日
 * @returns {string|null} 错误信息，合法返回 null
 */
function validateDate(y, m, d) {
  if (isNaN(y) || isNaN(m) || isNaN(d)) return '请提供有效的日期'
  if (y < 1900 || y > 2100) return '年份超出范围（1900-2100）'
  if (m < 1 || m > 12) return '月份范围不正确'
  if (d < 1) return '日期范围不正确'

  const daysInMonth = new Date(y, m, 0).getDate()
  if (d > daysInMonth) return `${y}年${m}月只有${daysInMonth}天`

  return null
}

/**
 * 校验时辰（0-23）
 * @param {number} h
 * @returns {string|null}
 */
function validateHour(h) {
  if (isNaN(h) || h < 0 || h > 23) return '时辰范围不正确（0-23）'
  return null
}

module.exports = { sanitizeText, validateDate, validateHour }
