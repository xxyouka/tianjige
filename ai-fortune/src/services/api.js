const BASE_URL = '/api'

async function request(url, options = {}) {
  let response
  try {
    const { signal, ...rest } = options
    response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...rest.headers
      },
      signal,
      ...rest
    })
  } catch (err) {
    throw new Error('网络连接失败，请检查网络')
  }

  if (!response.ok) {
    let message = '请求失败'
    try {
      const error = await response.json()
      message = error.error || message
    } catch {}
    throw new Error(message)
  }

  return response.json()
}

export const api = {
  // 全算
  calculateAll(data, opts = {}) {
    return request('/all/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 八字
  calculateBazi(data, opts = {}) {
    return request('/bazi/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 周易
  divineZhouyi(data, opts = {}) {
    return request('/zhouyi/divine', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 梅花易数
  divineMeihua(data, opts = {}) {
    return request('/meihua/divine', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 星座
  getSigns() {
    return request('/xingzuo/signs')
  },
  predictXingzuo(data, opts = {}) {
    return request('/xingzuo/predict', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 塔罗
  getSpreads() {
    return request('/tarot/spreads')
  },
  drawTarot(data, opts = {}) {
    return request('/tarot/draw', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 灵签
  drawLingqian(data, opts = {}) {
    return request('/lingqian/draw', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 测字
  analyzeCezi(data, opts = {}) {
    return request('/cezi/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 称骨
  calculateChengu(data, opts = {}) {
    return request('/chengu/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 星盘
  calculateAstrology(data, opts = {}) {
    return request('/astrology/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 数字命理
  calculateNumerology(data, opts = {}) {
    return request('/numerology/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 卢恩符文
  drawRunes(data, opts = {}) {
    return request('/runes/draw', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 生日花语
  lookupFlower(data, opts = {}) {
    return request('/flower/lookup', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 姓名测算
  analyzeXingming(data, opts = {}) {
    return request('/xingming/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 梦境解析
  analyzeDream(data, opts = {}) {
    return request('/dream/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 每日运势
  analyzeDaily(data, opts = {}) {
    return request('/daily/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 综合运势
  analyzeComprehensive(data, opts = {}) {
    return request('/comprehensive/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 紫微斗数
  analyzeZiwei(data, opts = {}) {
    return request('/ziwei/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 手相分析
  analyzePalmistry(data, opts = {}) {
    return request('/palmistry/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  },

  // 面相分析
  analyzeFaceReading(data, opts = {}) {
    return request('/faceReading/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
      ...opts
    })
  }
}
