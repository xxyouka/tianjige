import { ref } from 'vue'

const SOUND_KEY = 'tianjige_sound'
const soundEnabled = ref(localStorage.getItem(SOUND_KEY) !== 'false')

// 复用单个 AudioContext（浏览器限制约6个并发实例）
let sharedContext = null

function getAudioContext() {
  if (!sharedContext || sharedContext.state === 'closed') {
    sharedContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  // 如果被挂起（浏览器自动暂停策略），恢复它
  if (sharedContext.state === 'suspended') {
    sharedContext.resume()
  }
  return sharedContext
}

function saveSoundSetting() {
  localStorage.setItem(SOUND_KEY, soundEnabled.value.toString())
}

function playTone(frequency, duration, type = 'sine') {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (e) {
    // 静默失败
  }
}

export function useSound() {
  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    saveSoundSetting()
  }

  function playClick() {
    if (!soundEnabled.value) return
    playTone(800, 0.1)
  }

  function playSuccess() {
    if (!soundEnabled.value) return
    playTone(523, 0.15)
    setTimeout(() => playTone(659, 0.15), 100)
    setTimeout(() => playTone(784, 0.2), 200)
  }

  function playError() {
    if (!soundEnabled.value) return
    playTone(300, 0.2, 'sawtooth')
  }

  function playTransition() {
    if (!soundEnabled.value) return
    playTone(440, 0.1)
    setTimeout(() => playTone(550, 0.1), 50)
  }

  function playDraw() {
    if (!soundEnabled.value) return
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        playTone(200 + Math.random() * 200, 0.1)
      }, i * 100)
    }
  }

  return {
    soundEnabled,
    toggleSound,
    playClick,
    playSuccess,
    playError,
    playTransition,
    playDraw
  }
}
