const isMobilePlatform = () => {
  if (typeof navigator === 'undefined') return false
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|bb10|playbook|iemobile|windows phone|opera mini|ucbrowser/i
  if (navigator?.userAgentData) {
    if (navigator?.userAgentData?.mobile) return true
    const platform = navigator?.userAgentData?.platform ?? ''
    if (mobileRegex.test(platform)) {
      return true
    }
  }
  if (mobileRegex.test(navigator.userAgent)) {
    return true
  }
  if (navigator.platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1) {
    return true
  }
  return false
}

export { isMobilePlatform }