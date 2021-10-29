import { get } from '@/utils/utilityOperationHelper';

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


// 解析cms数据
export const parseCmsContent = (cmsData, firstLevelName, moduleCode, getPar) => {
  const cmsContent = cmsData ? JSON.parse(cmsData) : {};
  return get(cmsContent, `zh_CN.${ firstLevelName }.modelContents`, [])
          .map((v) => (getPar?v.groupContents[moduleCode][0]:v.groupContents[moduleCode][0].fieldContents));
}
