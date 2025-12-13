export const getStoreLocal = (name: string) => {
  if(typeof localStorage !== 'undefined'){
    const is = localStorage.getItem(name)
    // Проверяем что значение существует и не является строкой "undefined"
    if (is && is !== 'undefined' && is !== 'null') {
      try {
        return JSON.parse(is)
      } catch (error) {
        console.error(`Failed to parse localStorage item "${name}":`, error)
        return null
      }
    }
  }
  return null
}