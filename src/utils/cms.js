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
export const parseCmsContent = (cmsData, firstLevelName, moduleCode) => {
  const cmsContent = JSON.parse(cmsData) || {};
  return get(cmsContent, `zh_CN.${ firstLevelName }.modelContents`, [])
          .map((v) => (v.groupContents[moduleCode][0].fieldContents));
}