const isMobilePlatform = () => {
  if (typeof navigator === 'undefined') return false
  if (navigator?.userAgentData) {
    if (navigator?.userAgentData?.mobile) return true
    const platform = navigator?.userAgentData?.platform || ''
    if (/Android/i.test(platform) || /iOS/i.test(platform)) {
      return true
    }
  }
  if (/Windows Phone/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent)) return true
  if (/Android/i.test(navigator.userAgent)) return true
  if (/iPhone|iPod|iPad/.test(navigator.userAgent)) return true
  if (/webOS|hpwOS/i.test(navigator.userAgent)) return true
  if (/BlackBerry|BB10|PlayBook/.test(navigator.userAgent)) return true
  if (/Opera Mini/i.test(navigator.userAgent)) return true
  if (/UCBrowser/i.test(navigator.userAgent)) return true
  if (navigator.platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1) {
    return true
  }
  return false
}

const isDesktopPlatform = () => !isMobilePlatform()

export { isMobilePlatform, isDesktopPlatform }