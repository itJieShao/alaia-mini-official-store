export const formatViewData = (data, defaultData) => {
  try {
    if (data) {
      return JSON.parse(data)
    }
    return defaultData
  } catch (error) {
    console.error(error, 'cms中的JSON数据解析失败')
    return defaultData
  }
}
