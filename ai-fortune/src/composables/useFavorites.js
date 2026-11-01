import { ref } from 'vue'

const FAVORITES_KEY = 'tianjige_favorites'

let initial = []
try { initial = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]') } catch {}
const favorites = ref(initial)

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
}

export function useFavorites() {
  function isFavorite(path) {
    return favorites.value.includes(path)
  }

  function toggleFavorite(path) {
    const index = favorites.value.indexOf(path)
    if (index === -1) {
      favorites.value.push(path)
    } else {
      favorites.value.splice(index, 1)
    }
    saveFavorites()
  }

  function addFavorite(path) {
    if (!isFavorite(path)) {
      favorites.value.push(path)
      saveFavorites()
    }
  }

  function removeFavorite(path) {
    const index = favorites.value.indexOf(path)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  function clearFavorites() {
    favorites.value = []
    saveFavorites()
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites
  }
}
