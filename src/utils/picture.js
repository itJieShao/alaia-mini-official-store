export const photoCompress = (url, long) => {
  if (!url) return ''
  // 某些机型不支持  ?x-oss-process=image/format,webp
  if (long) {
    return `${url}?x-oss-process=image/resize,l_${long},m_mfit`
  }
  return `${url}`
}
